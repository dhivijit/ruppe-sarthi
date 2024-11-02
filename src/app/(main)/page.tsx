"use client"

import { Metadata } from "next";
import React, { useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";

const metadata: Metadata = {
    title: "Dashboard",
};

const DashboardPage: React.FC = () => {
    const { data: session, status } = useSession();
    
    if (status === "loading") {
        return <p>Loading...</p>;
    }
    
    if (status === "unauthenticated") {
        return <p>Access Denied</p>;
    }
    
    return (
        <div>
        <h1>Dashboard</h1>
        <p>Welcome {session?.user?.email}</p>
        </div>
    );
}

export default function Dashboard() {
    return (
        <SessionProvider>
            <DashboardPage />
        </SessionProvider>
    );
}