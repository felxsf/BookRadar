using System.Collections.Generic;

namespace BookRadar.Web.Models;

public class BookSearchPageVm
{
    public string? Autor { get; set; }
    public string? Titulo { get; set; }
    public string? ISBN { get; set; }
    public string? Editorial { get; set; }
    public int? AnioDesde { get; set; }
    public int? AnioHasta { get; set; }
    public string? Idioma { get; set; }
    public string? TipoBusqueda { get; set; } = "autor"; // autor, titulo, isbn, editorial
    
    public List<BookVm> Resultados { get; set; } = new();
    public List<SearchHistory> Historial { get; set; } = new();
    public string? Message { get; set; }
    
    // Propiedades para paginación
    public int CurrentPage { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int TotalItems { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
    
    // Propiedades para filtrado
    public string? FilterAutor { get; set; }
    public string? FilterTitulo { get; set; }
    public string? FilterEditorial { get; set; }
    public int? FilterAnio { get; set; }
    
    // Propiedades para ordenamiento
    public string SortBy { get; set; } = "FechaConsulta";
    public string SortOrder { get; set; } = "desc";
    
    // Lista de idiomas disponibles
    public static readonly List<string> IdiomasDisponibles = new()
    {
        "es", "en", "fr", "de", "it", "pt", "ru", "ja", "zh", "ar"
    };
    
    // Lista de tipos de búsqueda
    public static readonly List<string> TiposBusqueda = new()
    {
        "autor", "titulo", "isbn", "editorial", "avanzada"
    };
}
