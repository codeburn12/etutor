// Importing necessary modules from the Express library
import { Request, Response, NextFunction } from "express";

/**
 * Creates a new resolved promise for the provided value.
 * 
 * @param theFunc - An asynchronous function (middleware or route handler) to be executed.
 * @returns A function that takes Express request, response, and next parameters and handles asynchronous errors.
 */
export const CatchAsyncError = (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    // Resolves the promise returned by theFunc and catches any errors, passing them to the Express error handling middleware
    Promise.resolve(theFunc(req, res, next).catch(next));
}
