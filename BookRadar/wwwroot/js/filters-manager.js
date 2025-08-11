/**
 * FiltersManager - Gestor de filtros para resultados de búsqueda
 * Maneja el filtrado, búsqueda y ordenamiento de resultados
 */

class FiltersManager {
    constructor() {
        this.originalResults = [];
        this.filteredResults = [];
        this.currentFilters = {
            searchText: '',
            language: '',
            year: '',
            pages: '',
            availability: '',
            sortBy: 'relevance'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadOriginalResults();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Botón para mostrar/ocultar filtros
        const toggleBtn = document.getElementById('toggleFiltersBtn');
        const filtersContent = document.getElementById('filtersContent');
        
        if (toggleBtn && filtersContent) {
            toggleBtn.addEventListener('click', () => this.toggleFilters(filtersContent, toggleBtn));
        }

        // Búsqueda en resultados
        const searchInput = document.getElementById('searchInResults');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.searchText = e.target.value;
                this.debounceSearch();
            });
        }

        // Botón de búsqueda en resultados
        const applySearchBtn = document.getElementById('applySearchFilter');
        if (applySearchBtn) {
            applySearchBtn.addEventListener('click', () => this.applyFilters());
        }

        // Filtros de selección
        const languageFilter = document.getElementById('languageFilter');
        const yearFilter = document.getElementById('yearFilter');
        const pagesFilter = document.getElementById('pagesFilter');
        const availabilityFilter = document.getElementById('availabilityFilter');
        const sortByFilter = document.getElementById('sortBy');

        if (languageFilter) {
            languageFilter.addEventListener('change', (e) => {
                this.currentFilters.language = e.target.value;
                this.applyFilters();
            });
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', (e) => {
                this.currentFilters.year = e.target.value;
                this.applyFilters();
            });
        }

        if (pagesFilter) {
            pagesFilter.addEventListener('change', (e) => {
                this.currentFilters.pages = e.target.value;
                this.applyFilters();
            });
        }

        if (availabilityFilter) {
            availabilityFilter.addEventListener('change', (e) => {
                this.currentFilters.availability = e.target.value;
                this.applyFilters();
            });
        }

        if (sortByFilter) {
            sortByFilter.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Botones de acción
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const showAllResultsBtn = document.getElementById('showAllResultsBtn');

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        if (showAllResultsBtn) {
            showAllResultsBtn.addEventListener('click', () => this.showAllResults());
        }

        // Botón de restablecer filtros (cuando no hay resultados)
        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        // Búsqueda con Enter
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        }
    }

    setupAccessibility() {
        // Agregar atributos ARIA para accesibilidad
        const toggleBtn = document.getElementById('toggleFiltersBtn');
        const filtersContent = document.getElementById('filtersContent');
        
        if (toggleBtn && filtersContent) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.setAttribute('aria-controls', 'filtersContent');
            
            filtersContent.setAttribute('aria-hidden', 'true');
        }
    }

    toggleFilters(filtersContent, toggleBtn) {
        const isVisible = filtersContent.style.display !== 'none';
        
        if (isVisible) {
            filtersContent.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i><span>Mostrar Filtros</span>';
            toggleBtn.classList.remove('expanded');
            toggleBtn.setAttribute('aria-expanded', 'false');
            filtersContent.setAttribute('aria-hidden', 'true');
        } else {
            filtersContent.style.display = 'block';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i><span>Ocultar Filtros</span>';
            toggleBtn.classList.add('expanded');
            toggleBtn.setAttribute('aria-expanded', 'true');
            filtersContent.setAttribute('aria-hidden', 'false');
        }
    }

    loadOriginalResults() {
        // Obtener todos los resultados originales del DOM
        const resultItems = document.querySelectorAll('.result-item');
        this.originalResults = Array.from(resultItems).map(item => ({
            element: item,
            title: this.extractText(item, '.result-title'),
            author: this.extractText(item, '.result-meta .meta-badge'),
            year: this.extractYear(item),
            language: this.extractLanguage(item),
            pages: this.extractPages(item),
            availability: this.extractAvailability(item),
            description: this.extractText(item, '.result-description')
        }));
        
        this.filteredResults = [...this.originalResults];
    }

    extractText(element, selector) {
        const el = element.querySelector(selector);
        return el ? el.textContent.trim().toLowerCase() : '';
    }

    extractYear(element) {
        const yearText = this.extractText(element, '.result-meta .meta-badge');
        const yearMatch = yearText.match(/(\d{4})/);
        return yearMatch ? parseInt(yearMatch[1]) : null;
    }

    extractLanguage(element) {
        const metaText = this.extractText(element, '.result-meta');
        if (metaText.includes('español') || metaText.includes('spanish')) return 'es';
        if (metaText.includes('inglés') || metaText.includes('english')) return 'en';
        if (metaText.includes('francés') || metaText.includes('french')) return 'fr';
        if (metaText.includes('alemán') || metaText.includes('german')) return 'de';
        if (metaText.includes('italiano') || metaText.includes('italian')) return 'it';
        if (metaText.includes('portugués') || metaText.includes('portuguese')) return 'pt';
        return '';
    }

    extractPages(element) {
        const metaText = this.extractText(element, '.result-meta');
        const pagesMatch = metaText.match(/(\d+)\s*páginas?/);
        return pagesMatch ? parseInt(pagesMatch[1]) : null;
    }

    extractAvailability(element) {
        const metaText = this.extractText(element, '.result-meta');
        if (metaText.includes('disponible')) return 'available';
        if (metaText.includes('no disponible')) return 'not-available';
        return '';
    }

    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }

    applyFilters() {
        this.filteredResults = this.originalResults.filter(item => {
            return this.matchesFilters(item);
        });

        this.sortResults();
        this.updateDisplay();
        this.updateFilteredResultsInfo();
    }

    matchesFilters(item) {
        // Filtro de texto de búsqueda
        if (this.currentFilters.searchText) {
            const searchText = this.currentFilters.searchText.toLowerCase();
            const matchesSearch = 
                item.title.includes(searchText) ||
                item.author.includes(searchText) ||
                item.description.includes(searchText);
            
            if (!matchesSearch) return false;
        }

        // Filtro de idioma
        if (this.currentFilters.language && item.language !== this.currentFilters.language) {
            return false;
        }

        // Filtro de año
        if (this.currentFilters.year && item.year) {
            const [startYear, endYear] = this.parseYearRange(this.currentFilters.year);
            if (item.year < startYear || item.year > endYear) {
                return false;
            }
        }

        // Filtro de páginas
        if (this.currentFilters.pages && item.pages) {
            const [minPages, maxPages] = this.parsePagesRange(this.currentFilters.pages);
            if (item.pages < minPages || (maxPages && item.pages > maxPages)) {
                return false;
            }
        }

        // Filtro de disponibilidad
        if (this.currentFilters.availability && item.availability !== this.currentFilters.availability) {
            return false;
        }

        return true;
    }

    parseYearRange(yearRange) {
        if (yearRange === '0-999') return [0, 999];
        if (yearRange === '1201+') return [1201, 9999];
        
        const [start, end] = yearRange.split('-').map(y => parseInt(y));
        return [start, end];
    }

    parsePagesRange(pagesRange) {
        if (pagesRange === '1201+') return [1201, null];
        
        const [start, end] = pagesRange.split('-').map(p => parseInt(p));
        return [start, end];
    }

    sortResults() {
        switch (this.currentFilters.sortBy) {
            case 'title':
                this.filteredResults.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                this.filteredResults.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'year':
                this.filteredResults.sort((a, b) => (b.year || 0) - (a.year || 0));
                break;
            case 'year-asc':
                this.filteredResults.sort((a, b) => (a.year || 0) - (b.year || 0));
                break;
            case 'pages':
                this.filteredResults.sort((a, b) => (a.pages || 0) - (b.pages || 0));
                break;
            case 'pages-desc':
                this.filteredResults.sort((a, b) => (b.pages || 0) - (a.pages || 0));
                break;
            case 'relevance':
            default:
                // Mantener orden original
                break;
        }
    }

    updateDisplay() {
        const resultsContainer = document.querySelector('.results-list');
        if (!resultsContainer) return;

        // Ocultar todos los resultados
        this.originalResults.forEach(item => {
            item.element.style.display = 'none';
        });

        // Mostrar solo los resultados filtrados
        this.filteredResults.forEach(item => {
            item.element.style.display = 'block';
        });

        // Mostrar/ocultar mensaje de no hay resultados
        this.updateNoResultsMessage();

        // Actualizar contador de resultados
        this.updateResultsCounter();
    }

    updateNoResultsMessage() {
        const noResultsDiv = document.getElementById('noFilteredResults');
        const resultsList = document.querySelector('.results-list');
        
        if (noResultsDiv && resultsList) {
            if (this.filteredResults.length === 0) {
                noResultsDiv.style.display = 'block';
                resultsList.style.display = 'none';
            } else {
                noResultsDiv.style.display = 'none';
                resultsList.style.display = 'block';
            }
        }
    }

    updateResultsCounter() {
        const resultsBadge = document.querySelector('.results-badge');
        if (resultsBadge) {
            const totalResults = this.originalResults.length;
            const filteredCount = this.filteredResults.length;
            
            if (filteredCount === totalResults) {
                resultsBadge.innerHTML = `${totalResults} libro${totalResults !== 1 ? 's' : ''}`;
            } else {
                resultsBadge.innerHTML = `${filteredCount} de ${totalResults} libro${totalResults !== 1 ? 's' : ''}`;
            }
        }
    }

    updateFilteredResultsInfo() {
        const filteredInfo = document.getElementById('filteredResultsInfo');
        const filteredText = document.getElementById('filteredResultsText');
        
        if (filteredInfo && filteredText) {
            const totalResults = this.originalResults.length;
            const filteredCount = this.filteredResults.length;
            
            if (filteredCount < totalResults) {
                filteredText.textContent = `Mostrando ${filteredCount} de ${totalResults} resultados filtrados`;
                filteredInfo.style.display = 'block';
            } else {
                filteredInfo.style.display = 'none';
            }
        }
    }

    clearFilters() {
        this.currentFilters = {
            searchText: '',
            language: '',
            year: '',
            pages: '',
            availability: '',
            sortBy: 'relevance'
        };

        // Limpiar campos de formulario
        const searchInput = document.getElementById('searchInResults');
        const languageFilter = document.getElementById('languageFilter');
        const yearFilter = document.getElementById('yearFilter');
        const pagesFilter = document.getElementById('pagesFilter');
        const availabilityFilter = document.getElementById('availabilityFilter');
        const sortByFilter = document.getElementById('sortBy');

        if (searchInput) searchInput.value = '';
        if (languageFilter) languageFilter.value = '';
        if (yearFilter) yearFilter.value = '';
        if (pagesFilter) pagesFilter.value = '';
        if (availabilityFilter) availabilityFilter.value = '';
        if (sortByFilter) sortByFilter.value = 'relevance';

        // Restaurar todos los resultados
        this.filteredResults = [...this.originalResults];
        this.updateDisplay();
        this.updateFilteredResultsInfo();
    }

    showAllResults() {
        this.clearFilters();
    }

    // Método público para recargar resultados (útil cuando se actualiza la página)
    reloadResults() {
        this.loadOriginalResults();
        this.applyFilters();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si hay resultados en la página
    if (document.querySelector('.result-item')) {
        window.filtersManager = new FiltersManager();
        
        // Agregar método global para recargar filtros
        window.reloadFilters = () => {
            if (window.filtersManager) {
                window.filtersManager.reloadResults();
            }
        };
    }
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FiltersManager;
}
