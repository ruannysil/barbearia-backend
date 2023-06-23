import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface Payload {
    sub: string;
}

export function isAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {

    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).end();
    }

    const [, token] = authToken.split(" ")

    try {

        const { sub } = verify(
            token,
            process.env.JWT_SECRET
        ) as Payload;

        request.user_id = sub;

        return next();

    } catch (err) {
        return response.status(401).end();
    }

}