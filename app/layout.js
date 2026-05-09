import { Playfair_Display, League_Spartan, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-spartan",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spartan = League_Spartan({
  variable: "--font-spartan",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "Paw Forward",
  description: "Mumbai's street dogs deserve a home. Adopt, report, support.",
  icons: {
    icon: "/images/paw-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${spartan.variable} ${montserrat.variable}`}
      >
        {children}
      </body>
    </html>
  );
}