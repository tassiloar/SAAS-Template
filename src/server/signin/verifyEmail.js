//Signs the user in - sends user access code and puts into database if doesnt exist
//with the code

"use server"

import clientPromise from '@/server/mongodb';
import sendEmailVerification from "@/server/email/sendEmailVerification";

export default async function verifyEmail(email) {

    //Get database objects
    const client = await clientPromise;
    const db = client.db('users');

    //Attempt to find user
    const User = await db.collection('User').findOne({
        email: email,
    });

    const result = await sendEmailVerification(email)
    const codeValue = result.code
    const res = result.res


    if (User === null) {
        const newUser = {
            email: email,
            emailVerified: false,
            emailCode: { code: codeValue, expiry: Date.now() + 900000, used: false, attempts: 5 },
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
                    emailCode: { code: codeValue, expiry: Date.now() + 900000, used: false, attempts: 5 }
                }
            }
        )
    }

    return { res: res }
}