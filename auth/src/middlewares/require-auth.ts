import { Request, Response, NextFunction } from 'express';

import { NotAuthorizedError } from '../errors/not-authorized-error';

// This assumes that the current-user middleware has
// already been ran.
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
	throw new NotAuthorizedError();
    }

    next();
};
