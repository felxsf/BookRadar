namespace BookRadar.Web.Models;

public class BookVm
{
    public string Titulo { get; set; } = "";
    public string? Autor { get; set; }
    public int? AnioPublicacion { get; set; }
    public string? Editorial { get; set; }
    public string? ISBN { get; set; }
    public string? Idioma { get; set; }
    public string? Descripcion { get; set; }
    public string? CoverUrl { get; set; }
    public string? OpenLibraryUrl { get; set; }
    public List<string> Generos { get; set; } = new();
    public int? NumeroPaginas { get; set; }
    public string? Formato { get; set; } // ebook, hardcover, paperback, etc.
}
