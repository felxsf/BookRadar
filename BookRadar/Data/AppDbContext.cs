using BookRadar.Web.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace BookRadar.Web.Data;

public class AppDbContext : DbContext
{
    public DbSet<SearchHistory> HistorialBusquedas => Set<SearchHistory>();
    public DbSet<ViewHistory> HistorialVisualizacion => Set<ViewHistory>();
    public DbSet<BookRecommendation> RecomendacionesLibros => Set<BookRecommendation>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SearchHistory>(e =>
        {
            e.Property(x => x.Autor).IsRequired().HasMaxLength(200);
            e.Property(x => x.Titulo).IsRequired().HasMaxLength(500);
            e.Property(x => x.Editorial).HasMaxLength(200);

            // Índice útil para consultas/deduplicación lógica
            e.HasIndex(x => new { x.Autor, x.Titulo, x.AnioPublicacion, x.Editorial })
             .HasDatabaseName("IX_Historial_Dedup");
        });

        modelBuilder.Entity<ViewHistory>(e =>
        {
            e.Property(x => x.Titulo).IsRequired().HasMaxLength(500);
            e.Property(x => x.Autor).HasMaxLength(200);
            e.Property(x => x.Idioma).HasMaxLength(50);
            e.Property(x => x.Formato).HasMaxLength(100);
            e.Property(x => x.CoverUrl).HasMaxLength(500);
            e.Property(x => x.OpenLibraryUrl).HasMaxLength(500);
            e.Property(x => x.IPAddress).HasMaxLength(50);
            e.Property(x => x.UserAgent).HasMaxLength(200);

            // Índices para consultas frecuentes
            e.HasIndex(x => x.FechaVisualizacion).HasDatabaseName("IX_HistorialVisualizacion_Fecha");
            e.HasIndex(x => x.Autor).HasDatabaseName("IX_HistorialVisualizacion_Autor");
            e.HasIndex(x => x.Idioma).HasDatabaseName("IX_HistorialVisualizacion_Idioma");
        });

        modelBuilder.Entity<BookRecommendation>(e =>
        {
            e.Property(x => x.TituloLibro).IsRequired().HasMaxLength(500);
            e.Property(x => x.TituloRecomendado).IsRequired().HasMaxLength(500);
            e.Property(x => x.AutorLibro).HasMaxLength(200);
            e.Property(x => x.AutorRecomendado).HasMaxLength(200);
            e.Property(x => x.Genero).HasMaxLength(100);
            e.Property(x => x.Idioma).HasMaxLength(100);
            e.Property(x => x.Formato).HasMaxLength(100);
            e.Property(x => x.CoverUrl).HasMaxLength(500);
            e.Property(x => x.OpenLibraryUrl).HasMaxLength(500);
            e.Property(x => x.TipoRecomendacion).HasMaxLength(50);

            // Índices para recomendaciones
            e.HasIndex(x => x.TituloLibro).HasDatabaseName("IX_Recomendaciones_TituloLibro");
            e.HasIndex(x => x.Genero).HasDatabaseName("IX_Recomendaciones_Genero");
            e.HasIndex(x => x.TipoRecomendacion).HasDatabaseName("IX_Recomendaciones_Tipo");
        });
    }
}
