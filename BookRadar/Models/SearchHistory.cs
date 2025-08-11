using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookRadar.Web.Models;

[Table("HistorialBusquedas")]
public class SearchHistory
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Autor { get; set; } = default!;

    [Required, MaxLength(500)]
    public string Titulo { get; set; } = default!;

    public int? AnioPublicacion { get; set; }

    [MaxLength(200)]
    public string? Editorial { get; set; }

    public DateTime FechaConsulta { get; set; }
}
