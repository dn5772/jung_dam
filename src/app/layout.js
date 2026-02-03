import { Geist, Geist_Mono } from "next/font/google";
// import { PT_Mono, preconnect_Mono} from 'next/font/google';
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "glightbox/dist/css/glightbox.min.css";
import "swiper/css";
import "./css/main.css";
import Script from 'next/script';
import YummyScripts from "../components/YummyScripts";
import { Roboto, Inter, Amatic_SC } from 'next/font/google';
import { LanguageProvider } from '../contexts/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

const amaticSC = Amatic_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-amatic-sc',
});

export const metadata = {
  title: "Jung Dam",
  description: "Jung Dam Korean Restaurant in Auckland",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${inter.variable} ${amaticSC.variable}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <YummyScripts />
        <Script src="/js/purecounter_vanilla.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
