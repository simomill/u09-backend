import mongoose, { Schema } from "mongoose"

export interface UserInterface{
    username: string,
    hashedPassword: string,
    name: string,
    email: string,
    isAdmin: number
}

const UserSchema: Schema = new Schema<UserInterface>({
    username: {
        type: String,
        unique: true,
        required: [true, "Cant be blank"]
    },
    name: {
        type: String,
        unique: false,
        required: [true, "Can't be blank"]
    },
    hashedPassword: {
        type: String,
        unique: false,
        required: [true, "Can't be blank"]
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Can't be blank"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please use a valid email address"],
        unique: true,
    },
    isAdmin: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model<UserInterface>("User", UserSchema, "users");

export default User;