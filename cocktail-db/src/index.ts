import { Cocktail } from "./interfaces/cocktail.js";
import { toggleSectionDisplay } from "./utils/toggleDisplay.js";
import { fetchCocktailByName, startRandomCocktailTimer } from "./services/cocktailApi.js";
import { errorHandleMessage } from "./utils/errorHandler.js";
import { toggleFavorite, updateFavoriteButton, getFavorites } from "./utils/toggleFav.js";

// Setup sections -dölj alla sektioner först
const sectionSetup = (): void => {
    const sectionRefs = document.querySelectorAll<HTMLElement>('.section');
    sectionRefs.forEach(section => section.classList.add('d-none'));
}

// Skapa cocktail card
const createCard = (cocktail: Cocktail): HTMLElement => {
    const cardRef: HTMLElement = document.createElement('article');
    cardRef.classList.add('cocktail-card');

    const cardTemplate = `
        <h1 class="page-title">${cocktail.strDrink}</h1>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
        <span><strong>Category</strong> ${cocktail.strCategory}</span>
        <span><strong>Type:</strong> ${cocktail.strAlcoholic}</span>
        <p>${cocktail.strInstructions}</p>
    `;
    cardRef.innerHTML = cardTemplate;

    // Lägg till klick-event för att visa detaljer
    cardRef.addEventListener('click', () => {
        showCocktailDetail(cocktail);
    });

    return cardRef;
}

// Render cocktail list i random section
const renderCocktailList = (cocktail: Cocktail[]): void => {
    const sectionRef = document.querySelector('#randomContainer') as HTMLElement;

    if (!sectionRef) {
        console.error('#randomContainer not found!');
        return;    
    }

    // Rensa tidigare innehåll
    sectionRef.innerHTML = '';

    cocktail.forEach(cocktail => {
        const cardRef: HTMLElement = createCard(cocktail);
        sectionRef.appendChild(cardRef);
    });
}

// Funktion som renerar sökresultat
const renderSearchResults = (cocktails: Cocktail[]): void => {
    const resultsContainer = document. querySelector('#searchResults') as HTMLElement;

    if (!resultsContainer) return;

    // Rensa tidigare resultat
    resultsContainer.innerHTML = '';

    if (cocktails.length === 0) {
        resultsContainer.innerHTML = '<h3>Inga cocktails hittades. Försök igen!</h3>';
        return;
    }

    // Skapa kort för varje cocktail
    cocktails.forEach(cocktail => {
        const card = document.createElement('article');
        card.classList.add('cocktail-card');
        card.innerHTML = `
            <h2>${cocktail.strDrink}</h2>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <span><strong>Category</strong> ${cocktail.strCategory}</span>
            <span><strong>Type:</strong> ${cocktail.strAlcoholic}</span>
            <p>${cocktail.strInstructions}</p>
        `;

        // Lägg till klick-event för att visa detaljer
        card.addEventListener('click', () => {
            showCocktailDetail(cocktail);
        });

        resultsContainer.appendChild(card);
    });
}

// Funktion för att visa cocktail-detaljer
const showCocktailDetail = (cocktail: Cocktail): void => {
    toggleSectionDisplay('detail');

    const detailContainer = document.querySelector('#detailSection') as HTMLElement;
    if (detailContainer) {
        detailContainer.innerHTML = `
            <div class="card__heading">
            <h1 class="page-title detail__title">${cocktail.strDrink}</h1>
            <button class="favorite-btn">
            <img class="heart__icon" src="./res/heart-icon.svg" alt="Favorite">
            </button>
            </div>
            <img class="cocktail__image" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <span><strong>Category</strong> ${cocktail.strCategory}</span>
            <span><strong>Type:</strong> ${cocktail.strAlcoholic}</span>
            <p>${cocktail.strInstructions}</p>
        `;

        // Setup favorite button
        const favoriteBtn = detailContainer.querySelector('.favorite-btn') as HTMLButtonElement;
        if (favoriteBtn) {
            // Uppdatera knappen baserat på om drinken redan är favorit
            updateFavoriteButton(favoriteBtn, cocktail.idDrink);

            // Lägg till click event
            favoriteBtn.addEventListener('click', () => {
                const isFav = toggleFavorite(cocktail);
                updateFavoriteButton(favoriteBtn, cocktail.idDrink);
                
                // Visa feedback till användaren
                const message = isFav ? `${cocktail.strDrink} tillagd som favorit!` : `${cocktail.strDrink} borttagen från favoriter`;
                console.log(message);
                // Du kan lägga till en toast/notification här om du vill
            });
        }
    }
}

// Setup Search-button event listener
const setupSearchButton = (): void => {
    const searchBtn = document.querySelector('#searchBtn') as HTMLButtonElement;
    const searchInput = document.querySelector('#searchInput') as HTMLInputElement;

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

            // Hämta cocktails från API
            const cocktails = await fetchCocktailByName(searchTerm);

            // Toggla till list-sidan och visa resultat
            toggleSectionDisplay('search');
            renderSearchResults(cocktails);

        } catch (error) {
            alert(errorHandleMessage(error));

        } finally {
            // Återställ button
            searchBtn.textContent = 'Search';
            searchBtn.disabled = false;
        }
    });

    // Enter-tangent support
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchBtn.click();
        }


    });
}

// Funktion för att visa favorit drinken
const showMyFavoriteDrinks = (): void => {
    console.log('showMyFavoriteDrinks körs...');
    toggleSectionDisplay('favorite');

    const favSectionRef = document.querySelector('#favoriteSection') as HTMLElement;

    if (!favSectionRef) {
        console.error('#favoriteSection hittades inte!');
        return;    
    }

    // Hämta alla favoriter från localStorage
    const favorites = getFavorites();
    console.log('Antal favoriter:', favorites.length);
    console.log('Favoriter:', favorites);

    // Rensa tidigare innehåll
    favSectionRef.innerHTML = '';

    // Kolla om det finns favoriter
    if (favorites.length === 0) {
        favSectionRef.innerHTML = '<h3 class="page-title">Inga favoriter än. Lägg till några cocktails!</h3>';
        return;
    }

    // Skapa kort för varje favoritdrink
    favorites.forEach(cocktail => {
        const cardRef: HTMLElement = createCard(cocktail);
        favSectionRef.appendChild(cardRef);
    });
}


// Initiera appen när DOM är laddad
document.addEventListener('DOMContentLoaded', () => {
    // Setup section
    sectionSetup();

    const favoritesBtn = document.querySelector('#favoriteBtn');
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', () => {
            showMyFavoriteDrinks();
            toggleSectionDisplay('favorite');
        });
    }

    // Visa random-sektionen som standard
    toggleSectionDisplay('random');

    // Setup search button
    setupSearchButton();

    // Start random timer
    startRandomCocktailTimer(renderCocktailList);

    console.log('Cocktail DB app started!');
    
})