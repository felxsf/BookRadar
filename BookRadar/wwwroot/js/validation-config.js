/**
 * BookRadar - Configuración de Validaciones
 * Este archivo permite personalizar fácilmente las reglas de validación
 */

window.BookRadarValidationConfig = {
    // Configuración general
    general: {
        enableRealTimeValidation: true,
        showSuccessMessages: true,
        showErrorMessages: true,
        autoFocusOnError: true,
        scrollToError: true
    },

    // Configuración de campos específicos
    fields: {
        autor: {
            required: true,
            minLength: 2,
            maxLength: 100,
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-']+$/,
            patternMessage: "El nombre del autor solo puede contener letras, espacios, puntos, guiones y apóstrofes",
            messages: {
                required: "El campo Autor es obligatorio",
                minLength: "El nombre del autor debe tener al menos 2 caracteres",
                maxLength: "El nombre del autor no puede exceder los 100 caracteres"
            }
        },
        titulo: {
            required: false,
            maxLength: 200,
            messages: {
                maxLength: "El título no puede exceder los 200 caracteres"
            }
        },
        isbn: {
            required: false,
            maxLength: 20,
            pattern: /^[0-9\-Xx]+$/,
            patternMessage: "El ISBN solo puede contener números, guiones y la letra X",
            messages: {
                maxLength: "El ISBN no puede exceder los 20 caracteres"
            }
        },
        editorial: {
            required: false,
            maxLength: 100,
            messages: {
                maxLength: "La editorial no puede exceder los 100 caracteres"
            }
        },
        anioDesde: {
            required: false,
            min: 1800,
            max: 2030,
            messages: {
                min: "El año debe ser mayor o igual a 1800",
                max: "El año debe ser menor o igual a 2030"
            }
        },
        anioHasta: {
            required: false,
            min: 1800,
            max: 2030,
            messages: {
                min: "El año debe ser mayor o igual a 1800",
                max: "El año debe ser menor o igual a 2030"
            }
        },
        idioma: {
            required: false,
            maxLength: 10,
            messages: {
                maxLength: "El código de idioma no puede exceder los 10 caracteres"
            }
        }
    },

    // Configuración de mensajes
    messages: {
        success: {
            searchCompleted: "Búsqueda completada exitosamente",
            formValid: "Formulario válido",
            fieldValid: "Campo válido"
        },
        error: {
            formInvalid: "Por favor, corrige los errores en el formulario",
            fieldInvalid: "Campo inválido",
            serverError: "Ocurrió un error en el servidor",
            networkError: "Error de conexión"
        },
        warning: {
            fieldEmpty: "Este campo está vacío",
            fieldTooShort: "Este campo es muy corto",
            fieldTooLong: "Este campo es muy largo"
        },
        info: {
            validating: "Validando...",
            loading: "Cargando...",
            processing: "Procesando..."
        }
    },

    // Configuración de estilos
    styles: {
        valid: {
            borderColor: "#198754",
            backgroundColor: "#f8fff9",
            iconColor: "#198754"
        },
        invalid: {
            borderColor: "#dc3545",
            backgroundColor: "#fff8f8",
            iconColor: "#dc3545"
        },
        warning: {
            borderColor: "#ffc107",
            backgroundColor: "#fffef8",
            iconColor: "#ffc107"
        },
        info: {
            borderColor: "#17a2b8",
            backgroundColor: "#f8fdff",
            iconColor: "#17a2b8"
        }
    },

    // Configuración de animaciones
    animations: {
        enable: true,
        duration: 300,
        easing: "ease-in-out",
        shake: {
            enable: true,
            duration: 500,
            distance: 10
        },
        fade: {
            enable: true,
            duration: 200
        }
    },

    // Configuración de validación en tiempo real
    realTime: {
        enable: true,
        delay: 300, // Milisegundos de espera después de que el usuario deja de escribir
        validateOnBlur: true,
        validateOnInput: true,
        validateOnChange: true
    },

    // Configuración de validación del servidor
    server: {
        enableAjaxValidation: true,
        timeout: 10000, // 10 segundos
        retryAttempts: 3,
        retryDelay: 1000 // 1 segundo
    },

    // Configuración de accesibilidad
    accessibility: {
        announceErrors: true,
        announceSuccess: true,
        useAriaLabels: true,
        keyboardNavigation: true,
        screenReaderSupport: true
    },

    // Configuración de internacionalización
    i18n: {
        defaultLanguage: "es",
        supportedLanguages: ["es", "en"],
        messages: {
            es: {
                // Los mensajes ya están en español por defecto
            },
            en: {
                autor: {
                    required: "Author field is required",
                    minLength: "Author name must be at least 2 characters long",
                    maxLength: "Author name cannot exceed 100 characters",
                    patternMessage: "Author name can only contain letters, spaces, dots, hyphens and apostrophes"
                }
                // Agregar más traducciones según sea necesario
            }
        }
    },

    // Configuración de debugging
    debug: {
        enable: false, // Cambiar a true en desarrollo
        logLevel: "info", // "error", "warn", "info", "debug"
        showValidationDetails: false,
        logToConsole: true
    }
};

// Función para obtener la configuración de un campo específico
window.getFieldConfig = function(fieldName) {
    return window.BookRadarValidationConfig.fields[fieldName] || {};
};

// Función para obtener un mensaje específico
window.getMessage = function(type, key, language = null) {
    const lang = language || window.BookRadarValidationConfig.i18n.defaultLanguage;
    const messages = window.BookRadarValidationConfig.messages[type];
    
    if (messages && messages[key]) {
        return messages[key];
    }
    
    // Fallback a español
    const defaultMessages = window.BookRadarValidationConfig.i18n.messages.es;
    if (defaultMessages && defaultMessages[key]) {
        return defaultMessages[key];
    }
    
    return key; // Retornar la clave si no se encuentra el mensaje
};

// Función para cambiar el idioma de las validaciones
window.setValidationLanguage = function(language) {
    if (window.BookRadarValidationConfig.i18n.supportedLanguages.includes(language)) {
        window.BookRadarValidationConfig.i18n.defaultLanguage = language;
        
        // Recargar las validaciones con el nuevo idioma
        if (window.bookRadarValidator) {
            window.bookRadarValidator.reloadValidations();
        }
        
        return true;
    }
    return false;
};

// Función para habilitar/deshabilitar validaciones en tiempo real
window.toggleRealTimeValidation = function(enable) {
    window.BookRadarValidationConfig.realTime.enable = enable;
    
    if (window.bookRadarValidator) {
        if (enable) {
            window.bookRadarValidator.enableRealTimeValidation();
        } else {
            window.bookRadarValidator.disableRealTimeValidation();
        }
    }
};

// Función para personalizar estilos de validación
window.setValidationStyles = function(styles) {
    Object.assign(window.BookRadarValidationConfig.styles, styles);
    
    // Aplicar estilos personalizados
    if (window.bookRadarValidator) {
        window.bookRadarValidator.applyCustomStyles();
    }
};

// Función para habilitar modo debug
window.enableValidationDebug = function(enable = true) {
    window.BookRadarValidationConfig.debug.enable = enable;
    
    if (enable) {
        console.log("BookRadar Validation Debug Mode: ENABLED");
        console.log("Configuration:", window.BookRadarValidationConfig);
    }
};

// Exportar configuración para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.BookRadarValidationConfig;
}
