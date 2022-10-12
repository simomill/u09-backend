import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const jwtSecret = `${process.env.JWT_SECRET}` || "";

export interface JWTUserData {
    userId: ObjectId,
    username: string
}

// HASH PASSWORD
export function hashPassword(password: string) {
    const hash = bcrypt.hashSync(password, 8);
    
    return hash;
}

// PASSWORD VALIDATION
export function comparePassword(password: string, hash: string) {
    const correct = bcrypt.compareSync(password, hash);
    
    return correct;
}

// CREATE AND SIGN JWT
export function getJWT(username: string, userId: ObjectId) {
    const userData: JWTUserData = { username, userId };
    const accesstoken = jwt.sign(userData, jwtSecret);
    
    return accesstoken;
}

// VERIFY SIGNED JWT
export function verifyDecodeJWT(token: string) {
    try {
        const userData = jwt.verify(token, jwtSecret) as JWTUserData;
        return userData;
    } catch {
        return false
    }
}