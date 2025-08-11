using BookRadar.Web.Data;
using BookRadar.Web.Models;
using BookRadar.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookRadar.Web.Controllers;

public class BooksController : Controller
{
    private readonly AppDbContext _db;
    private readonly IOpenLibraryService _ol;

    public BooksController(AppDbContext db, IOpenLibraryService ol)
    {
        _db = db;
        _ol = ol;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var vm = new BookSearchPageVm
        {
            Historial = await _db.HistorialBusquedas
                                 .OrderByDescending(h => h.FechaConsulta)
                                 .Take(50)
                                 .ToListAsync()
        };
        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(BookSearchPageVm form, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(form.Autor))
        {
            ModelState.AddModelError(nameof(form.Autor), "Debes ingresar un autor.");
        }

        // Historial para la tabla inferior (si hay error también lo mostramos)
        form.Historial = await _db.HistorialBusquedas
                                  .OrderByDescending(h => h.FechaConsulta)
                                  .Take(50)
                                  .ToListAsync(ct);

        if (!ModelState.IsValid) return View(form);

        var resultados = await _ol.BuscarPorAutorAsync(form.Autor!.Trim(), ct);
        form.Resultados = resultados;

        // EXTRA: Evitar guardar si hubo una búsqueda del mismo autor hace < 1 min
        var umbral = DateTime.UtcNow.AddMinutes(-1);
        bool hayBusquedaReciente = await _db.HistorialBusquedas
            .AnyAsync(h => h.Autor == form.Autor && h.FechaConsulta >= umbral, ct);

        if (!hayBusquedaReciente && resultados.Count > 0)
        {
            var ahora = DateTime.UtcNow;
            var filas = resultados.Select(r => new SearchHistory
            {
                Autor = form.Autor!,
                Titulo = r.Titulo,
                AnioPublicacion = r.AnioPublicacion,
                Editorial = r.Editorial,
                FechaConsulta = ahora
            });

            _db.HistorialBusquedas.AddRange(filas);
            await _db.SaveChangesAsync(ct);
        }
        else if (hayBusquedaReciente)
        {
            form.Message = "Búsqueda reciente: no se volvió a guardar el resultado (menor a 1 minuto).";
        }

        return View(form);
    }

    [HttpGet]
    public async Task<IActionResult> History(CancellationToken ct)
    {
        var data = await _db.HistorialBusquedas
                            .OrderByDescending(h => h.FechaConsulta)
                            .ToListAsync(ct);
        return View(data);
    }
}
