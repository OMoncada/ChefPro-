let currentSlide = 0; // Para controlar el índice del slide actual

// Función para obtener recetas de una categoría específica
function fetchRecipesByCategory(category) {
    const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    return fetch(apiURL)
        .then(response => response.json())
        .then(data => data.meals)
        .catch(error => {
            console.error(`Error al obtener recetas de la categoría ${category}:`, error);
            return []; // Devuelve un array vacío si hay un error
        });
}

// Llamar a la API para múltiples categorías y combinarlas
Promise.all([
    fetchRecipesByCategory('Chicken'),
    fetchRecipesByCategory('Beef'),
    fetchRecipesByCategory('Seafood'),
    fetchRecipesByCategory('Vegetarian'),
    fetchRecipesByCategory('Pasta')
])
    .then(allRecipes => {
        const combinedRecipes = [].concat(...allRecipes); // Combina todas las recetas
        const randomRecipes = getRandomRecipes(combinedRecipes, 10); // Obtener 10 recetas aleatorias
        displayRandomRecipes(randomRecipes);
    })
    .catch(error => console.error('Error al combinar recetas:', error));

// Función para seleccionar aleatoriamente 10 recetas
function getRandomRecipes(recipes, num) {
    // Asegurarse de que haya al menos 'num' recetas antes de intentar seleccionarlas
    if (recipes.length <= num) {
        return recipes; // Si hay menos de 'num' recetas, mostrar todas
    }
    return recipes.sort(() => 0.5 - Math.random()).slice(0, num);
}

// Función para mostrar las recetas aleatorias en el carrusel
function displayRandomRecipes(recipes) {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ''; // Limpiar el carrusel antes de añadir nuevas recetas

    if (recipes.length === 0) {
        carousel.innerHTML = '<p>No se encontraron recetas.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="recipe-card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
            </div>
        `;
        carousel.innerHTML += recipeCard;
    });

    // Configurar el carrusel
    const slides = document.querySelectorAll('.recipe-card');
    updateCarousel(slides);

    document.getElementById('next').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel(slides);
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel(slides);
    });
}

// Función para actualizar la posición del carrusel
function updateCarousel(slides) {
    const carousel = document.getElementById('carousel');
    const slideWidth = slides[0].offsetWidth;
    carousel.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
}
