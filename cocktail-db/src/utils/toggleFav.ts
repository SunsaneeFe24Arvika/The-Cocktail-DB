import { Cocktail } from "../interfaces/cocktail.js";

const FAVORITES_KEY = 'favoriteDrinks';

// Hämta alla favoriter från localStorage
export const getFavorites = (): Cocktail[] => {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
};

// Spara favoriter till localStorage
const saveFavorites = (favorites: Cocktail[]): void => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }
};

// Kolla om en drink är favoritmarkerad
export const isFavorite = (cocktailId: string): boolean => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.idDrink === cocktailId);
};

// Lägg till en drink som favorit
export const addFavorite = (cocktail: Cocktail): void => {
    const favorites = getFavorites();
    
    // Kolla om den redan finns
    if (!isFavorite(cocktail.idDrink)) {
        favorites.push(cocktail);
        saveFavorites(favorites);
        console.log(`${cocktail.strDrink} tillagd som favorit!`);
    }
};

// Ta bort en drink från favoriter
export const removeFavorite = (cocktailId: string): void => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.idDrink !== cocktailId);
    saveFavorites(updatedFavorites);
    console.log('Favorit borttagen!');
};

// Toggle favorit (lägg till eller ta bort)
export const toggleFavorite = (cocktail: Cocktail): boolean => {
    if (isFavorite(cocktail.idDrink)) {
        removeFavorite(cocktail.idDrink);
        return false; // Inte längre favorit
    } else {
        addFavorite(cocktail);
        return true; // Nu favorit
    }
};

// Uppdatera hjärtikonen baserat på favoritstatus
export const updateFavoriteButton = (button: HTMLButtonElement, cocktailId: string): void => {
    const heartIcon = button.querySelector('.heart__icon') as HTMLImageElement;
    
    if (isFavorite(cocktailId)) {
        button.classList.add('is-favorite');
        if (heartIcon) {
            heartIcon.style.filter = 'invert(55%) sepia(59%) saturate(1265%) hue-rotate(336deg) brightness(92%) contrast(87%)';
        }
    } else {
        button.classList.remove('is-favorite');
        if (heartIcon) {
            heartIcon.style.filter = 'none';
        }
    }
};