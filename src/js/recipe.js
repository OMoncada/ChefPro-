// Obtener la categoría seleccionada de la URL
const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

// Verificar si hay una categoría seleccionada
if (category) {
    // Llamar a la API para obtener las recetas por categoría
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.meals);  // Llamar a la función para mostrar las recetas
        })
        .catch(error => console.error('Error al cargar las recetas:', error));
} else {
    console.error('No se seleccionó ninguna categoría');
}

// Función para mostrar las recetas en el carrusel
function displayRecipes(recipes) {
    const recipeCarousel = document.getElementById('recipe-carousel');
    recipeCarousel.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevas recetas

    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="recipe-card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
            </div>
        `;
        recipeCarousel.innerHTML += recipeCard;
    });

    // Lógica para el carrusel (desplazamiento entre recetas)
    const slides = document.querySelectorAll('.recipe-card');
    let currentSlide = 0;

    document.getElementById('next').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel(currentSlide, slides);
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel(currentSlide, slides);
    });
}

// Función para desplazar el carrusel
function updateCarousel(slideIndex, slides) {
    const slideWidth = slides[0].offsetWidth;
    const carousel = document.querySelector('.carousel');
    carousel.style.transform = `translateX(${-slideIndex * slideWidth}px)`;
}
