import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { Account, User } from '../models/db';
import jwt from 'jsonwebtoken'
import authMiddleware from './middleware';
import bcrypt from 'bcrypt';

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
    })

    const userId = user._id;

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET as string,
    {expiresIn: '1h'}
    )

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    res.status(201).json({
        message: "User created successfully",
        token,
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
        username
    })
    if(!user){
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET as string,
    {expiresIn: '1h'})

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
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }
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

userRouter.get('/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

export default userRouter;