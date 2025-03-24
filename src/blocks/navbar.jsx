"use client"

import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { Avatar } from "@/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { usePathname } from 'next/navigation'

export default function navbar() {

    const [authed, setAuthed] = useState(null)
    const [email, setEmail] = useState("")
    const [iconLetters, setIconLetters] = useState(null)

    useEffect(() => {
        try {
            const token = jwt.decode(Cookies.get("accessToken")).email;
            setIconLetters(token.charAt(0) + token.charAt(1))
            setEmail(token)
            console.log("1:  ")
            setAuthed(true)
        } catch (err) {
            setAuthed(false)
        }
    }, [])

    const pathname = usePathname()


    const handleLogOut = async () => {

        await fetch('/api/removeAuthTokens', {
            method: "GET"
        })

        window.location.reload();
    }

    if (authed === false) {

        if (pathname === "/signin") {
            return (
                <div className="flex">

                    <div className="w-full flex justify-start p-2 font-medium">
                        <Link href="/" className="p-2 mr-4 ml-4">
                            <p>Company logo</p>
                        </Link>
                    </div>

                </div>)
        } else {
            return (
                <div className="flex">

                    <div className="w-full flex justify-start p-2 font-medium">
                        <Link href="/" className="p-2 mr-4 ml-4">
                            <p>Company logo</p>
                        </Link>
                    </div>

                    <div className="w-full flex justify-end p-2">
                        <Link href="/signin?state=TG9nIGlu"
                            className={cn(buttonVariants({ variant: 'secondary' }), "mr-4")}>
                            Log in
                        </Link>
                        <Link href="/signin?state=U2lnbiB1cA=="
                            className={cn(buttonVariants({ variant: 'default' }), "")}>
                            Sign up
                        </Link>
                    </div>

                </div>
            )
        }
    } else if (authed === true) {
        return (
            <div className="flex">

                <div className="w-full flex justify-start p-2 font-medium">
                    <Link href="/" className="p-2 mr-4 ml-4">
                        <p>Company logo</p>
                    </Link>
                </div>

                <div className="w-full flex justify-end p-2">
                    <DropdownMenu>

                        <DropdownMenuTrigger asChild>
                            <Avatar className="bg-gray-300">
                                <p className="pl-3 pt-2 font-medium">{iconLetters}</p>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>{email}</DropdownMenuLabel>


                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem className="flex items-center justify-center" onClick={handleLogOut}>
                                    logout
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div >
        )
    } else {
        return (<div className="flex">

            <div className="w-full flex justify-start p-2 font-medium">
                <Link href="/" className="p-2 mr-4 ml-4">
                    <p>Company logo</p>
                </Link>
            </div>
        </div >)
    }
}
