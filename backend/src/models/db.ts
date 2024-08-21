import mongoose, { Document, model, Schema } from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
const dbUrl = process.env.DATABASE_URL as string;

mongoose.connect(dbUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Connection error', err);
  });


interface IUser extends Document{
    username: string,
    password: string,
    firstName: string,
    lastName: string
}
interface IAccount extends Document{
    userId: mongoose.Schema.Types.ObjectId;
    balance: number;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    }
})

const accountSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        required: true
    }
})
const User = model<IUser>('User', userSchema)
const Account = model<IAccount>('Account', accountSchema)

export { User, Account };