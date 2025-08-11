using System.Net.Http.Json;
using BookRadar.Web.Models;

namespace BookRadar.Web.Services;

public class OpenLibraryService : IOpenLibraryService
{
    private readonly HttpClient _http;
    private const int DEFAULT_PAGE_SIZE = 100; // Tamaño de página por defecto de Open Library
    private const int MAX_RESULTS = 10000; // Límite máximo para evitar llamadas infinitas

    public OpenLibraryService(HttpClient http) => _http = http;

    private record OpenLibraryResponse(List<Doc> docs, int numFound, int start, bool? numFoundExact);
    private record Doc(string? title, int? first_publish_year, List<string>? publisher);

    public async Task<List<BookVm>> BuscarPorAutorAsync(string autor, CancellationToken ct = default)
    {
        // Mantener compatibilidad con el método existente
        return await BuscarPorAutorConPaginacionAsync(autor, 100, ct);
    }

    public async Task<List<BookVm>> BuscarPorAutorConPaginacionAsync(string autor, int? limite = null, CancellationToken ct = default)
    {
        var limiteReal = limite ?? DEFAULT_PAGE_SIZE;
        var url = $"search.json?author={Uri.EscapeDataString(autor)}&limit={limiteReal}";
        var resp = await _http.GetFromJsonAsync<OpenLibraryResponse>(url, ct);

        var list = new List<BookVm>();
        if (resp?.docs is null) return list;

        foreach (var d in resp.docs)
        {
            if (string.IsNullOrWhiteSpace(d.title)) continue;
            list.Add(new BookVm
            {
                Titulo = d.title.Trim(),
                AnioPublicacion = d.first_publish_year,
                Editorial = d.publisher?.FirstOrDefault()
            });
        }

        // Opcional: ordenar por año desc, título asc
        return list
            .OrderByDescending(x => x.AnioPublicacion ?? int.MinValue)
            .ThenBy(x => x.Titulo)
            .ToList();
    }

    public async Task<OpenLibrarySearchResult> BuscarPorAutorCompletoAsync(string autor, CancellationToken ct = default)
    {
        var resultado = new OpenLibrarySearchResult();
        var todosLosLibros = new List<BookVm>();
        var totalResultados = 0;

        try
        {
            // Primera llamada para obtener el total de resultados
            var primeraUrl = $"search.json?author={Uri.EscapeDataString(autor)}&limit={DEFAULT_PAGE_SIZE}&offset=0";
            var primeraResp = await _http.GetFromJsonAsync<OpenLibraryResponse>(primeraUrl, ct);
            
            if (primeraResp == null)
            {
                return resultado;
            }

            totalResultados = primeraResp.numFound;
            resultado.TotalResultados = totalResultados;
            resultado.TamañoPagina = DEFAULT_PAGE_SIZE;

            // Si hay más de 100 resultados, hacer llamadas adicionales
            if (totalResultados > DEFAULT_PAGE_SIZE)
            {
                // Procesar primera página
                todosLosLibros.AddRange(ProcesarDocs(primeraResp.docs));

                // Calcular cuántas páginas necesitamos
                var totalPaginas = (int)Math.Ceiling((double)totalResultados / DEFAULT_PAGE_SIZE);
                resultado.TotalPaginas = totalPaginas;

                // Hacer llamadas adicionales para obtener todas las páginas
                var tareas = new List<Task<List<BookVm>>>();
                
                for (int i = 1; i < totalPaginas && i < 100; i++) // Limitar a 100 páginas para evitar sobrecarga
                {
                    var offset = i * DEFAULT_PAGE_SIZE;
                    var url = $"search.json?author={Uri.EscapeDataString(autor)}&limit={DEFAULT_PAGE_SIZE}&offset={offset}";
                    
                    tareas.Add(ObtenerPaginaAsync(url, ct));
                }

                // Esperar todas las tareas
                var resultadosPaginas = await Task.WhenAll(tareas);
                foreach (var librosPagina in resultadosPaginas)
                {
                    todosLosLibros.AddRange(librosPagina);
                }

                resultado.HayMasResultados = todosLosLibros.Count < totalResultados;
                resultado.SiguienteUrl = todosLosLibros.Count < totalResultados 
                    ? $"search.json?author={Uri.EscapeDataString(autor)}&limit={DEFAULT_PAGE_SIZE}&offset={todosLosLibros.Count}"
                    : null;
            }
            else
            {
                // Solo una página, procesar directamente
                todosLosLibros.AddRange(ProcesarDocs(primeraResp.docs));
                resultado.TotalPaginas = 1;
                resultado.HayMasResultados = false;
            }

            // Ordenar todos los libros
            resultado.Libros = todosLosLibros
                .OrderByDescending(x => x.AnioPublicacion ?? int.MinValue)
                .ThenBy(x => x.Titulo)
                .ToList();

            resultado.PaginaActual = 1;
            resultado.TotalResultados = resultado.Libros.Count;

            return resultado;
        }
        catch (Exception ex)
        {
            // Log del error (en producción usar ILogger)
            Console.WriteLine($"Error en búsqueda completa: {ex.Message}");
            
            // Retornar resultado parcial si es posible
            resultado.Libros = todosLosLibros;
            resultado.TotalResultados = todosLosLibros.Count;
            resultado.HayMasResultados = false;
            
            return resultado;
        }
    }

    private async Task<List<BookVm>> ObtenerPaginaAsync(string url, CancellationToken ct)
    {
        try
        {
            var resp = await _http.GetFromJsonAsync<OpenLibraryResponse>(url, ct);
            return resp?.docs != null ? ProcesarDocs(resp.docs) : new List<BookVm>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error obteniendo página {url}: {ex.Message}");
            return new List<BookVm>();
        }
    }

    private List<BookVm> ProcesarDocs(List<Doc> docs)
    {
        var libros = new List<BookVm>();
        
        foreach (var d in docs)
        {
            if (string.IsNullOrWhiteSpace(d.title)) continue;
            libros.Add(new BookVm
            {
                Titulo = d.title.Trim(),
                AnioPublicacion = d.first_publish_year,
                Editorial = d.publisher?.FirstOrDefault()
            });
        }
        
        return libros;
    }

    // Método para búsqueda con límite personalizado
    public async Task<List<BookVm>> BuscarPorAutorConLimiteAsync(string autor, int limite, CancellationToken ct = default)
    {
        if (limite <= 0) limite = DEFAULT_PAGE_SIZE;
        if (limite > MAX_RESULTS) limite = MAX_RESULTS;

        if (limite <= DEFAULT_PAGE_SIZE)
        {
            // Una sola llamada es suficiente
            return await BuscarPorAutorConPaginacionAsync(autor, limite, ct);
        }
        else
        {
            // Necesitamos múltiples llamadas
            var resultado = await BuscarPorAutorCompletoAsync(autor, ct);
            return resultado.Libros.Take(limite).ToList();
        }
    }
}
