import { Request, Response } from 'express';

export type RouteHandler<TReqBody = any, TResBody = any> = (
    req: Request<any, TResBody, TReqBody>,
    res: Response<TResBody>,
    errors: string
) => Promise<void>;


export type UserTypes = {
    name?: string,
    email?: string,
    password?: string,
    role?: string,
}