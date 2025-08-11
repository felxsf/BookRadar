using BookRadar.Web.Models;

namespace BookRadar.Web.Services;

public interface IOpenLibraryService
{
    Task<List<BookVm>> BuscarPorAutorAsync(string autor, CancellationToken ct = default);
}
