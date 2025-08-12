using BookRadar.Web.Data;
using BookRadar.Web.Models;
using BookRadar.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookRadar.Web.Controllers;

public class BooksController : Controller
{
    private readonly AppDbContext _db;
    private readonly IOpenLibraryService _ol;

    public BooksController(AppDbContext db, IOpenLibraryService ol)
    {
        _db = db;
        _ol = ol;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var vm = new BookSearchPageVm
        {
            Historial = await _db.HistorialBusquedas
                                 .OrderByDescending(h => h.FechaConsulta)
                                 .Take(50)
                                 .ToListAsync()
        };
        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(BookSearchPageVm form, CancellationToken ct)
    {
        // Validaciones personalizadas del lado del servidor
        if (string.IsNullOrWhiteSpace(form.Autor) && string.IsNullOrWhiteSpace(form.Titulo))
        {
            ModelState.AddModelError("", "Debes ingresar un autor o un título para realizar la búsqueda.");
        }
        else
        {
            // Validar autor si se proporciona
            if (!string.IsNullOrWhiteSpace(form.Autor))
            {
                if (form.Autor.Trim().Length < 2)
                {
                    ModelState.AddModelError(nameof(form.Autor), "El nombre del autor debe tener al menos 2 caracteres.");
                }
                
                if (form.Autor.Trim().Length > 100)
                {
                    ModelState.AddModelError(nameof(form.Autor), "El nombre del autor no puede exceder los 100 caracteres.");
                }
                
                if (!System.Text.RegularExpressions.Regex.IsMatch(form.Autor.Trim(), @"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-']+$"))
                {
                    ModelState.AddModelError(nameof(form.Autor), "El nombre del autor solo puede contener letras, espacios, puntos, guiones y apóstrofes.");
                }
            }

            // Validar título si se proporciona
            if (!string.IsNullOrWhiteSpace(form.Titulo))
            {
                if (form.Titulo.Trim().Length < 2)
                {
                    ModelState.AddModelError(nameof(form.Titulo), "El título debe tener al menos 2 caracteres.");
                }
                
                if (form.Titulo.Trim().Length > 200)
                {
                    ModelState.AddModelError(nameof(form.Titulo), "El título no puede exceder los 200 caracteres.");
                }
            }
        }

        // Validar años si se proporcionan
        if (form.AnioDesde.HasValue && form.AnioHasta.HasValue)
        {
            if (form.AnioDesde > form.AnioHasta)
            {
                ModelState.AddModelError(nameof(form.AnioHasta), "El año final debe ser mayor o igual al año inicial.");
            }
        }

        // Validar límite de resultados
        if (form.LimiteResultados < 1 || form.LimiteResultados > 10000)
        {
            ModelState.AddModelError(nameof(form.LimiteResultados), "El límite de resultados debe estar entre 1 y 10000.");
        }

        // Historial para la tabla inferior (si hay error también lo mostramos)
        form.Historial = await _db.HistorialBusquedas
                                  .OrderByDescending(h => h.FechaConsulta)
                                  .Take(50)
                                  .ToListAsync(ct);

        if (!ModelState.IsValid) 
        {
            // Agregar mensaje de error general
            ViewBag.ErrorMessage = "Por favor, corrige los errores en el formulario antes de continuar.";
            return View(form);
        }

        try
        {
            List<BookVm> resultados;
            string mensajeResultado;

            // Determinar qué tipo de búsqueda realizar
            if (!string.IsNullOrWhiteSpace(form.Titulo))
            {
                // Búsqueda por título
                if (form.BuscarTodosLosResultados)
                {
                    var resultadoCompleto = await _ol.BuscarPorTituloCompletoAsync(form.Titulo.Trim(), ct);
                    resultados = resultadoCompleto.Libros;
                    
                    if (resultadoCompleto.TotalResultados > 0)
                    {
                        mensajeResultado = $"Se encontraron {resultadoCompleto.TotalResultados} libro(s) con el título '{form.Titulo}' (búsqueda completa).";
                        
                        if (resultadoCompleto.HayMasResultados)
                        {
                            mensajeResultado += " Algunos resultados pueden no haberse cargado completamente debido a limitaciones de la API.";
                        }
                    }
                    else
                    {
                        mensajeResultado = $"No se encontraron libros con el título '{form.Titulo}'.";
                    }
                }
                else if (form.TipoBusquedaResultados == "personalizado" && form.LimiteResultados > 100)
                {
                    resultados = await _ol.BuscarPorTituloConPaginacionAsync(form.Titulo.Trim(), form.LimiteResultados, ct);
                    mensajeResultado = $"Se encontraron {resultados.Count} libro(s) con el título '{form.Titulo}' (límite: {form.LimiteResultados}).";
                }
                else
                {
                    var limite = form.LimiteResultados > 0 ? form.LimiteResultados : 100;
                    resultados = await _ol.BuscarPorTituloConPaginacionAsync(form.Titulo.Trim(), limite, ct);
                    mensajeResultado = $"Se encontraron {resultados.Count} libro(s) con el título '{form.Titulo}' (límite: {limite}).";
                }
            }
            else if (!string.IsNullOrWhiteSpace(form.Autor))
            {
                // Búsqueda por autor
                if (form.BuscarTodosLosResultados)
                {
                    var resultadoCompleto = await _ol.BuscarPorAutorCompletoAsync(form.Autor!.Trim(), ct);
                    resultados = resultadoCompleto.Libros;
                    
                    if (resultadoCompleto.TotalResultados > 0)
                    {
                        mensajeResultado = $"Se encontraron {resultadoCompleto.TotalResultados} libro(s) para '{form.Autor}' (búsqueda completa).";
                        
                        if (resultadoCompleto.HayMasResultados)
                        {
                            mensajeResultado += " Algunos resultados pueden no haberse cargado completamente debido a limitaciones de la API.";
                        }
                    }
                    else
                    {
                        mensajeResultado = $"No se encontraron libros para el autor '{form.Autor}'.";
                    }
                }
                else if (form.TipoBusquedaResultados == "personalizado" && form.LimiteResultados > 100)
                {
                    resultados = await _ol.BuscarPorAutorConLimiteAsync(form.Autor!.Trim(), form.LimiteResultados, ct);
                    mensajeResultado = $"Se encontraron {resultados.Count} libro(s) para '{form.Autor}' (límite: {form.LimiteResultados}).";
                }
                else
                {
                    var limite = form.LimiteResultados > 0 ? form.LimiteResultados : 100;
                    resultados = await _ol.BuscarPorAutorConPaginacionAsync(form.Autor!.Trim(), limite, ct);
                    mensajeResultado = $"Se encontraron {resultados.Count} libro(s) para '{form.Autor}' (límite: {limite}).";
                }
            }
            else
            {
                // Búsqueda avanzada
                resultados = await _ol.BusquedaAvanzadaAsync(
                    titulo: form.Titulo,
                    autor: form.Autor,
                    idioma: form.Idioma,
                    anioDesde: form.AnioDesde,
                    anioHasta: form.AnioHasta,
                    formato: form.Formato,
                    ct: ct
                );
                mensajeResultado = $"Se encontraron {resultados.Count} libro(s) con los criterios de búsqueda avanzada.";
            }

            form.Resultados = resultados;
            form.TotalItems = resultados.Count;

            // EXTRA: Evitar guardar si hubo una búsqueda reciente hace < 1 min
            var umbral = DateTime.UtcNow.AddMinutes(-1);
            bool hayBusquedaReciente = false;
            
            if (!string.IsNullOrWhiteSpace(form.Autor))
            {
                hayBusquedaReciente = await _db.HistorialBusquedas
                    .AnyAsync(h => h.Autor == form.Autor && h.FechaConsulta >= umbral, ct);
            }
            else if (!string.IsNullOrWhiteSpace(form.Titulo))
            {
                hayBusquedaReciente = await _db.HistorialBusquedas
                    .AnyAsync(h => h.Titulo == form.Titulo && h.FechaConsulta >= umbral, ct);
            }

            if (!hayBusquedaReciente && resultados.Count > 0)
            {
                var ahora = DateTime.UtcNow;
                var filas = resultados.Select(r => new SearchHistory
                {
                    Autor = form.Autor ?? "Búsqueda por título",
                    Titulo = r.Titulo,
                    AnioPublicacion = r.AnioPublicacion,
                    Editorial = r.Editorial,
                    FechaConsulta = ahora
                });

                _db.HistorialBusquedas.AddRange(filas);
                await _db.SaveChangesAsync(ct);
                
                // Mensaje de éxito
                form.Message = mensajeResultado + " Los resultados se han guardado en el historial.";
            }
            else if (hayBusquedaReciente)
            {
                form.Message = mensajeResultado + " Búsqueda reciente: no se volvió a guardar el resultado (menor a 1 minuto).";
            }
            else if (resultados.Count == 0)
            {
                form.Message = mensajeResultado;
            }
        }
        catch (Exception ex)
        {
            // Log del error (en producción usar ILogger)
            ModelState.AddModelError("", "Ocurrió un error al buscar libros. Por favor, intenta nuevamente.");
            form.Message = "Error en la búsqueda. Por favor, intenta nuevamente.";
            
            // En desarrollo, mostrar más detalles del error
            #if DEBUG
            ModelState.AddModelError("", $"Error detallado: {ex.Message}");
            #endif
        }

        return View(form);
    }

    [HttpGet]
    public async Task<IActionResult> History(CancellationToken ct)
    {
        try
        {
            var data = await _db.HistorialBusquedas
                                .OrderByDescending(h => h.FechaConsulta)
                                .ToListAsync(ct);
            return View(data);
        }
        catch (Exception ex)
        {
            // Log del error (en producción usar ILogger)
            ModelState.AddModelError("", "Ocurrió un error al cargar el historial.");
            
            // En desarrollo, mostrar más detalles del error
            #if DEBUG
            ModelState.AddModelError("", $"Error detallado: {ex.Message}");
            #endif
            
            return View(new List<SearchHistory>());
        }
    }

    [HttpGet]
    public async Task<IActionResult> Details(string workKey, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(workKey))
        {
            return RedirectToAction(nameof(Index));
        }

        try
        {
            var libro = await _ol.ObtenerDetallesLibroAsync(workKey, ct);
            
            if (libro == null)
            {
                // Si no podemos obtener detalles, crear un libro básico con la información disponible
                libro = new BookVm
                {
                    Titulo = "Información no disponible",
                    OpenLibraryUrl = $"https://openlibrary.org{workKey}"
                };
            }

            // Guardar en el historial de visualización
            try
            {
                var viewHistory = new ViewHistory
                {
                    Titulo = libro.Titulo,
                    Autor = libro.Autor,
                    Idioma = libro.Idioma,
                    AnioPublicacion = libro.AnioPublicacion,
                    Formato = libro.Formato,
                    CoverUrl = libro.CoverUrl,
                    OpenLibraryUrl = libro.OpenLibraryUrl,
                    FechaVisualizacion = DateTime.UtcNow,
                    IPAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                    UserAgent = HttpContext.Request.Headers["User-Agent"].ToString()
                };

                _db.HistorialVisualizacion.Add(viewHistory);
                await _db.SaveChangesAsync(ct);
            }
            catch (Exception ex)
            {
                // Log del error pero no fallar la vista
                #if DEBUG
                System.Diagnostics.Debug.WriteLine($"Error al guardar historial de visualización: {ex.Message}");
                #endif
            }

            return View(libro);
        }
        catch (Exception ex)
        {
            // Log del error (en producción usar ILogger)
            ModelState.AddModelError("", "Ocurrió un error al cargar los detalles del libro.");
            
            // En desarrollo, mostrar más detalles del error
            #if DEBUG
            ModelState.AddModelError("", $"Error detallado: {ex.Message}");
            #endif
            
            return RedirectToAction(nameof(Index));
        }
    }

