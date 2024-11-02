"use client";

import { userSignUp } from "@/lib/userSignUp";
import { signInSchema } from "@/lib/zod";
import { useState } from "react";
import Image from "next/image";
import { Metadata } from "next";
import Head from "next/head";

type SignUpResponse = {
  success: boolean;
  message: string;
};

export const metadata: Metadata = {
  title: "Sign Up"
};

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(""); // Clear previous error messages
    setSuccessMessage(""); // Clear previous success messages

    const form = event.currentTarget as HTMLFormElement;
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Validate email and password with zod schema
    const signInResult = signInSchema.safeParse({ email, password });
    if (!signInResult.success) {
      setErrorMessage(signInResult.error.errors[0].message);
      return;
    }

    // Proceed with user signup
    const response = await userSignUp(firstname, lastname, email, password) as SignUpResponse;
    if (response.success) {
      setSuccessMessage(response.message + " Redirecting to sign in page...");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1000);
    } else {
      setErrorMessage(response.message);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | RuppeSarthi - Finance tracker for MSEs</title>
      </Head>
      <div style={styles.container}>
        <div style={styles.formWrapper} className="flex flex-col items-center">
          <Image src="/saarthi.png" alt="Saarthi Logo" width={170} height={106} className="mb-4" />
          <h2 style={styles.title}>Sign Up</h2>
          <form onSubmit={handleSignUp} style={styles.form}>
            <div style={styles.nameWrapper}>
              <div style={styles.inputContainer}>
                <label htmlFor="firstname" style={styles.label}>
                  First Name
                </label>
                <input
                  type="text"
                  required
                  id="firstname"
                  name="firstname"
                  style={styles.input}
                />
              </div>
              <div style={styles.inputContainer}>
                <label htmlFor="lastname" style={styles.label}>
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  id="lastname"
                  name="lastname"
                  style={styles.input}
                />
              </div>
            </div>
            <label htmlFor="credentials-email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              required
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
            <label htmlFor="confirm-password" style={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              id="confirm-password"
              name="confirmPassword"
              style={styles.input}
            />
            <br />
            <input type="submit" value="Sign Up" style={styles.submitButton} />
            {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
            {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
            <p className="mt-4 text-black">
              Already have an account? <a href="/auth/login" className="text-blue-600 underline">Log In</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem", // Ensures spacing from viewport edges
    minHeight: "100vh", // Ensures the container takes the full viewport height
    backgroundColor: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
    overflowY: "auto", // Enables scrolling if content overflows
  },
  formWrapper: {
    width: "100%",
    maxWidth: "500px",
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
  nameWrapper: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.25rem",
  },
  inputContainer: {
    flex: "1",
  },
  label: {
    fontSize: "14px",
    marginBottom: "0.5rem",
    color: "#555555",
  },
  input: {
    padding: "0.75rem",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    color: "#333333",
    outline: "none",
    width: "100%",
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
  successMessage: {
    marginTop: "1rem",
    color: "#4caf50",
    fontSize: "14px",
    textAlign: "center",
  },
};
