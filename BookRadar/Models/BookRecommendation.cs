using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookRadar.Web.Models;

[Table("RecomendacionesLibros")]
public class BookRecommendation
{
    public int Id { get; set; }

    [Required, MaxLength(500)]
    public string TituloLibro { get; set; } = default!;

    [MaxLength(200)]
    public string? AutorLibro { get; set; }

    [MaxLength(500)]
    public string TituloRecomendado { get; set; } = default!;

    [MaxLength(200)]
    public string? AutorRecomendado { get; set; }

    [MaxLength(100)]
    public string? Genero { get; set; }

    [MaxLength(100)]
    public string? Idioma { get; set; }

    public int? AnioPublicacion { get; set; }

    [MaxLength(100)]
    public string? Formato { get; set; }

    [MaxLength(500)]
    public string? CoverUrl { get; set; }

    [MaxLength(500)]
    public string? OpenLibraryUrl { get; set; }

    public decimal PuntuacionSimilitud { get; set; }

    [MaxLength(50)]
    public string TipoRecomendacion { get; set; } = "genero"; // genero, autor, idioma, formato

    public DateTime FechaCreacion { get; set; }

    public bool EsActiva { get; set; } = true;
}
