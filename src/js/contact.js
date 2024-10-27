document.addEventListener('DOMContentLoaded', function () {
    const contactModal = document.getElementById('contactConfirmationModal');
    const closeContactModalButton = document.querySelector('.close-contact-modal');

    // Mostrar el modal y limpiar el formulario al enviar
    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario
        contactModal.style.display = 'block'; // Muestra el modal de confirmación
        this.reset(); // Limpia el formulario
    });

    // Cerrar el modal de confirmación al hacer clic en la "X"
    closeContactModalButton.addEventListener('click', function () {
        contactModal.style.display = 'none';
    });

    // Cerrar el modal si el usuario hace clic fuera del contenido del modal
    window.addEventListener('click', function (event) {
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
        }
    });
});


// Selección de elementos del DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

// Alternar el menú desplegable al hacer clic en el botón de hamburguesa
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    hamburger.classList.toggle('active');
});