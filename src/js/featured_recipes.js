// URL de la API para obtener las categorías
const apiURL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

// Llamar a la API para obtener las categorías y mostrarlas en featured_recipes.html
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        console.log(data.categories); // Verificar si los datos de categorías se están recibiendo
        displayCategories(data.categories); // Llamar a la función para mostrarlas
    })
    .catch(error => console.error('Error al cargar las categorías:', error));

// Función para mostrar las categorías en el contenedor de categorías
function displayCategories(categories) {
    const categoryContainer = document.querySelector('.category-container');
    categoryContainer.innerHTML = ''; // Limpiar el contenido antes de añadir nuevas categorías

    categories.forEach(category => {
        // Crear una tarjeta de categoría con un enlace a recipes.html
        const categoryCard = `
            <div class="category">
                <a href="/src/recipes/recipes.html?category=${category.strCategory}">
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <p>${category.strCategory}</p>
                </a>
            </div>
        `;
        categoryContainer.innerHTML += categoryCard;
    });
}

// Selección de elementos del DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

// Alternar el menú desplegable al hacer clic en el botón de hamburguesa
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    hamburger.classList.toggle('active');
});