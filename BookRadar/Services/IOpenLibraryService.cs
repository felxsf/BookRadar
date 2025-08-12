using BookRadar.Web.Models;

namespace BookRadar.Web.Services;

public interface IOpenLibraryService
{
    Task<List<BookVm>> BuscarPorAutorAsync(string autor, CancellationToken ct = default);
    Task<List<BookVm>> BuscarPorAutorConPaginacionAsync(string autor, int? limite = null, CancellationToken ct = default);
    Task<OpenLibrarySearchResult> BuscarPorAutorCompletoAsync(string autor, CancellationToken ct = default);
    Task<List<BookVm>> BuscarPorAutorConLimiteAsync(string autor, int limite, CancellationToken ct = default);
    
    // Nuevos métodos para búsqueda por título
    Task<List<BookVm>> BuscarPorTituloAsync(string titulo, CancellationToken ct = default);
    Task<List<BookVm>> BuscarPorTituloConPaginacionAsync(string titulo, int? limite = null, CancellationToken ct = default);
    Task<OpenLibrarySearchResult> BuscarPorTituloCompletoAsync(string titulo, CancellationToken ct = default);
    
    // Método para búsqueda avanzada
    Task<List<BookVm>> BusquedaAvanzadaAsync(string? titulo = null, string? autor = null, string? idioma = null, 
                                            int? anioDesde = null, int? anioHasta = null, string? formato = null, 
                                            CancellationToken ct = default);
    
    Task<BookVm?> ObtenerDetallesLibroAsync(string workKey, CancellationToken ct = default);
}

public class OpenLibrarySearchResult
{
    public List<BookVm> Libros { get; set; } = new();
    public int TotalResultados { get; set; }
    public int PaginaActual { get; set; }
    public int TamañoPagina { get; set; }
    public int TotalPaginas { get; set; }
    public bool HayMasResultados { get; set; }
    public string? SiguienteUrl { get; set; }
}
