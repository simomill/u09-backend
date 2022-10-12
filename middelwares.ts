import { Request, Response, NextFunction } from "express";
import { verifyDecodeJWT } from "./utils";

// AUTHENTICATE USER (RUN ON EVERY REQUEST) 
export function authUser(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    const userData = token && verifyDecodeJWT(token);

    if (userData) {
        res.locals.user = userData;
    } else {
        res.locals.user = false;
    }

    next()
}

// FORCE LOGIN (RUN ONLY ON SELECTED ROUTES)
export function forceAuth(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}