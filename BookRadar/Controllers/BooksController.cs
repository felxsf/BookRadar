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
        // Validaciones personalizadas del lado del servidor
        if (string.IsNullOrWhiteSpace(form.Autor))
        {
            ModelState.AddModelError(nameof(form.Autor), "Debes ingresar un autor.");
        }
        else
        {
            // Validar longitud mínima
            if (form.Autor.Trim().Length < 2)
            {
                ModelState.AddModelError(nameof(form.Autor), "El nombre del autor debe tener al menos 2 caracteres.");
            }
            
            // Validar longitud máxima
            if (form.Autor.Trim().Length > 100)
            {
                ModelState.AddModelError(nameof(form.Autor), "El nombre del autor no puede exceder los 100 caracteres.");
            }
            
            // Validar formato con regex
            if (!System.Text.RegularExpressions.Regex.IsMatch(form.Autor.Trim(), @"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-']+$"))
            {
                ModelState.AddModelError(nameof(form.Autor), "El nombre del autor solo puede contener letras, espacios, puntos, guiones y apóstrofes.");
            }
        }

        // Validar años si se proporcionan
        if (form.AnioDesde.HasValue && form.AnioHasta.HasValue)
        {
            if (form.AnioDesde > form.AnioHasta)
            {
                ModelState.AddModelError(nameof(form.AnioHasta), "El año final debe ser mayor o igual al año inicial.");
            }
        }

        // Historial para la tabla inferior (si hay error también lo mostramos)
        form.Historial = await _db.HistorialBusquedas
                                  .OrderByDescending(h => h.FechaConsulta)
                                  .Take(50)
                                  .ToListAsync(ct);

        if (!ModelState.IsValid) 
        {
            // Agregar mensaje de error general
            ViewBag.ErrorMessage = "Por favor, corrige los errores en el formulario antes de continuar.";
            return View(form);
        }

        try
        {
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
                
                // Mensaje de éxito
                form.Message = $"Se encontraron {resultados.Count} libro(s) para '{form.Autor}' y se guardó en el historial.";
            }
            else if (hayBusquedaReciente)
            {
                form.Message = "Búsqueda reciente: no se volvió a guardar el resultado (menor a 1 minuto).";
            }
            else if (resultados.Count == 0)
            {
                form.Message = $"No se encontraron libros para el autor '{form.Autor}'. Intenta con otro nombre.";
            }
        }
        catch (Exception ex)
        {
            // Log del error (en producción usar ILogger)
            ModelState.AddModelError("", "Ocurrió un error al buscar libros. Por favor, intenta nuevamente.");
            form.Message = "Error en la búsqueda. Por favor, intenta nuevamente.";
            
            // En desarrollo, mostrar más detalles del error
            #if DEBUG
            ModelState.AddModelError("", $"Error detallado: {ex.Message}");
            #endif
        }

        return View(form);
    }

    [HttpGet]
    public async Task<IActionResult> History(CancellationToken ct)
    {
        try
        {
            var data = await _db.HistorialBusquedas
                                .OrderByDescending(h => h.FechaConsulta)
                                .ToListAsync(ct);
            return View(data);
        }
        catch (Exception ex)
        {
            // Log del error (en producción usar ILogger)
            ModelState.AddModelError("", "Ocurrió un error al cargar el historial.");
            
            // En desarrollo, mostrar más detalles del error
            #if DEBUG
            ModelState.AddModelError("", $"Error detallado: {ex.Message}");
            #endif
            
            return View(new List<SearchHistory>());
        }
    }
}
