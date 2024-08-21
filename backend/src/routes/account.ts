import { Request, Response, Router } from 'express';
import authMiddleware from './middleware';
import { Account } from '../models/db';
import mongoose from 'mongoose';

const accountRouter = Router();

interface AuthenticatedRequest extends Request{
    userId?:string
}

accountRouter.get('/balance',authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try{
        const account = await Account.findOne({
            userId: req.userId
        });

        if(!account){
            return res.status(404).json({
                message: "Account not found",
            });
        }
        res.status(200).json({
            balance: account.balance
        })
    }catch(error: any){
        res.status(500).json({
            message: "error while fetching balance",
            error: error.message,
        })
    }
})
accountRouter.post('/transfer', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {amount, to} = req.body;

        if (amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Transfer amount must be a positive number",
            });
        }

        const account = await Account.findOne({userId: req.userId}).session(session);

        if(!account || account.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            })
        }
        const toAccount = await Account.findOne({userId: to }).session(session);
        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
        await Account.updateOne({userId: to}, {$inc: {balance: amount}}).session(session);

        await session.commitTransaction();
        res.status(200).json({
            message: "Transaction successful"
        })
    }catch (error: any){
        await session.abortTransaction();
        res.status(401).json({
            message: "error while transaction",
            error: error.message
        })
    }finally {
        session.endSession();
    }
})

export default accountRouter;