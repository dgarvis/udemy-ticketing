import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@dgarvis/ticketing-common';

const router = express.Router();

router.post(
    '/api/users/signin',
    [
	body('email')
	    .isEmail()
	    .withMessage('Email must be valid'),
	body('password')
	    .trim()
	    .notEmpty()
	    .withMessage('You umst supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {	
	const { email, password } = req.body;

	const existingUser = await User.findOne({ email });
	if (!existingUser) {
	    throw new BadRequestError('Invalid credentials');
	}

	const passwordsMatch = await Password.compare(existingUser.password, password);

	if (!passwordsMatch) {
	    throw new BadRequestError('Invalid credentials');
	}

	// Generate JWT
	const userJwt = jwt.sign({
	    id: existingUser.id,
	    email: existingUser.email
	}, process.env.JWT_KEY!); // ! at the end tells TS to not check it.
	
	// Store it on the session object
	req.session = {
	    jwt: userJwt
	};

	res.status(200).send(existingUser);
    }
);

export { router as signinRouter };

