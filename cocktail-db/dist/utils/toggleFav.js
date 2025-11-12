const FAVORITES_KEY = 'favoriteDrinks';
export const getFavorites = () => {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    }
    catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
};
const saveFavorites = (favorites) => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }
};
export const isFavorite = (cocktailId) => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.idDrink === cocktailId);
};
export const addFavorite = (cocktail) => {
    const favorites = getFavorites();
    if (!isFavorite(cocktail.idDrink)) {
        favorites.push(cocktail);
        saveFavorites(favorites);
        console.log(`${cocktail.strDrink} tillagd som favorit!`);
    }
};
export const removeFavorite = (cocktailId) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.idDrink !== cocktailId);
    saveFavorites(updatedFavorites);
    console.log('Favorit borttagen!');
};
export const toggleFavorite = (cocktail) => {
    if (isFavorite(cocktail.idDrink)) {
        removeFavorite(cocktail.idDrink);
        return false;
    }
    else {
        addFavorite(cocktail);
        return true;
    }
};
export const updateFavoriteButton = (button, cocktailId) => {
    const heartIcon = button.querySelector('.heart__icon');
    if (isFavorite(cocktailId)) {
        button.classList.add('is-favorite');
        if (heartIcon) {
            heartIcon.style.filter = 'invert(55%) sepia(59%) saturate(1265%) hue-rotate(336deg) brightness(92%) contrast(87%)';
        }
    }
    else {
        button.classList.remove('is-favorite');
        if (heartIcon) {
            heartIcon.style.filter = 'none';
        }
    }
};
//# sourceMappingURL=toggleFav.js.map