// URL de la API para obtener las categorías
const apiURL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

// Llamar a la API para obtener las categorías y mostrarlas en index.html
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        displayCategories(data.categories); // Llamar a la función para mostrarlas
    })
    .catch(error => console.error('Error al cargar las categorías:', error));

// Función para mostrar las categorías en el contenedor de categorías
function displayCategories(categories) {
    const categoryContainer = document.querySelector('.category-container');
    categoryContainer.innerHTML = ''; // Limpiar el contenido antes de añadir nuevas categorías

    categories.forEach(category => {
        // Crear una tarjeta de categoría con un enlace a recipe.html
        const categoryCard = `
            <div class="category-item">
                <a href="/src/recipe/recipe.html?category=${category.strCategory}">
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <p>${category.strCategory}</p>
                </a>
            </div>
        `;
        categoryContainer.innerHTML += categoryCard;
    });
}
