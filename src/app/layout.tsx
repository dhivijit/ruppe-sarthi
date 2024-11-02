import "./globals.css";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | RuppeSarthi - Finance tracker for MSEs",
    default: "RuppeSarthi - Finance tracker for MSEs",
  },
  description: "RuppeSarthi is a finance tracker for Micro and Small Enterprises (MSEs) in India. It helps you track your expenses, income, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
