import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


interface payload {
    id: number,
    login: string,
    role: string,
    clientId: number;
}

const {JSECRET_ACCESS_TOKEN, JSECRET_TIME_TO_EXPIRE} = process.env

export class encrypt {
    static async encryptpass(password: string) {
        return bcrypt.hashSync(password,12);
    }
    static async comparepassword(hashPassword: string, password: string) {
        return bcrypt.compare(password, hashPassword);
    }
    static generateToken(payload: payload, expiresIn: string = JSECRET_TIME_TO_EXPIRE!){
        return jwt.sign(payload, `${JSECRET_ACCESS_TOKEN}`, { expiresIn: expiresIn });
    }
}