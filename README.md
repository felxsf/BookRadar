# 📚 BookRadar - Sistema de Búsqueda de Libros

## 🎯 Descripción del Proyecto

BookRadar es una aplicación web ASP.NET Core MVC que permite a los usuarios buscar libros utilizando la API de Open Library. La aplicación ofrece una interfaz intuitiva y moderna para realizar búsquedas por autor, título, ISBN y editorial, con capacidades avanzadas de filtrado y ordenamiento de resultados.

## 🏗️ Arquitectura Técnica

### Stack Tecnológico Principal

- **Backend**: ASP.NET Core 8.0 MVC
- **Base de Datos**: SQL Server (Azure SQL Database)
- **ORM**: Entity Framework Core 9.0.8
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Framework CSS**: Bootstrap 5
- **Iconografía**: Font Awesome
- **Validación**: jQuery Validation + Unobtrusive

### Estructura del Proyecto

```
BookRadar/
├── Controllers/          # Controladores MVC
│   └── BooksController.cs
├── Models/              # Modelos de datos y ViewModels
│   ├── BookSearchPageVm.cs
│   ├── BookVm.cs
│   ├── SearchHistory.cs
│   └── ErrorViewModel.cs
├── Services/            # Servicios de negocio
│   ├── IOpenLibraryService.cs
│   └── OpenLibraryService.cs
├── Data/               # Capa de acceso a datos
│   ├── AppDbContext.cs
│   └── Migrations/
├── Views/              # Vistas Razor
│   └── Books/
│       └── Index.cshtml
├── wwwroot/            # Archivos estáticos
│   ├── css/
│   │   └── site.css
│   ├── js/
│   │   ├── enhanced-ux.js
│   │   ├── filters-manager.js
│   │   ├── validation.js
│   │   ├── validation-config.js
│   │   └── site.js
│   └── lib/            # Librerías externas
└── Program.cs          # Punto de entrada de la aplicación
```

### Dependencias Principales

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.8" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.8" />
<PackageReference Include="System.Linq.Dynamic.Core" Version="1.6.0" />
```

## 🚀 Pasos para Ejecutar el Proyecto

### Prerrequisitos

1. **Visual Studio 2022** (versión 17.8 o superior) o **Visual Studio Code**
2. **.NET 8.0 SDK** instalado
3. **SQL Server** (local o Azure)
4. **Git** para clonar el repositorio

### Instalación y Configuración

#### Paso 1: Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd BookRadar
```

#### Paso 2: Configurar la Base de Datos

1. **Crear la base de datos en SQL Server:**
```sql
CREATE DATABASE BookRadarDb;
```

2. **Configurar la cadena de conexión en `appsettings.json`:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tu_servidor;Database=BookRadarDb;Trusted_Connection=true;MultipleActiveResultSets=true;"
  }
}
```

**Nota**: Para desarrollo local, puedes usar:
- **SQL Server LocalDB**: `Server=(localdb)\\mssqllocaldb;Database=BookRadarDb;Trusted_Connection=true;MultipleActiveResultSets=true;`
- **SQL Server Express**: `Server=.\\SQLEXPRESS;Database=BookRadarDb;Trusted_Connection=true;MultipleActiveResultSets=true;`

#### Paso 3: Restaurar Dependencias
```bash
dotnet restore
```

#### Paso 4: Ejecutar Migraciones de Base de Datos
```bash
dotnet ef database update
```

#### Paso 5: Compilar y Ejecutar
```bash
dotnet build
dotnet run
```

#### Paso 6: Acceder a la Aplicación
Abrir el navegador y navegar a: `https://localhost:5001` o `http://localhost:5000`

### Configuración de Desarrollo

#### Variables de Entorno (Opcional)
Crear archivo `appsettings.Development.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookRadarDb;Trusted_Connection=true;MultipleActiveResultSets=true;"
  }
}
```

#### Configuración de HTTPS (Desarrollo)
```bash
dotnet dev-certs https --trust
```

### Solución de Problemas Comunes

#### Error de Conexión a Base de Datos
- Verificar que SQL Server esté ejecutándose
- Confirmar que la cadena de conexión sea correcta
- Verificar permisos de usuario en la base de datos

#### Error de Certificado HTTPS
```bash
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

#### Error de Migraciones
```bash
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 🎨 Decisiones de Diseño

