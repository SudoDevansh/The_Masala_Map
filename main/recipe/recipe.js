const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get("id");

const loader = document.getElementById("loader");
const errorState = document.getElementById("error-state");
const recipePage = document.getElementById("recipe-page");

if (!mealId) {
    showError();
} else {
    loadRecipe(mealId);
}

function loadRecipe(id) {
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (!data.meals || data.meals.length === 0) {
                showError();
                return;
            }
            renderRecipe(data.meals[0]);
        })
        .catch(function() {
            showError();
        });
}

function renderRecipe(meal) {
    document.title = meal.strMeal;

    document.getElementById("hero-img").src = meal.strMealThumb;
    document.getElementById("hero-img").alt = meal.strMeal;
    document.getElementById("meal-name").textContent = meal.strMeal;
    document.getElementById("meta-info").textContent = meal.strCategory + " | " + meal.strArea;

    const youtubeId = getYouTubeId(meal.strYoutube);
    if (youtubeId) {
        document.getElementById("recipe-video").src = "https://www.youtube.com/embed/" + youtubeId;
        document.getElementById("video-section").style.display = "block";
    }

    const ingList = document.getElementById("ingredients-list");
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal["strIngredient" + i];
        const measure = meal["strMeasure" + i];
        if (ingredient && ingredient.trim() !== "") {
            const li = document.createElement("li");
            li.textContent = ingredient.trim() + " - " + (measure ? measure.trim() : "");
            ingList.appendChild(li);
        }
    }

    const instrDiv = document.getElementById("instructions");
    const lines = meal.strInstructions.split(/\r\n|\n/);
    for (let j = 0; j < lines.length; j++) {
        if (lines[j].trim() !== "") {
            const p = document.createElement("p");
            p.textContent = lines[j].trim();
            instrDiv.appendChild(p);
        }
    }

    loader.style.display = "none";
    recipePage.style.display = "block";
}

function getYouTubeId(url) {
    if (!url) {
        return null;
    }
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) {
        return match[1];
    }
    return null;
}

function showError() {
    loader.style.display = "none";
    errorState.style.display = "block";
}
