// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import {ReduxProvider} from "../redux/provider"; // Make sure path is correct
import WhatsappButton from "./components/WhastappButton";
import HydrateAdmin from "./components/HydrateAdmin";
import Footer from "./components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nursery app",
  description: "App for the nursery services and products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <HydrateAdmin />
          <Navbar />
          {children}
          <WhatsappButton />
          <Footer/>
        </ReduxProvider>
      </body>
    </html>
  );
}