### Filosofía de Diseño

El diseño de BookRadar se basa en principios de **simplicidad**, **accesibilidad** y **experiencia de usuario intuitiva**. Se prioriza la funcionalidad sobre la ornamentación, manteniendo una estética moderna y profesional.

### Paleta de Colores

#### Colores Principales
- **Azul Principal (#007bff)**: Color de marca, botones principales y enlaces
- **Azul Oscuro (#0056b3)**: Estados hover y elementos activos
- **Gris Claro (#f8f9fa)**: Fondos de secciones y elementos secundarios
- **Gris Medio (#6c757d)**: Texto secundario y bordes
- **Gris Oscuro (#343a40)**: Texto principal y encabezados
- **Verde (#28a745)**: Estados de éxito y confirmación
- **Rojo (#dc3545)**: Estados de error y advertencias

#### Justificación de la Paleta
- **Azul**: Transmite confianza, profesionalismo y tecnología
- **Grises**: Proporcionan contraste adecuado para legibilidad
- **Verde/Rojo**: Colores semánticos para feedback del usuario

### Tipografía y Jerarquía Visual

#### Familia de Fuentes
- **Sistema**: Fuentes del sistema operativo para máxima compatibilidad
- **Fallback**: Arial, Helvetica, sans-serif

#### Jerarquía de Texto
- **H1**: 2.5rem (40px) - Títulos principales
- **H2**: 2rem (32px) - Subtítulos de sección
- **H3**: 1.75rem (28px) - Encabezados de subsección
- **Body**: 1rem (16px) - Texto del cuerpo
- **Small**: 0.875rem (14px) - Texto secundario

### Layout y Enmaquetado

#### Estructura de Grid
- **Sistema de 12 columnas** basado en Bootstrap
- **Breakpoints responsivos**:
  - Extra Small: < 576px
  - Small: ≥ 576px
  - Medium: ≥ 768px
  - Large: ≥ 992px
  - Extra Large: ≥ 1200px

#### Principios de Layout
1. **Contenido Centrado**: Máximo ancho de 1200px para pantallas grandes
2. **Espaciado Consistente**: Sistema de márgenes y padding basado en múltiplos de 0.5rem
3. **Agrupación Visual**: Elementos relacionados se agrupan con espaciado reducido
4. **Separación Clara**: Uso de sombras y bordes para definir secciones

### Componentes de Interfaz

#### Barra de Búsqueda Principal
- **Posición prominente** en la parte superior
- **Campo de entrada grande** (altura: 3.5rem)
- **Botón de búsqueda destacado** con icono
- **Validación en tiempo real** con feedback visual

#### Panel de Filtros
- **Colapsable** para no ocupar espacio innecesario
- **Filtros contextuales** que aparecen solo cuando hay resultados
- **Controles intuitivos** con etiquetas claras
- **Acciones inmediatas** para aplicar/limpiar filtros

#### Resultados de Búsqueda
- **Tarjetas individuales** para cada libro
- **Información estructurada** con iconos descriptivos
- **Estados visuales** para elementos interactivos
- **Paginación clara** con navegación intuitiva

### Experiencia de Usuario (UX)

#### Principios UX Implementados

1. **Simplicidad**
   - Interfaz limpia sin elementos distractores
   - Flujo de trabajo lineal y predecible
   - Opciones claras y limitadas

2. **Feedback Inmediato**
   - Validación en tiempo real
   - Estados de carga visibles
   - Mensajes de confirmación/error claros

3. **Accesibilidad**
   - Contraste de colores adecuado (WCAG AA)
   - Navegación por teclado completa
   - Etiquetas ARIA apropiadas
   - Texto alternativo para imágenes

4. **Responsividad**
   - Diseño mobile-first
   - Adaptación automática a diferentes tamaños de pantalla
   - Controles táctiles optimizados

#### Flujo de Usuario

1. **Llegada**: Usuario ve formulario de búsqueda prominente
2. **Búsqueda**: Ingresa autor y selecciona opciones
3. **Resultados**: Visualiza lista de libros con información relevante
4. **Filtrado**: Refina resultados usando filtros avanzados
5. **Navegación**: Explora resultados con paginación

### Interactividad y Animaciones

#### Transiciones CSS
- **Duración**: 0.2s - 0.3s para cambios sutiles
- **Timing Function**: `ease-in-out` para movimiento natural
- **Propiedades**: Transform, opacity, color, background

#### Estados de Interacción
- **Hover**: Cambios sutiles de color y sombra
- **Focus**: Outline visible para navegación por teclado
- **Active**: Feedback visual inmediato
- **Loading**: Indicadores de progreso animados

#### Animaciones JavaScript
- **Fade In**: Elementos que aparecen suavemente
- **Slide**: Paneles que se expanden/colapsan
- **Pulse**: Elementos que requieren atención
- **Stagger**: Secuencias de animación escalonadas

## 🔧 Funcionalidades Implementadas

### Búsqueda de Libros
- Búsqueda por autor con validación robusta
- Opciones de límite de resultados (50, 100, 250, 500, 1000, 2500, 5000, 10000)
- Búsqueda completa vs. limitada
- Integración con API de Open Library

### Filtrado y Ordenamiento
- Búsqueda dentro de resultados
- Filtro por año de publicación
- Ordenamiento por relevancia, título, año
- Sistema de filtros en tiempo real

### Historial de Búsquedas
- Almacenamiento persistente en base de datos
- Visualización de búsquedas recientes
- Deduplicación automática de resultados

### Validación y Seguridad
- Validación del lado del cliente y servidor
- Protección CSRF con tokens
- Sanitización de entrada de usuario
- Manejo de errores robusto

## 🚀 Mejoras Pendientes y Optimizaciones

### Escalabilidad y Rendimiento

#### Optimizaciones de Base de Datos
1. **Índices Compuestos**
   ```sql
   CREATE INDEX IX_Books_AuthorTitleYear ON Books(Author, Title, Year);
   CREATE INDEX IX_Books_SearchOptimized ON Books(Author, Title, Year, Language);
   ```

2. **Particionamiento de Tablas**
   - Particionar por año para búsquedas históricas
   - Implementar archivo de datos separado para resultados antiguos

3. **Cache de Consultas**
   - Implementar Redis para cache de resultados frecuentes
   - Cache de consultas SQL con Entity Framework

#### Optimizaciones de API
1. **Rate Limiting**
   - Implementar throttling por usuario/IP
   - Cola de solicitudes para evitar sobrecarga

2. **Compresión de Respuestas**
   - Gzip para respuestas HTTP
   - Minificación de JSON

3. **Paginación Inteligente**
   - Cursor-based pagination para grandes conjuntos
   - Lazy loading de resultados

### Funcionalidades Adicionales

#### Sistema de Usuarios
1. **Autenticación y Autorización**
   - Login con JWT tokens
   - Roles de usuario (básico, premium, admin)
   - OAuth con Google, Microsoft

2. **Perfiles Personalizados**
   - Historial personal de búsquedas
   - Listas de favoritos
   - Preferencias de búsqueda

#### Búsqueda Avanzada
1. **Filtros Adicionales**
   - Filtro por idioma del libro
   - Filtro por número de páginas
   - Filtro por disponibilidad (digital/físico)
   - Filtro por género literario

2. **Búsqueda Semántica**
   - Integración con servicios de IA
   - Búsqueda por similitud de contenido
   - Recomendaciones personalizadas

#### Exportación y Compartir
1. **Formatos de Exportación**
   - PDF con bibliografía
   - CSV para análisis
   - BibTeX para referencias académicas

2. **Integración Social**
   - Compartir en redes sociales
   - Enlaces directos a resultados
   - Widgets embebibles

### Mejoras de Interfaz

#### Accesibilidad
1. **Soporte para Lectores de Pantalla**
   - ARIA labels mejorados
   - Navegación por voz
   - Modo de alto contraste

2. **Internacionalización**
   - Soporte multiidioma
   - Localización de fechas y números
   - RTL para idiomas árabes

#### Experiencia Móvil
1. **PWA (Progressive Web App)**
   - Instalación offline
   - Notificaciones push
   - Sincronización de datos

2. **Gestos Táctiles**
   - Swipe para navegación
   - Pinch to zoom en resultados
   - Pull to refresh

### Arquitectura y Mantenibilidad

#### Microservicios
1. **Separación de Responsabilidades**
   - Servicio de búsqueda independiente
   - Servicio de historial separado
   - API Gateway para enrutamiento

2. **Contenedores**
   - Docker para desarrollo y producción
   - Kubernetes para orquestación
   - CI/CD automatizado

#### Monitoreo y Observabilidad
1. **Logging Estructurado**
   - Serilog con enriquecimiento
   - Logs centralizados (ELK Stack)
   - Métricas de rendimiento

2. **Health Checks**
   - Endpoints de salud para servicios
   - Monitoreo de dependencias
   - Alertas automáticas

#### Testing
1. **Cobertura de Código**
   - Unit tests para lógica de negocio
   - Integration tests para API
   - E2E tests para flujos críticos

2. **Testing de Rendimiento**
   - Load testing con JMeter
   - Stress testing de base de datos
   - Profiling de memoria y CPU

### Seguridad y Compliance

#### Protección de Datos
1. **Encriptación**
   - HTTPS obligatorio
   - Encriptación de datos sensibles
   - Rotación de claves

2. **Auditoría**
   - Logs de acceso y cambios
   - Trazabilidad de operaciones
   - Reportes de compliance

#### Cumplimiento Normativo
1. **GDPR/CCPA**
   - Consentimiento explícito
   - Derecho al olvido
   - Portabilidad de datos

2. **Accesibilidad Web**
   - WCAG 2.1 AA compliance
   - Testing automatizado
   - Reportes de accesibilidad

## 📊 Métricas y KPIs

### Indicadores de Rendimiento
- **Tiempo de Respuesta**: < 200ms para búsquedas simples
- **Throughput**: 1000+ consultas por minuto
- **Disponibilidad**: 99.9% uptime
- **Tasa de Error**: < 0.1%

### Métricas de Usuario
- **Tiempo en Sesión**: Objetivo > 5 minutos
- **Tasa de Rebote**: Objetivo < 30%
- **Conversión**: Usuarios que realizan búsquedas exitosas
- **Satisfacción**: NPS > 50

## 🤝 Contribución al Proyecto

### Guías de Desarrollo
1. **Estándares de Código**
   - C# coding conventions
   - JavaScript ESLint rules
   - CSS BEM methodology

2. **Proceso de Pull Request**
   - Code review obligatorio
   - Tests automáticos
   - Documentación actualizada

### Roadmap de Desarrollo
- **Q1 2024**: Sistema de usuarios y autenticación
- **Q2 2024**: Búsqueda semántica y recomendaciones
- **Q3 2024**: PWA y funcionalidades offline
- **Q4 2024**: Microservicios y escalabilidad

---

# Migraciones y base de datos
## Genera la DB con EF Core:

### bash 
```
dotnet ef migrations add InitialCreate
dotnet ef database update
```


### Script SQL
#### sql

```
CREATE TABLE dbo.HistorialBusquedas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Autor NVARCHAR(200) NOT NULL,
    Titulo NVARCHAR(500) NOT NULL,
    AnioPublicacion INT NULL,
    Editorial NVARCHAR(200) NULL,
    FechaConsulta DATETIME2 NOT NULL
);
CREATE INDEX IX_Historial_Dedup
    ON dbo.HistorialBusquedas (Autor, Titulo, AnioPublicacion, Editorial);
```


### (Stored Procedure)
#### sql

```
CREATE OR ALTER PROCEDURE dbo.InsertSearchHistory
    @Autor NVARCHAR(200),
    @Titulo NVARCHAR(500),
    @AnioPublicacion INT = NULL,
    @Editorial NVARCHAR(200) = NULL,
    @FechaConsulta DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.HistorialBusquedas (Autor, Titulo, AnioPublicacion, Editorial, FechaConsulta)
    VALUES (@Autor, @Titulo, @AnioPublicacion, @Editorial, @FechaConsulta);
END
```


### Llamarlo desde C#:
#### csharp

```
await _db.Database.ExecuteSqlInterpolatedAsync($@"
    EXEC dbo.InsertSearchHistory 
    @Autor={form.Autor}, @Titulo={r.Titulo}, 
    @AnioPublicacion={r.AnioPublicacion}, @Editorial={r.Editorial}, 
    @FechaConsulta={ahora}");
```


**BookRadar** - Transformando la búsqueda de libros en una experiencia digital excepcional.

