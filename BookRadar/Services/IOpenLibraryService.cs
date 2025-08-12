using BookRadar.Web.Models;

namespace BookRadar.Web.Services;

public interface IOpenLibraryService
{
    Task<List<BookVm>> BuscarPorAutorAsync(string autor, CancellationToken ct = default);
    Task<List<BookVm>> BuscarPorAutorConPaginacionAsync(string autor, int? limite = null, CancellationToken ct = default);
    Task<OpenLibrarySearchResult> BuscarPorAutorCompletoAsync(string autor, CancellationToken ct = default);
    Task<List<BookVm>> BuscarPorAutorConLimiteAsync(string autor, int limite, CancellationToken ct = default);
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
