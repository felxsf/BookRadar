// ===== FUNCIONALIDADES INTERACTIVAS DE BOOKRADAR =====

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initializeAnimations();
    initializeSearchEnhancements();
    initializeTableInteractions();
    initializeScrollEffects();
});

// ===== ANIMACIONES Y EFECTOS VISUALES =====
function initializeAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.feature-card, .result-item, .hero-content, .search-form-container').forEach(el => {
        observer.observe(el);
    });

    // Efecto de parallax suave en el hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// ===== MEJORAS EN LA BÚSQUEDA =====
function initializeSearchEnhancements() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        // Autocompletado con sugerencias
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });

        // Búsqueda con Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchButton.click();
            }
        });

        // Efecto de focus mejorado
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }

    // Botones de búsqueda rápida con efectos
    document.querySelectorAll('.quick-search-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Efecto de ripple
            createRippleEffect(this, event);
            
            // Simular carga
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Buscando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = this.getAttribute('data-original-text') || this.textContent;
                this.disabled = false;
            }, 1000);
        });
    });
}

// ===== SUGERENCIAS DE BÚSQUEDA =====
function showSearchSuggestions(query) {
    const suggestions = [
        'Gabriel García Márquez',
        'Stephen King',
        'Isabel Allende',
        'Mario Vargas Llosa',
        'Jorge Luis Borges',
        'Pablo Neruda',
        'Octavio Paz',
        'Carlos Fuentes'
    ];

    const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length > 0) {
        createSuggestionsDropdown(filtered);
    }
}

function createSuggestionsDropdown(suggestions) {
    // Remover dropdown existente
    hideSearchSuggestions();
    
    const dropdown = document.createElement('div');
    dropdown.className = 'search-suggestions';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #e2e8f0;
    `;

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.style.cssText = `
            padding: 0.75rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid #f7fafc;
            transition: background-color 0.2s ease;
        `;
        item.textContent = suggestion;
        
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f7fafc';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
        
        item.addEventListener('click', () => {
            document.querySelector('.search-input').value = suggestion;
            hideSearchSuggestions();
            document.querySelector('.search-button').click();
        });
        
        dropdown.appendChild(item);
    });

    const searchWrapper = document.querySelector('.search-input-wrapper');
    if (searchWrapper) {
        searchWrapper.style.position = 'relative';
        searchWrapper.appendChild(dropdown);
    }
}

function hideSearchSuggestions() {
    const existing = document.querySelector('.search-suggestions');
    if (existing) {
        existing.remove();
    }
}

// ===== EFECTO RIPPLE =====
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== INTERACCIONES CON TABLAS =====
function initializeTableInteractions() {
    // Hover effects para filas de tabla
    document.querySelectorAll('.minimal-table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Tooltips para botones de acción
    document.querySelectorAll('[title]').forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            showTooltip(this, e);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

// ===== TOOLTIPS =====
function showTooltip(element, event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = element.getAttribute('title');
    tooltip.style.cssText = `
        position: fixed;
        background: #2d3748;
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        font-size: 0.85rem;
        z-index: 10000;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = tooltip.getBoundingClientRect();
    tooltip.style.left = (event.clientX + 10) + 'px';
    tooltip.style.top = (event.clientY - rect.height - 10) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.custom-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.modern-header');
        
        if (header) {
            if (scrolled > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// ===== FUNCIONES UTILITARIAS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== ANIMACIONES CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .modern-header.scrolled {
        background: rgba(26, 32, 44, 0.95);
        backdrop-filter: blur(20px);
    }
    
    .search-input-wrapper.focused {
        transform: translateY(-2px);
        box-shadow: 0 15px 40px rgba(102, 126, 234, 0.25);
    }
    
    .suggestion-item:hover {
        background-color: #f7fafc;
    }
`;

document.head.appendChild(style);
