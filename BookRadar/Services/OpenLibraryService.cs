using System.Net.Http.Json;
using BookRadar.Web.Models;

namespace BookRadar.Web.Services;

public class OpenLibraryService : IOpenLibraryService
{
    private readonly HttpClient _http;

    public OpenLibraryService(HttpClient http) => _http = http;

    private record OpenLibraryResponse(List<Doc> docs);
    private record Doc(string? title, int? first_publish_year, List<string>? publisher);

    public async Task<List<BookVm>> BuscarPorAutorAsync(string autor, CancellationToken ct = default)
    {
        var url = $"search.json?author={Uri.EscapeDataString(autor)}";
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
}
