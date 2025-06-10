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
  title: "Bageechi - Your Green Haven",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌿</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
  keywords: [
    "bageechi",
    "bagichi",
    "plants",
    "pots",
    "nursery",
    "gardening",
    "home decor",
    "indoor plants",
    "outdoor plants",
    "greenery",
    "sustainable living",
  ],
  authors: [
    { name: "Bageechi Team", url: "https://bageechi.in" },
    { url: "https://www.bageechi.in" },
  ],
  creator: "Bageechi Team",
  description: "App for the Bageechi services and products",
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
          <main className="flex-grow">{children}</main>
          <WhatsappButton />
          <Footer />
        </ReduxProvider>

        {/* ✅ Invisible persistent reCAPTCHA container */}
        <div id="recaptcha-container" style={{ display: "none" }} />
      </body>
    </html>
  );
}
