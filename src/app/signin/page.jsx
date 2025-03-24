//Signup page

"use client"

import googleOAuthURL from '@/server/oauth/googleLink'
import verifyEmail from "@/server/signin/verifyEmail"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';

export default function SignIn() {

    let globalEmail

    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.has("state")) {
            const state = atob(searchParams.get("state"))
            document.getElementById("mainTitle").innerText = state
            if (state === "Log in") {
                document.getElementById("switchStates").innerText = "Don't have an account? Sign up instead"
                document.getElementById("switchStates").href = "/signin?state=U2lnbiB1cA=="
            } else if (state === "Sign up") {
                document.getElementById("switchStates").innerText = "Already signed up? Log in instead"
                document.getElementById("switchStates").href = "/signin?state=TG9nIGlu"
            }
        }
    }, [])


    const verificationSate = (email) => {
        document.getElementById("codeInput").required = true
        document.getElementById("email").disabled = true
        document.getElementById("codeSection").hidden = false
        document.getElementById("mainButton").innerText = "Continue"
        document.getElementById("mainTitle").innerText = `We've sent an email \n with your code to \n ${email}`
        document.getElementById("mainTitle").className = "py-2 mx-auto text-center text-lg font-semibold"

        document.getElementById("mainFrom").onsubmit = (e) => {
            e.preventDefault();
            handleCode(new FormData(e.target));
        }
    }


    const handleSignIn = async (formData) => {


        const email = formData.get('email')

        globalEmail = email

        verificationSate(email)

        //Sign user in & send email
        const response = await verifyEmail(email)

        if (response.res === "success") {
            document.getElementById("emailStatus").innerText = "✅ Email received"
        } else {
            document.getElementById("emailStatus").innerText = "❌ Email not delivered "
        }

    }

    const handleCode = async (formData) => {

        document.getElementById("emailStatus").innerText = "Verifying..."

        const response = await fetch('/api/verifyLoginCode', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: globalEmail,
                code: formData.get("code")
            })
        })

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const result = await response.json()

            if (result.res === "fail") {
                document.getElementById("emailStatus").innerText = "❌ Invalid code"
                document.getElementById("differentEmailLink").hidden = false
                document.getElementById("differentEmailLink").href = window.location.href
            }
        }
    }

    const handleSubmit = async (formData) => {
        if (formData.get("code")) {
            handleCode(formData)
        } else {
            handleSignIn(formData)
        }
    }

    return (
        <>
            <Card className="w-[350px] mx-auto my-24">
                <CardHeader>
                    <CardTitle id="mainTitle" className="py-2 mx-auto">Sign up</CardTitle>
                    <CardDescription className=" mx-auto">Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="mainFrom"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(new FormData(e.target));
                        }}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <a id="googleSignin"
                                    href={googleOAuthURL}
                                    className={cn(buttonVariants({ variant: 'secondary' }), "")}>
                                    <div className='flex mr-12'>
                                        <FcGoogle className="w-10 mr-6 left-7" size={20} />
                                        <p className="">Continue with Google</p>
                                    </div>
                                </a>

                                <CardDescription className="py-2 mx-auto pb-4">or continue with email</CardDescription>

                                <Input type="email" id="email" name="email" required placeholder="Enter an email address" />
                                <div id="codeSection" hidden>
                                    <div className='flex flex-col'>
                                        <Input type="text" id="codeInput" name="code" placeholder="Verification code" />
                                        <p id="emailStatus" className='text-sm text-slate-800 m-2'>Sending mail...</p>
                                        <p id="differentEmailLink" className="text-sm text-slate-800 m-2 mx-auto underline" hidden>Try a different email</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Button id="mainButton" type="submit">Continue with email</Button>
                                <a href="/" id="switchStates" className="text-sm text-slate-800 pt-3 mx-auto underline opacity-85">Already signed up? Log in instead </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card >
        </>
    );
}
