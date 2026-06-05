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
import { Analytics } from "@vercel/analytics/next";
import { siteConfig, restaurantJsonLd } from "../lib/siteConfig";

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
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${roboto.variable} ${inter.variable} ${amaticSC.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <YummyScripts />
        <Script src="/js/purecounter_vanilla.js" strategy="afterInteractive" />
        <Analytics />
      </body>
    </html>
  );
}
