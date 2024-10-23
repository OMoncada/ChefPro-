// URL de la API para obtener las categorías
const apiURL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

// Llamar a la API para obtener las categorías y mostrarlas en index.html
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
        console.log(`Generando enlace para: ${category.strCategory}`); // Depurar el nombre de la categoría

        const categoryCard = `
            <div class="category-item">
                <a href="src/recipes/recipes.html?category=${category.strCategory}">
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <p>${category.strCategory}</p>
                </a>
            </div>
        `;
        categoryContainer.innerHTML += categoryCard;
    });
}


// Funcionalidad para el carrusel de categorías
const categoryCarousel = document.getElementById('category-carousel');
const prevButton = document.getElementById('category-prev');
const nextButton = document.getElementById('category-next');

// Desplazar el carrusel hacia la izquierda
prevButton.addEventListener('click', () => {
    categoryCarousel.scrollBy({
        left: -categoryCarousel.clientWidth, // Desplazar la misma cantidad que el ancho visible
        behavior: 'smooth'
    });
});

// Desplazar el carrusel hacia la derecha
nextButton.addEventListener('click', () => {
    categoryCarousel.scrollBy({
        left: categoryCarousel.clientWidth, // Desplazar la misma cantidad que el ancho visible
        behavior: 'smooth'
    });
});
