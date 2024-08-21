import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { Account, User } from '../models/db';

const userRouter = Router();

const signupBody = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100)
})

userRouter.post('/signup', async(req: Request, res: Response) => {
    const parseResult = signupBody.safeParse(req.body);
    if (!parseResult.success){
        return res.status(422).json({
            message: "Validation failed",
            errors: parseResult.error.errors
        })
    }
    const { username, password, firstName, lastName } = parseResult.data;

    const existingUser = await User.findOne({username})

    if (existingUser){
        return res.status(409).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username,
        password,
        firstName,
        lastName,
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    res.status(201).json({
        message: "User created successfully",
    })

})

export default userRouter;