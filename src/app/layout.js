import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ReduxProvider } from "../redux/provider"; // Check path
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ReduxProvider>
          <HydrateAdmin />
          <Navbar />
          {/* main will take all available space */}
          <main className="flex-grow">{children}</main>
          <WhatsappButton />
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
