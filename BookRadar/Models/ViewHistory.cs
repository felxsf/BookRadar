using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookRadar.Web.Models;

[Table("HistorialVisualizacion")]
public class ViewHistory
{
    public int Id { get; set; }

    [Required, MaxLength(500)]
    public string Titulo { get; set; } = default!;

    [MaxLength(200)]
    public string? Autor { get; set; }

    [MaxLength(50)]
    public string? Idioma { get; set; }

    public int? AnioPublicacion { get; set; }

    [MaxLength(100)]
    public string? Formato { get; set; }

    [MaxLength(500)]
    public string? CoverUrl { get; set; }

    [MaxLength(500)]
    public string? OpenLibraryUrl { get; set; }

    public DateTime FechaVisualizacion { get; set; }

    [MaxLength(50)]
    public string? IPAddress { get; set; }

    [MaxLength(200)]
    public string? UserAgent { get; set; }
}
