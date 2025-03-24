//Handles Google OAuth callback and signin/signup 

import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";
import clientPromise from '@/server/mongodb';

//Called by google 
export async function GET(request) {

    console.log("IN GOOGLE")

    //get code from callback url
    const url = new URL(request.url);

    //Parameters passed by google though url params
    // code
    // scope 
    // authuser 
    // prompt
    const code = url.searchParams.get('code');

    //Fetch tokens using code
    let tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_SECRET_ID,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL,
        }).toString(),
    });


    //Token information provided
    // access_token
    // expires_in
    // refresh_token
    // scope 
    // token_type
    // id_token
    const tokenResult = await tokenResponse.json()

    const access_token = tokenResult.access_token

    //Get user info with token
    let dataResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });

    //User info provided
    // id 
    // email 
    // verified_email
    // name 
    // given_name
    // family_name
    // picture
    const dataResult = await dataResponse.json()

    if (dataResult.verified_email === false) {
        return NextResponse.redirect(new URL(`/signin?error=${addUserResult.errorMesage}`, request.url))
    }

    const client = await clientPromise;
    const db = client.db('users');

    //Attempt to find user
    const User = await db.collection('User').findOne({
        email: dataResult.email,
    });

    let email = dataResult.email

    //If user doesnt exist, add to database
    if (User === null) {
        const newUser = {
            email: dataResult.email,
            role: "USER",
            registerType: "Google",
            createdAt: new Date(),
            oauthData: dataResult
        }

        await db.collection('User').insertOne(newUser);


        //If user already exists but registered using creds, update using oauth
    } else if (User.registerType === "CRED") {

        await db.collection('User').updateOne(
            { _id: User._id },
            {
                $set: {
                    registerType: "Google",
                    oauthData: dataResult
                }
            }
        )
    }

    //JWT token payload
    const payload = {
        email: email,
    };

    //Create tokens
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' })

    //Create response object
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
}