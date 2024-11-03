"use client"

import { useEffect } from 'react';
import { SignOutfromAll } from "@/lib/signout";

export default function LoggingOut() {

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