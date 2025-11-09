// Custom error-klasser för bättre felhantering
export class NetworkError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'NetworkError';
    }
} 

export class ValidationError extends Error {
    constructor(public field: string, message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Funktion för att hantera och visa felmeddelanden
export function errorHandleMessage(error: unknown): string {
    if (error instanceof NetworkError) {
        return `Nätverksfel (${error.status}): ${error.message}`;
    }

    if (error instanceof ValidationError) {
        return `Valideringsfel i fältet "${error.field}": ${error.message}`;
    }

    if (error instanceof Error) {
        return `Fel: ${error.message}`;
    }

    return 'Ett okänt fel uppstod';
}