import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { Account, User } from '../models/db';
import jwt from 'jsonwebtoken'
import authMiddleware from './middleware';

const userRouter = Router();

interface AuthenticatedRequest extends Request{
    userId?: string
}
interface UserQueryParams extends Request {
    query: {
        filter?: string;
    };
}

const signupBody = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100)
})

const signinBody = z.object({
    username: z.string().email(),
    password: z.string().min(6),
})

const updateBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName:z.string().optional(),
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
        userId,
    })

})

userRouter.post('/signin', async (req: Request, res: Response)=> {
    const parseResult = signinBody.safeParse(req.body);

    if(!parseResult.success){
        return res.status(422).json({
            message: "Validation failed",
            errors: parseResult.error.errors
        })
    }
    
    const { username, password } = parseResult.data;

    const user = await User.findOne({
        username,
        password
    })
    if(!user){
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }
    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET as string)

    return res.status(200).json({
            message: "Sign-in successful",
            token,
            userId: user._id
    })
})

userRouter.put('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
    const parseResult = updateBody.safeParse(req.body);

    if (!parseResult.success){
        return res.status(422).json({
            message: "Validation failed",
            errors: parseResult.error.errors
    })
}
    const updateData = parseResult.data;
    await User.updateOne({ _id: req.userId }, { $set: updateData });

    res.json({
        message: "updated successfully"
    })
})

userRouter.get("/bulk", async (req: UserQueryParams, res: Response) => {
    const filter = req.query.filter || "";

    try {
        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter,
                    "$options": "i" // Option for case-insensitive matching
                }
            }, {
                lastName: {
                    "$regex": filter,
                    "$options": "i" // Option for case-insensitive matching
                }
            }]
        }).exec();

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

export default userRouter;