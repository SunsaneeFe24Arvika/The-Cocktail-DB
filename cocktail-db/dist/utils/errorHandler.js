export class NetworkError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'NetworkError';
    }
}
export class ValidationError extends Error {
    constructor(field, message) {
        super(message);
        this.field = field;
        this.name = 'ValidationError';
    }
}
export function errorHandleMessage(error) {
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
//# sourceMappingURL=errorHandler.js.map