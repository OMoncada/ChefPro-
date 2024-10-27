document.addEventListener("DOMContentLoaded", function () {
    const wishlistContainer = document.getElementById("wishlist-container");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlistContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar las recetas

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>You have not added any recipes to your list.</p>';
    } else {
        wishlist.forEach((recipe, index) => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            recipeCard.innerHTML = `
                <div class="recipe-image">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                </div>
                <div class="recipe-info">
                    <h3>${recipe.strMeal}</h3>
                    <button class="print-btn" onclick="printRecipe('${recipe.idMeal}')">Print</button>
                </div>
                <button class="delete-btn" onclick="deleteRecipe(${index})">X</button>
            `;

            wishlistContainer.appendChild(recipeCard);
        });
    }

    // Actualizar el número de recetas en "Mi Lista"
    updateWishlistCount();

    // Función para imprimir una receta
    window.printRecipe = function (idMeal) {
        const recipe = wishlist.find(r => r.idMeal === idMeal);
        if (recipe) {
            const printWindow = window.open('', '', 'width=800,height=600');
            printWindow.document.write(`<h1>${recipe.strMeal}</h1>`);
            printWindow.document.write(`<img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">`);
            printWindow.document.write(`<p>${recipe.strInstructions}</p>`);
            printWindow.document.close();
            printWindow.print();
        }
    };

    // Función para eliminar una receta de la lista con animación de desvanecimiento
    window.deleteRecipe = function (index) {
        const recipeCard = document.querySelectorAll(".recipe-card")[index];

        // Agregar la clase de desvanecimiento
        recipeCard.classList.add("fade-out");

        // Esperar el final de la animación antes de eliminar el elemento
        setTimeout(() => {
            wishlist.splice(index, 1); // Eliminar receta de la lista
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateWishlistCount(); // Actualizar el contador después de eliminar
            renderWishlist(); // Volver a renderizar la lista después de eliminar
        }, 500); // 500ms coincide con la duración de la animación CSS
    };

    // Función para volver a renderizar la lista después de eliminar una receta
    function renderWishlist() {
        wishlistContainer.innerHTML = '';
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p>You have not added any recipes to your list.</p>';
        } else {
            wishlist.forEach((recipe, index) => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");

                recipeCard.innerHTML = `
                    <div class="recipe-image">
                        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    </div>
                    <div class="recipe-info">
                        <h3>${recipe.strMeal}</h3>
                        <button class="print-btn" onclick="printRecipe('${recipe.idMeal}')">Print</button>
                    </div>
                    <button class="delete-btn" onclick="deleteRecipe(${index})">X</button>
                `;

                wishlistContainer.appendChild(recipeCard);
            });
        }
    }

    // Función para actualizar el contador de "Mi Lista" en el encabezado
    function updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const wishlistCountElement = document.getElementById("wishlist-count");
        wishlistCountElement.textContent = wishlist.length; // Mostrar el número sin paréntesis
    }
});

// Selección de elementos del DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

// Alternar el menú desplegable al hacer clic en el botón de hamburguesa
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    hamburger.classList.toggle('active');
});
