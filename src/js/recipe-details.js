document.addEventListener("DOMContentLoaded", function () {
    const recipeId = new URLSearchParams(window.location.search).get("id");

    if (recipeId) {
        // Llamada a la API para obtener los detalles de la receta por ID
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
            .then(response => response.json())
            .then(data => {
                const recipe = data.meals[0];
                if (recipe) {
                    document.getElementById("recipe-title").textContent = recipe.strMeal;
                    document.getElementById("recipe-image").src = recipe.strMealThumb;
                    document.getElementById("recipe-image").alt = recipe.strMeal;

                    const ingredientsList = document.getElementById("recipe-ingredients");
                    ingredientsList.innerHTML = '';
                    for (let i = 1; i <= 20; i++) {
                        const ingredient = recipe[`strIngredient${i}`];
                        const measure = recipe[`strMeasure${i}`];
                        if (ingredient && ingredient.trim() !== '') {
                            const li = document.createElement("li");
                            li.textContent = `${measure} ${ingredient}`;
                            ingredientsList.appendChild(li);
                        }
                    }

                    document.getElementById("recipe-preparation").textContent = recipe.strInstructions;

                    // Evento para agregar la receta a "Mi lista"
                    document.getElementById("add-to-list-btn").addEventListener("click", function () {
                        addToWishlist(recipe); // Guardar la receta en "Mi lista"
                    });

                    // Cargar comentarios guardados al cargar la página
                    loadComments(recipeId);

                    // Capturar el evento de envío de formulario para agregar un nuevo comentario
                    const commentForm = document.getElementById("comment-form");
                    commentForm.addEventListener("submit", function (e) {
                        e.preventDefault(); // Prevenir la recarga de la página
                        const comment = document.getElementById("comment").value.trim();
                        if (comment) {
                            saveComment(recipeId, comment); // Guardar comentario
                            document.getElementById("comment").value = ''; // Limpiar campo de texto
                        }
                    });
                } else {
                    console.error("Receta no encontrada");
                }
            })
            .catch(error => {
                console.error("Error al cargar los datos de la receta:", error);
            });
    } else {
        console.error("ID de receta no proporcionado en la URL");
    }

    // Función para añadir receta a "Mi lista"
    function addToWishlist(recipe) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const existingRecipe = wishlist.find(r => r.idMeal === recipe.idMeal);

        // Verificar si la receta ya está en la lista
        if (!existingRecipe) {
            wishlist.push(recipe);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateWishlistCount(); // Actualizar el número de recetas en "Mi Lista"
            alert('¡Receta añadida a tu lista!');
        } else {
            alert('Esta receta ya está en tu lista.');
        }
    }

    // Función para actualizar el número en el círculo amarillo del encabezado
    function updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        document.getElementById("wishlist-count").textContent = wishlist.length;
    }

    // Llamar a la función para actualizar el número al cargar la página
    updateWishlistCount();

    // Función para guardar comentario con fecha y hora en localStorage
    function saveComment(recipeId, comment) {
        const date = new Date();
        const commentData = {
            text: comment,
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };

        let comments = JSON.parse(localStorage.getItem(`comments_${recipeId}`)) || [];
        comments.push(commentData);
        localStorage.setItem(`comments_${recipeId}`, JSON.stringify(comments));
        displayComment(commentData); // Mostrar el comentario en la página
    }

    // Función para cargar los comentarios desde localStorage
    function loadComments(recipeId) {
        const comments = JSON.parse(localStorage.getItem(`comments_${recipeId}`)) || [];
        comments.forEach(comment => displayComment(comment));
    }

    // Función para mostrar un comentario en la lista de comentarios
    function displayComment(commentData) {
        const commentsList = document.getElementById("comments-list");
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        // Mostrar el comentario junto con la fecha y hora
        commentDiv.innerHTML = `<strong>Comentario:</strong> ${commentData.text} <br>
                                <small><em>Fecha: ${commentData.date}, Hora: ${commentData.time}</em></small>`;
        commentsList.appendChild(commentDiv);
    }
});
