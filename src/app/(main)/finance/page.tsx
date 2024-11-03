"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import Sidebar from "@/components/sidebar";
import FinanceTracker from "@/components/financetracker";
import Link from "next/link";

import { getUserData } from "@/lib/userData";

const DashboardPage: React.FC = () => {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState("");

    useEffect(() => {
        async function fetchData() {
            const userData = await getUserData(session?.user?.email || "");
            if (userData.success) {
                setUsername(`${userData.user.firstname} ${userData.user.lastname}`);
            }
        }
        fetchData();
    }, [session?.user?.email]);

    if (status === "loading") {
        return (
            <html lang="en">
                <body className="overflow-hidden">
                    <div className="flex">
                        <Sidebar userName={"John Doe"} className="fixed top-0 left-0 h-full w-[250px]" />
                        <main className="flex-1 ml-[250px] p-4 overflow-y-auto h-screen">
                            <div className="mt-2">
                                <h1>Loading</h1>
                            </div>
                        </main>
                    </div>
                </body>
            </html>
        );
    }

    if (status === "unauthenticated") {
        return (
            <>
                <p>Access Denied</p>
                <Link href="/auth/logout">Log out</Link>
            </>
        );
    }

    return (
        <html lang="en">
            <body className="overflow-hidden">
                <div className="flex">
                    <Sidebar userName={username} className="fixed top-0 left-0 h-full w-[250px]" />
                    <main className="flex-1 ml-[250px] p-4 overflow-y-auto h-screen">
                        <div className="mt-2">
                            <FinanceTracker email={session?.user?.email || "none"} />
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
};

export default function Dashboard() {
    return (
        <SessionProvider>
            <DashboardPage />
        </SessionProvider>
    );
}
