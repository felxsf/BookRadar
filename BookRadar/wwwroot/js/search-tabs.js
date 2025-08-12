// search-tabs.js - Manejo de pestañas de búsqueda en BookRadar
(function() {
    'use strict';

    class SearchTabsManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupTabSwitching();
            this.setupFormValidation();
            this.setupTabPersistence();
        }

        setupTabSwitching() {
            const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
            const tabPanes = document.querySelectorAll('.tab-pane');

            tabButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remover clase active de todos los botones y paneles
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabPanes.forEach(pane => pane.classList.remove('show', 'active'));
                    
                    // Agregar clase active al botón clickeado
                    button.classList.add('active');
                    
                    // Mostrar el panel correspondiente
                    const targetId = button.getAttribute('data-bs-target');
                    const targetPane = document.querySelector(targetId);
                    if (targetPane) {
                        targetPane.classList.add('show', 'active');
                    }
                    
                    // Guardar la pestaña activa en localStorage
                    this.saveActiveTab(targetId);
                    
                    // Actualizar validación según la pestaña activa
                    this.updateValidation(targetId);
                });
            });
        }

        setupFormValidation() {
            const form = document.getElementById('searchForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                const activeTab = this.getActiveTab();
                
                if (activeTab === '#autor-search') {
                    if (!this.validateAutorSearch()) {
                        e.preventDefault();
                        return;
                    }
                } else if (activeTab === '#titulo-search') {
                    if (!this.validateTituloSearch()) {
                        e.preventDefault();
                        return;
                    }
                } else if (activeTab === '#avanzada-search') {
                    if (!this.validateAvanzadaSearch()) {
                        e.preventDefault();
                        return;
                    }
                }
            });
        }

        validateAutorSearch() {
            const autorInput = document.getElementById('Autor');
            if (!autorInput || !autorInput.value.trim()) {
                this.showError('Debes ingresar un autor para realizar la búsqueda.');
                return false;
            }
            return true;
        }

        validateTituloSearch() {
            const tituloInput = document.getElementById('Titulo');
            if (!tituloInput || !tituloInput.value.trim()) {
                this.showError('Debes ingresar un título para realizar la búsqueda.');
                return false;
            }
            return true;
        }

        validateAvanzadaSearch() {
            const tituloInput = document.getElementById('TituloAvanzado');
            const autorInput = document.getElementById('AutorAvanzado');
            const idiomaInput = document.getElementById('IdiomaAvanzado');
            const formatoInput = document.getElementById('FormatoAvanzado');
            const anioDesdeInput = document.getElementById('AnioDesdeAvanzado');
            const anioHastaInput = document.getElementById('AnioHastaAvanzado');

            // Al menos uno de los campos principales debe estar lleno
            if (!tituloInput?.value.trim() && !autorInput?.value.trim()) {
                this.showError('En la búsqueda avanzada debes ingresar al menos un título o autor.');
                return false;
            }

            // Validar años si se proporcionan
            if (anioDesdeInput?.value && anioHastaInput?.value) {
                const anioDesde = parseInt(anioDesdeInput.value);
                const anioHasta = parseInt(anioHastaInput.value);
                
                if (anioDesde > anioHasta) {
                    this.showError('El año inicial no puede ser mayor al año final.');
                    return false;
                }
            }

            return true;
        }

        showError(message) {
            // Remover mensajes de error existentes
            const existingError = document.querySelector('.search-error-message');
            if (existingError) {
                existingError.remove();
            }

            // Crear y mostrar nuevo mensaje de error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger search-error-message mt-3';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            `;

            const searchForm = document.getElementById('searchForm');
            if (searchForm) {
                searchForm.insertBefore(errorDiv, searchForm.firstChild);
            }

            // Hacer scroll al mensaje de error
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setupTabPersistence() {
            // Restaurar la pestaña activa al cargar la página
            const savedTab = this.getSavedTab();
            if (savedTab) {
                const tabButton = document.querySelector(`[data-bs-target="${savedTab}"]`);
                if (tabButton) {
                    tabButton.click();
                }
            }
        }

        saveActiveTab(tabId) {
            localStorage.setItem('bookradar-active-tab', tabId);
        }

        getSavedTab() {
            return localStorage.getItem('bookradar-active-tab');
        }

        getActiveTab() {
            const activeTab = document.querySelector('.tab-pane.active');
            return activeTab ? `#${activeTab.id}` : '#autor-search';
        }

        // Método público para cambiar a una pestaña específica
        switchToTab(tabId) {
            const tabButton = document.querySelector(`[data-bs-target="${tabId}"]`);
            if (tabButton) {
                tabButton.click();
            }
        }
    }

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        window.searchTabsManager = new SearchTabsManager();
    });

    // Exponer la clase globalmente para uso externo
    window.SearchTabsManager = SearchTabsManager;

})();
