import { toggleSectionDisplay } from "./utils/toggleDisplay.js";
import { fetchCocktailByLetter, fetchCocktailByName, startRandomCocktailTimer } from "./services/cocktailApi.js";
import { errorHandleMessage } from "./utils/errorHandler.js";
import { toggleFavorite, updateFavoriteButton, getFavorites } from "./utils/toggleFav.js";
const sectionSetup = () => {
    const sectionRefs = document.querySelectorAll('.section');
    sectionRefs.forEach(section => section.classList.add('d-none'));
};
const getIngredients = (cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        if (ingredient && ingredient !== null && ingredient !== '') {
            ingredients.push({
                ingredient: ingredient,
                measure: measure ? measure : ''
            });
        }
    }
    return ingredients;
};
const createCard = (cocktail) => {
    const cardRef = document.createElement('article');
    cardRef.classList.add('cocktail-card');
    const cardTemplate = `
            <div class="card__heading">
            <h2 class="detail__title">${cocktail.strDrink}</h2>
            <button class="favorite-btn">
            <img class="heart__icon" src="./res/heart-icon.svg" alt="Favorite">
            </button>
            </div>
            <img class="cocktail__image" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <aside class="card__details">
            <span><strong>Category:</strong> ${cocktail.strCategory}</span>
            <span><strong>Type:</strong> ${cocktail.strAlcoholic}</span>      
    `;
    cardRef.innerHTML = cardTemplate;
    const favoriteBtn = cardRef.querySelector('.favorite-btn');
    if (favoriteBtn) {
        updateFavoriteButton(favoriteBtn, cocktail.idDrink);
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isFav = toggleFavorite(cocktail);
            updateFavoriteButton(favoriteBtn, cocktail.idDrink);
            const message = isFav ? `${cocktail.strDrink} tillagd som favorit!` : `${cocktail.strDrink} borttagen från favoriter`;
            console.log(message);
        });
    }
    cardRef.addEventListener('click', () => {
        showCocktailDetail(cocktail);
    });
    return cardRef;
};
const renderCocktailList = (cocktail) => {
    const sectionRef = document.querySelector('#randomContainer');
    if (!sectionRef) {
        console.error('#randomContainer not found!');
        return;
    }
    sectionRef.innerHTML = '';
    cocktail.forEach(cocktail => {
        const cardRef = createCard(cocktail);
        sectionRef.appendChild(cardRef);
    });
};
const renderSearchResults = (cocktails) => {
    const resultsContainer = document.querySelector('#searchResults');
    if (!resultsContainer)
        return;
    resultsContainer.innerHTML = '';
    if (cocktails.length === 0) {
        resultsContainer.innerHTML = '<h3>Inga cocktails hittades. Försök igen!</h3>';
        return;
    }
    cocktails.forEach(cocktail => {
        const card = document.createElement('article');
        card.classList.add('cocktail-card');
        card.innerHTML = `
            <div class="card__heading">
            <h2 class="detail__title">${cocktail.strDrink}</h2>
            <button class="favorite-btn">
            <img class="heart__icon" src="./res/heart-icon.svg" alt="Favorite">
            </button>
            </div>
            <img class="cocktail__image" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <aside class="card__details">
            <span><strong>Category:</strong> ${cocktail.strCategory}</span>
            <span><strong>Type:</strong> ${cocktail.strAlcoholic}</span> 
            </aside>        
        `;
        card.addEventListener('click', () => {
            showCocktailDetail(cocktail);
        });
        resultsContainer.appendChild(card);
    });
};
const showCocktailDetail = (cocktail) => {
    toggleSectionDisplay('detail');
    const detailContainer = document.querySelector('#detailSection');
    if (detailContainer) {
        const ingredients = getIngredients(cocktail);
        const ingredientsList = ingredients.map(item => `
            <li class="ingredients__list">
                <span class="ingredient__name">${item.ingredient}</span>
                <span class="measure">${item.measure}</span>
            </li>
        `).join('');
        detailContainer.innerHTML = `
            <div class="card__heading">
            <h2 class="detail__title">${cocktail.strDrink}</h2>
            <button class="favorite-btn">
            <img class="heart__icon" src="./res/heart-icon.svg" alt="Favorite">
            </button>
            </div>
            <img class="cocktail__image" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <aside class="card__details">
            <span><strong>Category:</strong> ${cocktail.strCategory}</span>
            <span><strong>Type:</strong> ${cocktail.strAlcoholic}</span>
            <h3>Ingredienser:</h3>
            <ul>
                ${ingredientsList}
            </ul>
            <h3>Instruktioner:</h3>
            <p>${cocktail.strInstructions}</p>
            </aside>
        `;
        const favoriteBtn = detailContainer.querySelector('.favorite-btn');
        if (favoriteBtn) {
            updateFavoriteButton(favoriteBtn, cocktail.idDrink);
            favoriteBtn.addEventListener('click', () => {
                const isFav = toggleFavorite(cocktail);
                updateFavoriteButton(favoriteBtn, cocktail.idDrink);
                const message = isFav ? `${cocktail.strDrink} tillagd som favorit!` : `${cocktail.strDrink} borttagen från favoriter`;
                console.log(message);
            });
        }
    }
};
const setupSearchButton = () => {
    const searchBtn = document.querySelector('#searchBtn');
    const searchInput = document.querySelector('#searchInput');
    if (!searchBtn || !searchInput) {
        console.error('Search button eller searchInput hittades inte!');
        return;
    }
    searchBtn.addEventListener('click', async () => {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) {
            alert('Vänligen ange ett sökord!');
            return;
        }
        try {
            searchBtn.textContent = 'Loading...';
            searchBtn.disabled = true;
            let cocktails;
            if (searchTerm.length === 1) {
                console.log(`Söker på första bokstaven: ${searchTerm}`);
                cocktails = await fetchCocktailByLetter(searchTerm);
            }
            else {
                console.log(`Söker på namn: ${searchTerm}`);
                cocktails = await fetchCocktailByName(searchTerm);
            }
            toggleSectionDisplay('search');
            renderSearchResults(cocktails);
        }
        catch (error) {
            alert(errorHandleMessage(error));
        }
        finally {
            searchBtn.textContent = 'Search';
            searchBtn.disabled = false;
        }
    });
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchBtn.click();
        }
    });
};
const showMyFavoriteDrinks = () => {
    console.log('showMyFavoriteDrinks körs...');
    toggleSectionDisplay('favorite');
    const favSectionRef = document.querySelector('#favoriteSection');
    if (!favSectionRef) {
        console.error('#favoriteSection hittades inte!');
        return;
    }
    const favorites = getFavorites();
    console.log('Antal favoriter:', favorites.length);
    console.log('Favoriter:', favorites);
    favSectionRef.innerHTML = '<h1 class="page-title favorite__title">Your favorite drinks...</h1>';
    if (favorites.length === 0) {
        favSectionRef.innerHTML += '<h3>Inga favoriter än. Lägg till några cocktails!</h3>';
        return;
    }
    favorites.forEach(cocktail => {
        const cardRef = createCard(cocktail);
        favSectionRef.appendChild(cardRef);
    });
};
document.addEventListener('DOMContentLoaded', () => {
    sectionSetup();
    const favoritesBtn = document.querySelector('#favoriteBtn');
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', () => {
            showMyFavoriteDrinks();
            toggleSectionDisplay('favorite');
        });
    }
    toggleSectionDisplay('random');
    setupSearchButton();
    startRandomCocktailTimer(renderCocktailList);
    console.log('Cocktail DB app started!');
});
//# sourceMappingURL=index.js.map