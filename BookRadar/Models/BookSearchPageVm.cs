using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookRadar.Web.Models;

public class BookSearchPageVm
{
    [StringLength(100, ErrorMessage = "El nombre del autor no puede exceder los 100 caracteres")]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-']+$", ErrorMessage = "El nombre del autor solo puede contener letras, espacios, puntos, guiones y apóstrofes")]
    public string? Autor { get; set; }
    
    [StringLength(200, ErrorMessage = "El título no puede exceder los 200 caracteres")]
    public string? Titulo { get; set; }
    
    [StringLength(20, ErrorMessage = "El ISBN no puede exceder los 20 caracteres")]
    [RegularExpression(@"^[0-9\-Xx]+$", ErrorMessage = "El ISBN solo puede contener números, guiones y la letra X")]
    public string? ISBN { get; set; }
    
    [StringLength(100, ErrorMessage = "La editorial no puede exceder los 100 caracteres")]
    public string? Editorial { get; set; }
    
    [Range(1800, 2030, ErrorMessage = "El año debe estar entre 1800 y 2030")]
    public int? AnioDesde { get; set; }
    
    [Range(1800, 2030, ErrorMessage = "El año debe estar entre 1800 y 2030")]
    public int? AnioHasta { get; set; }
    
    [StringLength(10, ErrorMessage = "El código de idioma no puede exceder los 10 caracteres")]
    public string? Idioma { get; set; }
    
    [StringLength(20, ErrorMessage = "El tipo de búsqueda no puede exceder los 20 caracteres")]
    public string? TipoBusqueda { get; set; } = "autor"; // autor, titulo, isbn, editorial, avanzada
    
    [StringLength(20, ErrorMessage = "El formato no puede exceder los 20 caracteres")]
    public string? Formato { get; set; }
    
    // Nuevas propiedades para controlar la búsqueda
    [Range(1, 10000, ErrorMessage = "El límite de resultados debe estar entre 1 y 10000")]
    public int LimiteResultados { get; set; } = 100; // Por defecto 100, pero configurable
    
    public bool BuscarTodosLosResultados { get; set; } = false; // Opción para buscar todos los resultados disponibles
    
    public string TipoBusquedaResultados { get; set; } = "limitado"; // "limitado", "completo", "personalizado"
    
    public List<BookVm> Resultados { get; set; } = new();
    public List<SearchHistory> Historial { get; set; } = new();
    public string? Message { get; set; }
    
    // Propiedades para paginación
    [Range(1, 100, ErrorMessage = "La página debe estar entre 1 y 100")]
    public int CurrentPage { get; set; } = 1;
    
    [Range(5, 50, ErrorMessage = "El tamaño de página debe estar entre 5 y 50")]
    public int PageSize { get; set; } = 10;
    
    public int TotalItems { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
    
    // Propiedades para filtrado
    [StringLength(100, ErrorMessage = "El filtro de autor no puede exceder los 100 caracteres")]
    public string? FilterAutor { get; set; }
    
    [StringLength(200, ErrorMessage = "El filtro de título no puede exceder los 200 caracteres")]
    public string? FilterTitulo { get; set; }
    
    [StringLength(100, ErrorMessage = "El filtro de editorial no puede exceder los 100 caracteres")]
    public string? FilterEditorial { get; set; }
    
    [Range(1800, 2030, ErrorMessage = "El año del filtro debe estar entre 1800 y 2030")]
    public int? FilterAnio { get; set; }
    
    // Propiedades para ordenamiento
    [StringLength(20, ErrorMessage = "El campo de ordenamiento no puede exceder los 20 caracteres")]
    public string SortBy { get; set; } = "FechaConsulta";
    
    [StringLength(10, ErrorMessage = "El orden no puede exceder los 10 caracteres")]
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
    
    // Lista de formatos disponibles
    public static readonly List<string> FormatosDisponibles = new()
    {
        "ebook", "hardcover", "paperback", "audiobook", "pdf", "epub", "mobi", "kindle"
    };
    
    // Lista de tipos de búsqueda de resultados
    public static readonly List<string> TiposBusquedaResultados = new()
    {
        "limitado", "completo", "personalizado"
    };
    
    // Lista de límites predefinidos
    public static readonly List<int> LimitesPredefinidos = new()
    {
        50, 100, 250, 500, 1000, 2500, 5000, 10000
    };
}