    [HttpGet]
    public async Task<IActionResult> Recommendations(CancellationToken ct)
    {
        try
        {
            // Obtener libros del historial de visualización para generar recomendaciones
            var librosVistos = await _db.HistorialVisualizacion
                .OrderByDescending(h => h.FechaVisualizacion)
                .Take(20)
                .ToListAsync(ct);

            var recomendaciones = new List<BookRecommendation>();

            foreach (var libro in librosVistos)
            {
                // Generar recomendaciones basadas en género, idioma y formato
                var recomendacionesGenero = await _db.RecomendacionesLibros
                    .Where(r => r.Genero != null && r.EsActiva)
                    .OrderByDescending(r => r.PuntuacionSimilitud)
                    .Take(5)
                    .ToListAsync(ct);

                var recomendacionesIdioma = await _db.RecomendacionesLibros
                    .Where(r => r.Idioma == libro.Idioma && r.EsActiva)
                    .OrderByDescending(r => r.PuntuacionSimilitud)
                    .Take(5)
                    .ToListAsync(ct);

                var recomendacionesFormato = await _db.RecomendacionesLibros
                    .Where(r => r.Formato == libro.Formato && r.EsActiva)
                    .OrderByDescending(r => r.PuntuacionSimilitud)
                    .Take(5)
                    .ToListAsync(ct);

                recomendaciones.AddRange(recomendacionesGenero);
                recomendaciones.AddRange(recomendacionesIdioma);
                recomendaciones.AddRange(recomendacionesFormato);
            }

            // Eliminar duplicados y ordenar por puntuación
            var recomendacionesUnicas = recomendaciones
                .GroupBy(r => r.TituloRecomendado)
                .Select(g => g.OrderByDescending(r => r.PuntuacionSimilitud).First())
                .OrderByDescending(r => r.PuntuacionSimilitud)
                .Take(20)
                .ToList();

            return View(recomendacionesUnicas);
        }
        catch (Exception ex)
        {
            ModelState.AddModelError("", "Ocurrió un error al cargar las recomendaciones.");
            
            #if DEBUG
            ModelState.AddModelError("", $"Error detallado: {ex.Message}");
            #endif
            
            return View(new List<BookRecommendation>());
        }
    }
}
