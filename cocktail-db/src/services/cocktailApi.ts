import { Cocktail, CocktailResponse } from "../interfaces/cocktail.js";
import { errorHandleMessage } from "../utils/errorHandler.js";

// Fetch all cocktails by first letter
export const fetchCocktailByLetter = async (letter: string): Promise<Cocktail[]> => {
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CocktailResponse = await response.json();

        // API returnerar null om inga cocktails hittades
        if (!data.drinks) {
            return [];
        }

        return data.drinks;

    } catch (error) {
        console.error(errorHandleMessage(error));
        throw error;       
    }
}

// Fetch cocktail by name
export const fetchCocktailByName = async (name: string): Promise<Cocktail[]> => {
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CocktailResponse = await response.json();
        if (!data.drinks) {
            return [];
        }
        return data.drinks;

    } catch (error) {
        console.error(errorHandleMessage(error));
        throw error;
        
    }
}

// Fetch random cocktail
export const fetchRandomCocktail = async (): Promise<Cocktail[]> => {
    try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CocktailResponse = await response.json();
        if (!data.drinks) {
            return [];
        }
        return data.drinks;

    } catch (error) {
        console.error(errorHandleMessage(error));
        throw error;       
    }
}

// Random setup function
export const randomSetup = async (): Promise<Cocktail[]> => {
    // Hämta flera random cocktails
    const numberOfDrinks= 1;
    const cocktailsPromises: Promise<Cocktail[]>[] = [];

    for (let i = 0; i < numberOfDrinks; i++) {
        cocktailsPromises.push(fetchRandomCocktail());
    }

    // Vänta på alla promises och platta ut Arrayen
    const cocktailArrays = await Promise.all(cocktailsPromises);
    const cocktailList = cocktailArrays.flat();

    return cocktailList;
}

// Cocktail random timer
export const startRandomCocktailTimer = (renderCallback: (cocktails: Cocktail[]) => void): number => {
    // Kör första gång direkt
    randomSetup().then(renderCallback);

    // Sätt timer
    const intervalId = setInterval(async () => {
        const cocktails = await randomSetup();
        renderCallback(cocktails);
    }, 3000);

    return intervalId;
}