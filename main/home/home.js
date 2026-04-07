async function fetchRecipes(searchQuery) {
    try{

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
        const data = await response.json();
        const recipes = data.meals;
        console.log("Here is your fetched data:", recipes);
    }
    catch(error){
        console.error("Not able to fetch data!",error);
    }
}
fetchRecipes("Potato");