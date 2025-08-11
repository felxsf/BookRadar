using BookRadar.Web.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace BookRadar.Web.Data;

public class AppDbContext : DbContext
{
    public DbSet<SearchHistory> HistorialBusquedas => Set<SearchHistory>();

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
    }
}
