export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Invalid JSON body." });
    }

    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
};
