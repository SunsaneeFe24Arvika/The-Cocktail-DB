import { errorHandleMessage } from "../utils/errorHandler.js";
export const fetchCocktailByLetter = async (letter) => {
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.drinks) {
            return [];
        }
        return data.drinks;
    }
    catch (error) {
        console.error(errorHandleMessage(error));
        throw error;
    }
};
export const fetchCocktailByName = async (name) => {
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.drinks) {
            return [];
        }
        return data.drinks;
    }
    catch (error) {
        console.error(errorHandleMessage(error));
        throw error;
    }
};
export const fetchRandomCocktail = async () => {
    try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.drinks) {
            return [];
        }
        return data.drinks;
    }
    catch (error) {
        console.error(errorHandleMessage(error));
        throw error;
    }
};
export const randomSetup = async () => {
    const numberOfDrinks = 3;
    const cocktailsPromises = [];
    for (let i = 0; i < numberOfDrinks; i++) {
        cocktailsPromises.push(fetchRandomCocktail());
    }
    const cocktailArrays = await Promise.all(cocktailsPromises);
    const cocktailList = cocktailArrays.flat();
    return cocktailList;
};
export const startRandomCocktailTimer = (renderCallback) => {
    randomSetup().then(renderCallback);
    const intervalId = setInterval(async () => {
        const cocktails = await randomSetup();
        renderCallback(cocktails);
    }, 3000);
    return intervalId;
};
//# sourceMappingURL=cocktailApi.js.map