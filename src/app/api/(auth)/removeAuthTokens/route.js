//Removes the access and refresh token through response

import { NextResponse } from "next/server";

export async function GET() {

    const response = new NextResponse()

    response.cookies.set("accessToken", "", {
        path: '/',
        maxAge: 0,
        secure: true,
        sameSite: 'Strict',
        httpOnly: false
    })

    response.cookies.set("refreshToken", "", {
        path: '/',
        maxAge: 0,
        secure: true,
        sameSite: 'Strict',
        httpOnly: true
    })

    return response
}