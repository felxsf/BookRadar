using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookRadar.Data.Migrations
{
    /// <inheritdoc />
    public partial class NewTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HistorialVisualizacion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Autor = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Idioma = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AnioPublicacion = table.Column<int>(type: "int", nullable: true),
                    Formato = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CoverUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OpenLibraryUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FechaVisualizacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IPAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialVisualizacion", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RecomendacionesLibros",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TituloLibro = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    AutorLibro = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TituloRecomendado = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    AutorRecomendado = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Genero = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Idioma = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AnioPublicacion = table.Column<int>(type: "int", nullable: true),
                    Formato = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CoverUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OpenLibraryUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PuntuacionSimilitud = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TipoRecomendacion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EsActiva = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecomendacionesLibros", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HistorialVisualizacion_Autor",
                table: "HistorialVisualizacion",
                column: "Autor");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialVisualizacion_Fecha",
                table: "HistorialVisualizacion",
                column: "FechaVisualizacion");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialVisualizacion_Idioma",
                table: "HistorialVisualizacion",
                column: "Idioma");

            migrationBuilder.CreateIndex(
                name: "IX_Recomendaciones_Genero",
                table: "RecomendacionesLibros",
                column: "Genero");

            migrationBuilder.CreateIndex(
                name: "IX_Recomendaciones_Tipo",
                table: "RecomendacionesLibros",
                column: "TipoRecomendacion");

            migrationBuilder.CreateIndex(
                name: "IX_Recomendaciones_TituloLibro",
                table: "RecomendacionesLibros",
                column: "TituloLibro");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HistorialVisualizacion");

            migrationBuilder.DropTable(
                name: "RecomendacionesLibros");
        }
    }
}
