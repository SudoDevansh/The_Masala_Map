
var searchInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");
var recipeContainer = document.getElementById("recipe-container");
var filterBtns = document.querySelectorAll(".filter-btn");

var allMeals = [];    
var activeFilter = "All";


window.onload = function () {
    loadAllMeals();
};


function loadAllMeals() {
    showLoader();

    var letters = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
    var requests = letters.map(function (letter) {
        return fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=" + letter)
            .then(function (res) { return res.json(); })
            .then(function (data) { return data.meals || []; })
            .catch(function () { return []; });
    });

    Promise.all(requests).then(function (results) {

        var seen = {};
        var meals = [];
        results.forEach(function (group) {
            group.forEach(function (meal) {
                if (!seen[meal.idMeal]) {
                    seen[meal.idMeal] = true;
                    meals.push(meal);
                }
            });
        });

        allMeals = meals;
        renderCards(allMeals, "");
    });
}


searchBtn.addEventListener("click", function () {
    var query = searchInput.value.trim();
    sortAndRender(query);
});




searchInput.addEventListener("input", function () {
    var query = searchInput.value.trim();
    sortAndRender(query);
});


filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
            b.classList.remove("active");
        });
        btn.classList.add("active");
        activeFilter = btn.textContent.trim();
        var query = searchInput.value.trim();
        sortAndRender(query);
    });
});

function sortAndRender(query) {
    // First apply category filter
    var filtered = allMeals;
    if (activeFilter === "Vegetarian") {
        filtered = allMeals.filter(function (m) {
            return m.strCategory === "Vegetarian";
        });
    } else if (activeFilter === "Non-Veg") {
        filtered = allMeals.filter(function (m) {
            return m.strCategory !== "Vegetarian";
        });
    }

    if (!query) {
        renderCards(filtered, "");
        return;
    }

    var q = query.toLowerCase();

    var matched = [];
    var unmatched = [];

    filtered.forEach(function (meal) {
        var name = meal.strMeal.toLowerCase();
        var category = (meal.strCategory || "").toLowerCase();
        var area = (meal.strArea || "").toLowerCase();

        if (name.indexOf(q) !== -1 || category.indexOf(q) !== -1 || area.indexOf(q) !== -1) {
            matched.push(meal);
        } else {
            unmatched.push(meal);
        }
    });

    var sorted = matched.concat(unmatched);
    renderCards(sorted, query);
}


function renderCards(meals, query) {
    if (!meals || meals.length === 0) {
        showEmpty();
        return;
    }

    recipeContainer.classList.remove("single-result");

    var q = query ? query.toLowerCase() : "";

    var html = "";
    for (var i = 0; i < meals.length; i++) {
        var meal = meals[i];
        var name = meal.strMeal.toLowerCase();
        var category = (meal.strCategory || "").toLowerCase();
        var area = (meal.strArea || "").toLowerCase();

        var isMatch = q && (
            name.indexOf(q) !== -1 ||
            category.indexOf(q) !== -1 ||
            area.indexOf(q) !== -1
        );

        html += '<div class="card' + (isMatch ? " matched" : "") + '" data-id="' + meal.idMeal + '">' +
            '<div class="card-img-wrap">' +
                '<img src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '" loading="lazy">' +
                '<span class="card-badge">' + meal.strCategory + '</span>' +
                (isMatch ? '<span class="match-label">&#10003; Match</span>' : '') +
            '</div>' +
            '<div class="card-body">' +
                '<h3 class="card-title">' + meal.strMeal + '</h3>' +
                '<p class="card-desc">' + meal.strArea + ' cuisine</p>' +
            '</div>' +
        '</div>';
    }

    recipeContainer.innerHTML = html;



    var cards = recipeContainer.querySelectorAll(".card");
    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            var id = card.getAttribute("data-id");
            window.location.href = "../recipe/recipe.html?id=" + id;
        });
    });
}

function showLoader() {
    recipeContainer.innerHTML =
        '<div class="loader-wrap">' +
            '<div class="spinner"></div>' +
            '<p>Loading all recipes...</p>' +
        '</div>';
}


function showEmpty() {
    recipeContainer.innerHTML = '<p class="error-msg">No recipes found. Try a different search!</p>';
    if (resultCountEl) resultCountEl.textContent = "";
}
