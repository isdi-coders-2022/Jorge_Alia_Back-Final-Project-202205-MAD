import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface ExtRequest extends Request {
    tokenPayload: JwtPayload;
}

export interface iTokenPayload extends JwtPayload {
    id: string;
    name: string;
}
