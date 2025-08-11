/**
 * Enhanced UX Scripts for BookRadar
 * Mejora la experiencia del usuario con animaciones y validaciones
 */

(function() {
    'use strict';

    // Configuración global
    const config = {
        animationDuration: 300,
        debounceDelay: 300,
        focusClass: 'focused',
        errorClass: 'has-error',
        successClass: 'has-success'
    };

    // Utilidades
    const utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        addClass: function(element, className) {
            if (element && element.classList) {
                element.classList.add(className);
            }
        },

        removeClass: function(element, className) {
            if (element && element.classList) {
                element.classList.remove(className);
            }
        },

        hasClass: function(element, className) {
            return element && element.classList && element.classList.contains(className);
        }
    };

    // Gestor de animaciones
    const AnimationManager = {
        init: function() {
            this.observeElements();
            this.addScrollAnimations();
        },

        observeElements: function() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observar elementos que deben animarse
            document.querySelectorAll('.search-option-item, .feature-card, .info-tip-card').forEach(el => {
                observer.observe(el);
            });
        },

        addScrollAnimations: function() {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            });

            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(el => scrollObserver.observe(el));
        }
    };

    // Gestor de validación en tiempo real
    const ValidationManager = {
        init: function() {
            this.setupRealTimeValidation();
            this.setupFormValidation();
        },

        setupRealTimeValidation: function() {
            const searchInput = document.querySelector('#Autor');
            if (!searchInput) return;

            const debouncedValidation = utils.debounce((value) => {
                this.validateSearchInput(value, searchInput);
            }, config.debounceDelay);

            searchInput.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                debouncedValidation(value);
            });

            searchInput.addEventListener('blur', (e) => {
                const value = e.target.value.trim();
                this.validateSearchInput(value, searchInput, true);
            });
        },

        validateSearchInput: function(value, input, isBlur = false) {
            const wrapper = input.closest('.search-input-wrapper');
            const validationMessage = input.parentNode.querySelector('.validation-messages');

            // Limpiar clases anteriores
            utils.removeClass(wrapper, config.errorClass);
            utils.removeClass(wrapper, config.successClass);
            utils.removeClass(input, 'is-invalid');
            utils.removeClass(input, 'is-valid');

            if (!value) {
                if (isBlur) {
                    this.showError(input, 'Por favor, ingresa el nombre de un autor', validationMessage);
                }
                return;
            }

            if (value.length < 2) {
                this.showError(input, 'El nombre debe tener al menos 2 caracteres', validationMessage);
                return;
            }

            if (value.length > 100) {
                this.showError(input, 'El nombre es demasiado largo', validationMessage);
                return;
            }

            // Validación exitosa
            this.showSuccess(input, wrapper, validationMessage);
        },

        showError: function(input, message, validationContainer) {
            utils.addClass(input, 'is-invalid');
            utils.addClass(input.closest('.search-input-wrapper'), config.errorClass);
            
            if (validationContainer) {
                validationContainer.innerHTML = `
                    <div class="validation-error">
                        <span>${message}</span>
                    </div>
                `;
            }
        },

        showSuccess: function(input, wrapper, validationContainer) {
            utils.addClass(input, 'is-valid');
            utils.addClass(wrapper, config.successClass);
            
            if (validationContainer) {
                validationContainer.innerHTML = `
                    <div class="validation-success">
                        <span>✓ Nombre válido</span>
                    </div>
                    <style>
                        .validation-success {
                            color: #28a745;
                            font-size: 0.875rem;
                            font-weight: 500;
                            margin-top: 0.5rem;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        }
                    </style>
                `;
            }
        },

        setupFormValidation: function() {
            const form = document.querySelector('#searchForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                const searchInput = document.querySelector('#Autor');
                if (!searchInput || !searchInput.value.trim()) {
                    e.preventDefault();
                    this.showError(searchInput, 'Por favor, ingresa el nombre de un autor');
                    searchInput.focus();
                    return false;
                }
            });
        }
    };

    // Gestor de opciones de búsqueda
    const SearchOptionsManager = {
        init: function() {
            this.setupOptionInteractions();
            this.setupCustomLimit();
            this.setupSearchAll();
            this.updateSearchTips();
        },

        setupOptionInteractions: function() {
            const optionItems = document.querySelectorAll('.search-option-item');
            optionItems.forEach(item => {
                const radio = item.querySelector('input[type="radio"]');
                if (radio) {
                    radio.addEventListener('change', () => {
                        this.handleOptionChange();
                        this.animateOptionSelection(item);
                    });
                }
            });
        },

        setupCustomLimit: function() {
            const customLimitSection = document.getElementById('limitePersonalizadoGroup');
            const personalizadoRadio = document.getElementById('personalizado');
            
            if (personalizadoRadio && customLimitSection) {
                personalizadoRadio.addEventListener('change', () => {
                    if (personalizadoRadio.checked) {
                        this.showCustomLimit(customLimitSection);
                    }
                });
            }
        },

        setupSearchAll: function() {
            const searchAllCheckbox = document.getElementById('buscarTodosCheck');
            if (!searchAllCheckbox) return;

            searchAllCheckbox.addEventListener('change', () => {
                this.handleSearchAllChange(searchAllCheckbox.checked);
            });
        },

        handleOptionChange: function() {
            const selectedOption = document.querySelector('input[name="TipoBusquedaResultados"]:checked');
            if (!selectedOption) return;

            // Habilitar/deshabilitar opciones según la selección
            this.updateOptionStates(selectedOption.value);
            
            // Actualizar tips
            this.updateSearchTips();
        },

        handleSearchAllChange: function(isChecked) {
            const optionItems = document.querySelectorAll('.search-option-item');
            const customLimitSection = document.getElementById('limitePersonalizadoGroup');
            
            if (isChecked) {
                // Deshabilitar otras opciones
                optionItems.forEach(item => {
                    const radio = item.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.disabled = true;
                        utils.addClass(item, 'disabled');
                    }
                });
                
                if (customLimitSection) {
                    customLimitSection.style.display = 'none';
                }
            } else {
                // Habilitar opciones
                optionItems.forEach(item => {
                    const radio = item.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.disabled = false;
                        utils.removeClass(item, 'disabled');
                    }
                });
                
                // Mostrar límite personalizado si está seleccionado
                const personalizadoRadio = document.getElementById('personalizado');
                if (personalizadoRadio && personalizadoRadio.checked && customLimitSection) {
                    this.showCustomLimit(customLimitSection);
                }
            }
            
            this.updateSearchTips();
        },

        updateOptionStates: function(selectedValue) {
            const customLimitSection = document.getElementById('limitePersonalizadoGroup');
            
            if (selectedValue === 'personalizado' && customLimitSection) {
                this.showCustomLimit(customLimitSection);
            } else if (customLimitSection) {
                customLimitSection.style.display = 'none';
            }
        },

        showCustomLimit: function(section) {
            section.style.display = 'block';
            section.style.opacity = '0';
            section.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.4s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 10);
        },

        animateOptionSelection: function(selectedItem) {
            // Remover animación de otros elementos
            document.querySelectorAll('.search-option-item').forEach(item => {
                utils.removeClass(item, 'selected');
            });
            
            // Agregar animación al elemento seleccionado
            utils.addClass(selectedItem, 'selected');
            
            // Efecto de pulso
            selectedItem.style.transform = 'scale(1.02)';
            setTimeout(() => {
                selectedItem.style.transform = 'scale(1)';
            }, 200);
        },

        updateSearchTips: function() {
            const tipText = document.getElementById('searchTipText');
            if (!tipText) return;

            const selectedOption = document.querySelector('input[name="TipoBusquedaResultados"]:checked');
            const searchAll = document.getElementById('buscarTodosCheck')?.checked || false;

            let tipMessage = '';
            
            if (searchAll) {
                tipMessage = '⚠️ <strong>Búsqueda completa activada:</strong> Se buscarán todos los resultados disponibles. Esto puede tomar varios minutos.';
            } else if (selectedOption) {
                switch (selectedOption.value) {
                    case 'limitado':
                        tipMessage = '⚡ <strong>Búsqueda rápida:</strong> Obtendrás hasta 100 resultados en segundos. Perfecto para la mayoría de búsquedas.';
                        break;
                    case 'completo':
                        tipMessage = '🔍 <strong>Búsqueda completa:</strong> Se realizará una búsqueda completa para obtener todos los resultados disponibles.';
                        break;
                    case 'personalizado':
                        tipMessage = '💡 <strong>Límite personalizado:</strong> Selecciona cuántos libros quieres obtener. Cantidades mayores pueden tomar más tiempo.';
                        break;
                }
            }

            if (tipMessage) {
                tipText.innerHTML = tipMessage;
                this.animateTipUpdate(tipText);
            }
        },

        animateTipUpdate: function(tipElement) {
            tipElement.style.opacity = '0.7';
            tipElement.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                tipElement.style.transition = 'all 0.3s ease';
                tipElement.style.opacity = '1';
                tipElement.style.transform = 'scale(1)';
            }, 100);
        }
    };

    // Gestor de feedback visual
    const FeedbackManager = {
        init: function() {
            this.setupHoverEffects();
            this.setupFocusEffects();
            this.setupLoadingStates();
        },

        setupHoverEffects: function() {
            const interactiveElements = document.querySelectorAll('.search-option-item, .search-button, .custom-limit-card, .search-all-card');
            
            interactiveElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.addHoverEffect(element);
                });
                
                element.addEventListener('mouseleave', () => {
                    this.removeHoverEffect(element);
                });
            });
        },

        setupFocusEffects: function() {
            const focusableElements = document.querySelectorAll('input, select, button, .option-label');
            
            focusableElements.forEach(element => {
                element.addEventListener('focus', () => {
                    this.addFocusEffect(element);
                });
                
                element.addEventListener('blur', () => {
                    this.removeFocusEffect(element);
                });
            });
        },

        setupLoadingStates: function() {
            const form = document.querySelector('#searchForm');
            if (!form) return;

            form.addEventListener('submit', () => {
                this.showLoadingState();
            });
        },

        addHoverEffect: function(element) {
            utils.addClass(element, 'hovered');
        },

        removeHoverEffect: function(element) {
            utils.removeClass(element, 'hovered');
        },

        addFocusEffect: function(element) {
            utils.addClass(element, 'focused');
        },

        removeFocusEffect: function(element) {
            utils.removeClass(element, 'focused');
        },

        showLoadingState: function() {
            const searchButton = document.querySelector('#searchButton');
            if (!searchButton) return;

            utils.addClass(searchButton, 'loading');
            searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Buscando...</span>';
            searchButton.disabled = true;
        }
    };

    // Inicialización cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar todos los gestores
        AnimationManager.init();
        ValidationManager.init();
        SearchOptionsManager.init();
        FeedbackManager.init();

        // Agregar clases CSS para animaciones
        document.body.classList.add('enhanced-ux-loaded');

        // Log de inicialización
        console.log('BookRadar Enhanced UX initialized successfully');
    });

    // Exponer funciones útiles globalmente
    window.BookRadarUX = {
        AnimationManager,
        ValidationManager,
        SearchOptionsManager,
        FeedbackManager,
        utils
    };

})();
