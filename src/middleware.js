import { NextResponse } from "next/server";

export async function middleware(request) {

    let accessToken
    let refreshToken

    try {
        accessToken = request.cookies.get('accessToken').value
    } catch (err) {
        accessToken = "null"
    }
    try {
        refreshToken = request.cookies.get('refreshToken').value
    } catch (err) {
        refreshToken = "null"
    }

    const response = await fetch(new URL('/api/checkTokens', request.url), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessToken: accessToken,
            refreshToken: refreshToken,
        }),
    });

    const result = await response.json()

    let responseFinal

    if (result.authenticated === true && (request.nextUrl.pathname === "/signin")) {
        responseFinal = NextResponse.redirect(new URL('/', request.url))
    } else {
        responseFinal = NextResponse.next()
    }

    if (result.cookieSet === true) {
        const setCookieHeader = response.headers.get('set-cookie');
        responseFinal.headers.append('set-cookie', setCookieHeader);
    }

    return responseFinal
}

export const config = {
    matcher: ['/signin', '/']
}