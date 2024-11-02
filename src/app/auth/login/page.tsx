import SignIn from "@/components/sign-in";

import { Metadata } from "next";

const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage() {
    return (
        <SignIn />
    );
}