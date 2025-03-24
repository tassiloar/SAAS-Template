//Checks if login code is correct and assigns token if correct

import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import clientPromise from '@/server/mongodb';

//Accespts an email and code
export async function POST(request) {

    const body = await request.json();

    const email = body.email
    const code = body.code

    const client = await clientPromise;
    const db = client.db('users');

    const User = await db.collection('User').findOne({
        email: email,
    });

    if (String(User.emailCode.code) === String(code) && User.emailCode.expiry > Date.now() && User.emailCode.attempts > 0 && User.emailCode.used === false) {

        //update to confirmed email status
        await db.collection('User').updateOne(
            { email: email },
            {
                $set:
                {
                    emailVerified: true,
                    'emailCode.used': true
                }

            })

        //JWT token payload
        const payload = {
            email: User.email,
        }

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' })

        const response = NextResponse.redirect(new URL('/', request.url));

        //Set cookies
        response.cookies.set("accessToken", accessToken, {
            path: '/',
            maxAge: 3600,
            secure: true,
            sameSite: 'Strict',
            httpOnly: false
        })

        response.cookies.set("refreshToken", refreshToken, {
            path: '/',
            maxAge: 604800,
            secure: true,
            sameSite: 'Strict',
            httpOnly: true
        })

        return response
    } else {

        //decrease attempts
        await db.collection('User').updateOne(
            { email: email },
            {
                $inc: { 'emailCode.attempts': -1 }

            })

        return NextResponse.json({ res: "fail" })
    }
}