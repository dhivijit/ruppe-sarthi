"use client"

import { useEffect } from 'react';
import { SignOutfromAll } from "@/lib/signout";

export default function loggingout() {

    useEffect(() => {
        const signOutUser = async () => {
            await SignOutfromAll();
        };

        signOutUser();
    });


    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    )
}