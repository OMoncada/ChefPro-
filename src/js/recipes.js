// Obtener la categoría seleccionada de la URL
const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
const searchAPIURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

let availableAreas = new Set();
let debounceTimer;

// Función para cargar todas las recetas de la categoría seleccionada
function loadCategoryRecipes() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const recipes = data.meals;
            createCarousel(recipes); // Crear el carrusel con las recetas iniciales
            fetchAvailableAreas(recipes); // Filtrar las áreas que pertenecen a la categoría seleccionada
        })
        .catch(error => console.error('Error loading recipes:', error));
}

// Cargar las recetas iniciales
loadCategoryRecipes();

// Función para obtener las áreas de las recetas de la categoría seleccionada
function fetchAvailableAreas(recipes) {
    const areaSet = new Set();

    const promises = recipes.map(recipe => {
        const recipeDetailURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`;
        return fetch(recipeDetailURL)
            .then(response => response.json())
            .then(data => {
                const area = data.meals[0].strArea;
                areaSet.add(area);
            });
    });

    Promise.all(promises).then(() => {
        updateAreaFilter(areaSet);
    });
}

// Actualizar el filtro de áreas
function updateAreaFilter(areaSet) {
    const areaSelect = document.getElementById('area');
    areaSelect.innerHTML = '';

    areaSet.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
    });

    availableAreas = [...areaSet];
}

// Escuchar el evento de búsqueda de filtro
document.getElementById('filter-btn').addEventListener('click', function () {
    const sortOption = document.getElementById('sort').value;
    const selectedArea = document.getElementById('area').value;

    if (selectedArea) {
        filterByArea(selectedArea, sortOption);
    } else {
        loadCategoryRecipes(); // Recargar todas las recetas de la categoría
    }
});

// Función para filtrar recetas por área
function filterByArea(area, sortOption) {
    const areaSearchURL = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;

    fetch(areaSearchURL)
        .then(response => response.json())
        .then(data => {
            let recipes = data.meals || [];
            recipes = recipes.filter(recipe => recipeMatchesCategory(recipe));
            recipes = sortRecipes(recipes, sortOption);
            createCarousel(recipes.length > 0 ? recipes : null, area);
        })
        .catch(error => console.error('Error when filtering by area:', error));
}

// Función para verificar si una receta pertenece a la categoría seleccionada
function recipeMatchesCategory(recipe) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`)
        .then(response => response.json())
        .then(data => data.meals[0].strCategory === category)
        .catch(() => false);
}

// Mostrar mensaje si no hay resultados
function showNoResultsMessage(area) {
    document.querySelector('.recipe-grid').innerHTML = `<p>No recipes found for the area "${area}" in the selected category.</p>`;
}

// Ordenar recetas
function sortRecipes(recipes, sortOption) {
    return recipes.sort((a, b) => sortOption === 'asc' ? a.strMeal.localeCompare(b.strMeal) : b.strMeal.localeCompare(a.strMeal));
}

// Crear el carrusel con las recetas
function createCarousel(recipes, area) {
    const recipeGrid = document.querySelector('.recipe-grid');
    recipeGrid.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        showNoResultsMessage(area || '');
        return;
    }

    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('carousel-wrapper');
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');

    recipes.forEach(recipe => {
        carousel.innerHTML += `
            <div class="recipe-container">
                <div class="recipe-card">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <h3>${recipe.strMeal}</h3>
                    <a href="recipe-details.html?id=${recipe.idMeal}">See recipe</a>
                </div>
            </div>
        `;
    });

    carouselWrapper.appendChild(carousel);
    recipeGrid.appendChild(carouselWrapper);
    addCarouselButtons(carouselWrapper, carousel, recipes.length);
}

// Agregar botones de navegación al carrusel
function addCarouselButtons(carouselWrapper, carousel, totalItems) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    const prevButton = document.createElement('button');
    prevButton.id = 'prev';
    prevButton.classList.add('carousel-button');
    prevButton.textContent = '‹';
    const nextButton = document.createElement('button');
    nextButton.id = 'next';
    nextButton.classList.add('carousel-button');
    nextButton.textContent = '›';

    buttonContainer.appendChild(prevButton);
    buttonContainer.appendChild(nextButton);
    carouselWrapper.appendChild(buttonContainer);

    let currentIndex = 0;
    const itemsToShow = 2;

    function updateCarousel() {
        const offset = -currentIndex * (100 / itemsToShow);
        carousel.style.transform = `translateX(${offset}%)`;
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= Math.ceil(totalItems / itemsToShow) - 1;
    }

    prevButton.addEventListener('click', () => currentIndex > 0 && (currentIndex--, updateCarousel()));
    nextButton.addEventListener('click', () => currentIndex < Math.ceil(totalItems / itemsToShow) - 1 && (currentIndex++, updateCarousel()));

    updateCarousel();
}

// Funcionalidad de búsqueda con debounce
document.querySelector('.search-bar input').addEventListener('input', function () {
    clearTimeout(debounceTimer);
    const searchTerm = this.value.trim();

    debounceTimer = setTimeout(() => {
        if (searchTerm === '') {
            loadCategoryRecipes();
        } else {
            fetch(`${searchAPIURL}${searchTerm}`)
                .then(response => response.json())
                .then(data => {
                    const filteredRecipes = (data.meals || []).filter(recipe => recipeMatchesCategory(recipe));
                    createCarousel(filteredRecipes.length > 0 ? filteredRecipes : null, searchTerm);
                })
                .catch(error => console.error('Error when searching for recipes:', error));
        }
    }, 300);
});

// Limpiar filtros
document.querySelector('.filters a').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('sort').value = 'asc';
    document.getElementById('area').selectedIndex = 0;
    loadCategoryRecipes();
});
