/**
 * BookRadar - Validaciones del Frontend
 * Este archivo contiene validaciones personalizadas para mejorar la experiencia del usuario
 */

class BookRadarValidator {
    constructor() {
        this.initializeValidators();
        this.setupEventListeners();
    }

    initializeValidators() {
        // Configurar validaciones personalizadas de jQuery
        $.validator.addMethod("authorFormat", function(value, element) {
            if (!value) return true; // Permitir vacío si no es requerido
            return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-']+$/.test(value);
        }, "El nombre del autor solo puede contener letras, espacios, puntos, guiones y apóstrofes");

        $.validator.addMethod("isbnFormat", function(value, element) {
            if (!value) return true; // Permitir vacío si no es requerido
            return /^[0-9\-Xx]+$/.test(value);
        }, "El ISBN solo puede contener números, guiones y la letra X");

        $.validator.addMethod("yearRange", function(value, element) {
            if (!value) return true; // Permitir vacío si no es requerido
            const year = parseInt(value);
            return year >= 1800 && year <= 2030;
        }, "El año debe estar entre 1800 y 2030");

        $.validator.addMethod("pageSizeRange", function(value, element) {
            if (!value) return true; // Permitir vacío si no es requerido
            const size = parseInt(value);
            return size >= 5 && size <= 50;
        }, "El tamaño de página debe estar entre 5 y 50");
    }

    setupEventListeners() {
        // Validación en tiempo real para campos de texto
        $(document).on('input blur', 'input[data-validation]', function() {
            this.validateField($(this));
        });

        // Validación antes de enviar formularios
        $(document).on('submit', 'form', function(e) {
            if (!this.validateForm($(this))) {
                e.preventDefault();
                return false;
            }
        });

        // Validación de campos numéricos
        $(document).on('input', 'input[type="number"]', function() {
            this.validateNumericField($(this));
        });
    }

    validateField(field) {
        const value = field.val().trim();
        const validationType = field.data('validation');
        let isValid = true;
        let errorMessage = '';

        switch (validationType) {
            case 'author':
                isValid = this.validateAuthor(value);
                errorMessage = 'El nombre del autor solo puede contener letras, espacios, puntos, guiones y apóstrofes';
                break;
            case 'isbn':
                isValid = this.validateISBN(value);
                errorMessage = 'El ISBN solo puede contener números, guiones y la letra X';
                break;
            case 'year':
                isValid = this.validateYear(value);
                errorMessage = 'El año debe estar entre 1800 y 2030';
                break;
            case 'required':
                isValid = value.length > 0;
                errorMessage = 'Este campo es obligatorio';
                break;
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    validateAuthor(value) {
        if (!value) return true;
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-']+$/.test(value);
    }

    validateISBN(value) {
        if (!value) return true;
        return /^[0-9\-Xx]+$/.test(value);
    }

    validateYear(value) {
        if (!value) return true;
        const year = parseInt(value);
        return !isNaN(year) && year >= 1800 && year <= 2030;
    }

    showFieldValidation(field, isValid, errorMessage) {
        const errorContainer = field.siblings('.field-validation-error');
        
        if (!isValid) {
            field.addClass('is-invalid').removeClass('is-valid');
            if (errorContainer.length === 0) {
                field.after(`<span class="field-validation-error text-danger">${errorMessage}</span>`);
            } else {
                errorContainer.text(errorMessage).show();
            }
        } else {
            field.addClass('is-valid').removeClass('is-invalid');
            if (errorContainer.length > 0) {
                errorContainer.hide();
            }
        }
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.find('[data-validation="required"]');
        
        requiredFields.each(function() {
            if (!this.validateField($(this))) {
                isValid = false;
            }
        });

        // Validar campos con validaciones específicas
        const customFields = form.find('[data-validation]:not([data-validation="required"])');
        customFields.each(function() {
            if (!this.validateField($(this))) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateNumericField(field) {
        const value = field.val();
        const min = parseInt(field.attr('min'));
        const max = parseInt(field.attr('max'));

        if (value && !isNaN(value)) {
            const numValue = parseInt(value);
            if (min && numValue < min) {
                field.val(min);
            } else if (max && numValue > max) {
                field.val(max);
            }
        }
    }

    // Método para limpiar validaciones
    clearValidations(form) {
        form.find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
        form.find('.field-validation-error').remove();
    }

    // Método para mostrar mensaje de éxito
    showSuccessMessage(message, duration = 3000) {
        const successDiv = $('<div class="alert alert-success alert-dismissible fade show" role="alert">' +
            '<i class="fas fa-check-circle me-2"></i>' +
            message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
            '</div>');

        $('main').prepend(successDiv);

        if (duration > 0) {
            setTimeout(() => {
                successDiv.alert('close');
            }, duration);
        }
    }

    // Método para mostrar mensaje de error
    showErrorMessage(message, duration = 5000) {
        const errorDiv = $('<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
            '<i class="fas fa-exclamation-triangle me-2"></i>' +
            message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
            '</div>');

        $('main').prepend(errorDiv);

        if (duration > 0) {
            setTimeout(() => {
                errorDiv.alert('close');
            }, duration);
        }
    }
}

// Inicializar validador cuando el DOM esté listo
$(document).ready(function() {
    window.bookRadarValidator = new BookRadarValidator();
    
    // Configurar validaciones de jQuery para formularios específicos
    $('#searchForm').validate({
        rules: {
            Autor: {
                required: true,
                minlength: 2,
                maxlength: 100,
                authorFormat: true
            }
        },
        messages: {
            Autor: {
                required: "El campo Autor es obligatorio",
                minlength: "El nombre del autor debe tener al menos 2 caracteres",
                maxlength: "El nombre del autor no puede exceder los 100 caracteres"
            }
        },
        errorElement: 'span',
        errorClass: 'text-danger',
        highlight: function(element) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function(element) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        }
    });
});

// Funciones de utilidad globales
window.BookRadarUtils = {
    // Función para establecer autor desde botones de búsqueda rápida
    setAuthor: function(authorName) {
        const autorInput = $('input[name="Autor"]');
        autorInput.val(authorName);
        
        // Validar el campo
        if (window.bookRadarValidator) {
            window.bookRadarValidator.validateField(autorInput);
        }
        
        // Enviar formulario
        $('#searchForm').submit();
    },

    // Función para mostrar loading
    showLoading: function(buttonId, text = 'Procesando...') {
        const button = $(`#${buttonId}`);
        if (button.length) {
            button.data('original-text', button.html());
            button.html(`<i class="fas fa-spinner fa-spin me-2"></i>${text}`);
            button.prop('disabled', true);
        }
    },

    // Función para ocultar loading
    hideLoading: function(buttonId) {
        const button = $(`#${buttonId}`);
        if (button.length && button.data('original-text')) {
            button.html(button.data('original-text'));
            button.prop('disabled', false);
        }
    },

    // Función para validar formulario antes de enviar
    validateFormBeforeSubmit: function(formId) {
        const form = $(`#${formId}`);
        if (window.bookRadarValidator) {
            return window.bookRadarValidator.validateForm(form);
        }
        return true;
    }
};
