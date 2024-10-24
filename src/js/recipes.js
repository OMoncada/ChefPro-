// Obtener la categoría seleccionada de la URL
const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

// Guardaremos las áreas disponibles para la categoría seleccionada
let availableAreas = new Set();

// Cargar las recetas iniciales por categoría
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        const recipes = data.meals;
        createCarousel(recipes); // Crear el carrusel con las recetas iniciales
        fetchAvailableAreas(recipes); // Filtrar las áreas que pertenecen a la categoría seleccionada
    })
    .catch(error => console.error('Error al cargar las recetas:', error));

// Función para obtener las áreas de las recetas de la categoría seleccionada
function fetchAvailableAreas(recipes) {
    const areaSet = new Set(); // Set para evitar duplicados

    // Recorremos cada receta y obtenemos sus detalles para capturar el área
    const promises = recipes.map(recipe => {
        const recipeDetailURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`;

        return fetch(recipeDetailURL)
            .then(response => response.json())
            .then(data => {
                const area = data.meals[0].strArea;
                areaSet.add(area); // Añadir área al Set
            });
    });

    // Una vez que todas las recetas han sido procesadas, actualizamos el filtro de áreas
    Promise.all(promises).then(() => {
        updateAreaFilter(areaSet); // Actualizar el filtro con las áreas obtenidas
    });
}

// Actualizar el filtro de áreas con solo las áreas disponibles en la categoría seleccionada
function updateAreaFilter(areaSet) {
    const areaSelect = document.getElementById('area');
    areaSelect.innerHTML = ''; // Limpiar cualquier opción anterior

    // Añadir las áreas filtradas al filtro
    areaSet.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
    });

    availableAreas = [...areaSet]; // Guardar las áreas disponibles
}

// Escuchar el evento de búsqueda cuando el usuario haga clic en el botón de filtro
document.getElementById('filter-btn').addEventListener('click', function () {
    const sortOption = document.getElementById('sort').value;
    const selectedArea = document.getElementById('area').value;

    if (selectedArea) {
        filterByArea(selectedArea, sortOption);
    } else {
        // Si no hay un área seleccionada, cargar todas las recetas de la categoría
        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                let recipes = data.meals;
                recipes = sortRecipes(recipes, sortOption);  // Ordenar si es necesario
                createCarousel(recipes); // Mostrar las recetas de la categoría
            })
            .catch(error => console.error('Error al recargar las recetas:', error));
    }
});

// Función para filtrar recetas por área
function filterByArea(area, sortOption) {
    const areaSearchURL = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;

    fetch(areaSearchURL)
        .then(response => response.json())
        .then(data => {
            let recipes = data.meals;

            if (!recipes || recipes.length === 0) {
                // Si no hay recetas para el área seleccionada, mostrar un mensaje
                showNoResultsMessage(area);
            } else {
                // Verificar si las recetas pertenecen a la categoría seleccionada
                recipes = recipes.filter(recipe => {
                    return recipeMatchesCategory(recipe);
                });

                if (recipes.length > 0) {
                    recipes = sortRecipes(recipes, sortOption);  // Ordenar las recetas
                    createCarousel(recipes); // Mostrar las recetas filtradas
                } else {
                    // Si no hay coincidencias entre el área y la categoría
                    showNoResultsMessage(area);
                }
            }
        })
        .catch(error => console.error('Error al filtrar por área:', error));
}

// Función para verificar si una receta pertenece a la categoría seleccionada
function recipeMatchesCategory(recipe) {
    const recipeDetailURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`;
    return fetch(recipeDetailURL)
        .then(response => response.json())
        .then(data => {
            return data.meals[0].strCategory === category;
        })
        .catch(error => {
            console.error('Error al verificar la categoría de la receta:', error);
            return false;
        });
}

// Función para mostrar un mensaje cuando no haya resultados
function showNoResultsMessage(area) {
    const recipeGrid = document.querySelector('.recipe-grid');
    recipeGrid.innerHTML = `<p>No se encontraron recetas para el área "${area}" en la categoría seleccionada.</p>`;
}

// Función para ordenar las recetas por nombre
function sortRecipes(recipes, sortOption) {
    return recipes.sort((a, b) => {
        if (sortOption === 'asc') {
            return a.strMeal.localeCompare(b.strMeal);
        } else if (sortOption === 'desc') {
            return b.strMeal.localeCompare(a.strMeal);
        }
        return 0;
    });
}

// Función para crear el carrusel con las recetas
function createCarousel(recipes) {
    const recipeGrid = document.querySelector('.recipe-grid');
    recipeGrid.innerHTML = ''; // Limpiar el contenido actual antes de cargar nuevas recetas

    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('carousel-wrapper');

    const carousel = document.createElement('div');
    carousel.classList.add('carousel');

    // Crear un "slide" para cada receta
    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="recipe-container">
                <div class="recipe-card">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <h3>${recipe.strMeal}</h3>
                    <a href="recipe-details.html?id=${recipe.idMeal}">Ver receta</a>
                </div>
            </div>
        `;
        carousel.innerHTML += recipeCard;
    });

    // Añadir el carrusel al envoltorio
    carouselWrapper.appendChild(carousel);
    recipeGrid.appendChild(carouselWrapper);

    // Agregar los botones de navegación debajo del carrusel
    addCarouselButtons(carouselWrapper, carousel, recipes.length);
}

// Función para agregar los botones de navegación debajo del carrusel
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

        const maxIndex = Math.ceil(totalItems / itemsToShow) - 1;
        if (currentIndex >= maxIndex) {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }

        if (currentIndex <= 0) {
            prevButton.disabled = true;
        } else {
            prevButton.disabled = false;
        }
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        const maxIndex = Math.ceil(totalItems / itemsToShow) - 1;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    updateCarousel();
}

// Función para limpiar los filtros y restaurar el estado inicial
document.querySelector('.filters a').addEventListener('click', function (event) {
    event.preventDefault(); // Evitar que el enlace se comporte como un link

    // Restablecer los selectores de filtro
    document.getElementById('sort').value = 'asc'; // Restablecer el orden por defecto (A-Z)
    document.getElementById('area').selectedIndex = 0; // Restablecer el área al valor por defecto

    // Recargar las recetas originales de la categoría
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const recipes = data.meals;
            createCarousel(recipes); // Volver a mostrar todas las recetas
        })
        .catch(error => console.error('Error al recargar las recetas:', error));
});
