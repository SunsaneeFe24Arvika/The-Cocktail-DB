import { toggleSectionDisplay } from "./utils/toggleDisplay";
import { fetchCocktailByName, startRandomCocktailTimer } from "./services/cocktailApi";
import { errorHandleMessage } from "./utils/errorHandler";
const sectionSetup = () => {
    const sectionRefs = document.querySelectorAll('.section');
    sectionRefs.forEach(section => section.classList.add('d-none'));
};
const createCard = (cocktail) => {
    const cardRef = document.createElement('article');
    cardRef.classList.add('cocktail-card');
    const cardTemplate = `
        <h2>${cocktail.strDrink}</h2>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
        <p><strong>Category</strong> ${cocktail.strCategory}</p>
    `;
    cardRef.innerHTML = cardTemplate;
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
            <h2>${cocktail.strDrink}</h2>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <p><strong>Category:</strong> ${cocktail.strCategory}</p>
            <p><strong>Type:</strong> ${cocktail.strAlcoholic}</p>
            <p>${cocktail.strInstructions}</p>
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
        detailContainer.innerHTML = `
            <h2>${cocktail.strDrink}</h2>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <p><strong>Category:</strong> ${cocktail.strCategory}</p>
            <p><strong>Type:</strong> ${cocktail.strAlcoholic}</p>
            <p>${cocktail.strInstructions}</p>
        `;
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
            const cocktails = await fetchCocktailByName(searchTerm);
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
            searchBtn.click();
        }
    });
};
document.addEventListener('DOMContentLoaded', () => {
    sectionSetup();
    toggleSectionDisplay('random');
    setupSearchButton();
    startRandomCocktailTimer(renderCocktailList);
    console.log('Cocktail DB app started!');
});
//# sourceMappingURL=index.js.map