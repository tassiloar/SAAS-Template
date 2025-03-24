// This route is used in middleware to verify the 
// authenticity of the clients tokens

import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

//request body accepts a accessToken and refreshToken string
export async function POST(request) {

    const body = await request.json();

    const accessToken = body.accessToken
    const refreshToken = body.refreshToken

    //Attempt to decode the access tokens
    let decodedAccessToken
    try {
        decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
    } catch (err) {
        decodedAccessToken = undefined
    }

    //Attempt to decode the refresh token and set to undefined if not possible
    let decodedRefreshToken
    try {
        decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY)
    } catch (err) {
        decodedRefreshToken = undefined
    }

    //If refresh token was decoded unsucessfully, meaning its corrupted or wrong 
    //let user access public pages
    if (decodedRefreshToken === undefined || decodedRefreshToken.email === undefined) {
        return NextResponse.json({ cookieSet: false, authenticated: false })
    }

    let response

    //If access token decode was unsuccessful, generate new one
    if (decodedAccessToken === undefined || decodedAccessToken.email === undefined) {

        response = NextResponse.json({ cookieSet: true, authenticated: true })

        response.cookies.set("accessToken", jwt.sign(decodedRefreshToken, process.env.JWT_SECRET_KEY), {
            path: '/',
            maxAge: 3600,
            secure: true,
            sameSite: 'Strict',
            httpOnly: false
        })
    } else {
        response = NextResponse.json({ cookieSet: false, authenticated: true })
    }

    return response
}


export async function GET(request) {
    try {
        const session =
            await stripe.checkout.sessions.retrieve(request.query.session_id);

        return NextResponse.json({
            status: session.status,
            customer_email: session.customer_details.email
        })
    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
}