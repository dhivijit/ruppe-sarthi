"use client";
import { signIn } from "next-auth/react";
import { FormEvent, useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";

function SignInForm() {
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();

  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      setErrorMessage("Invalid email or password");
    }

    const newUrl = window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [errorParam]);

  const credentialsAction = async (formData: FormData) => {
    const formObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formObject[key] = value.toString();
    });
    await signIn("credentials", {
      ...formObject,
      redirectTo: "/",
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(""); // Clear any previous error message
    const formData = new FormData(event.target as HTMLFormElement);
    credentialsAction(formData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper} className="flex flex-col items-center">
        <Image src="/saarthi.png" alt="Saarthi Logo" width={170} height={106} className="mb-4" />
        <h2 style={styles.title}>Sign In</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="credentials-email" style={styles.label}>
            Email
          </label>
          <input type="email" required
            id="credentials-email"
            name="email"
            style={styles.input}
          />
          <label htmlFor="credentials-password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            required
            id="credentials-password"
            name="password"
            style={styles.input}
          />
          <input type="submit" value="Sign In" style={styles.submitButton} />
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

          <p className="mt-4 text-black">
            Don&apos;t have an account? <a href="/auth/signup" className="text-blue-600 underline">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "24px",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#333333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    marginBottom: "0.5rem",
    color: "#555555",
  },
  input: {
    padding: "0.75rem",
    marginBottom: "1.25rem",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    color: "#333333",
    outline: "none",
  },
  submitButton: {
    padding: "0.75rem",
    fontSize: "16px",
    color: "#ffffff",
    backgroundColor: "#4a90e2",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  errorMessage: {
    marginTop: "1rem",
    color: "#ff4d4f",
    fontSize: "14px",
    textAlign: "center",
  },
};
