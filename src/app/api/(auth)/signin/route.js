//Signs the user in - gives access tokens and puts into database if doesnt exist

"use server"

import { NextResponse } from "next/server";
import clientPromise from '@/server/mongodb';
import sendEmailVerification from "@/server/email/sendEmailVerification";

// request body accepts email, password
export async function POST(request) {

    const body = await request.json();

    const email = body.email

    //Get database objects
    const client = await clientPromise;
    const db = client.db('users');

    //Attempt to find user
    const User = await db.collection('User').findOne({
        email: email,
    });

    const resp = await sendEmailVerification(email)
    const code = resp.code
    const res = resp.res

    console.log("CODE:  ", code)

    if (User === null) {
        const newUser = {
            email: email,
            emailVerified: false,
            emailCode: { code: code, expiry: Date.now() + 900000, attempts: 5 },
            role: "USER",
            registerType: "CRED",
            createdAt: new Date(),
        }
        await db.collection('User').insertOne(newUser);
    } else {
        await db.collection('User').updateOne(
            { _id: User._id },
            {
                $set: {
                    emailCode: { code: code, expiry: Date.now() + 900000, attempts: 5 }
                }
            }
        )
    }

    return NextResponse.json({ res: res })

}