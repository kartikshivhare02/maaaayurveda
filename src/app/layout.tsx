import type { Metadata, Viewport } from "next";
import { Noto_Sans_Devanagari, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ProductProvider } from "@/lib/store/productStore";
import { CartProvider } from "@/lib/store/cartStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingSupport } from "@/components/FloatingSupport";
import { FloatingCart } from "@/components/FloatingCart";
import { AuthModal } from "@/components/AuthModal";

const devanagari = Noto_Sans_Devanagari({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-devanagari",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0b3d2e",
};

export const metadata: Metadata = {
  title: "माँ आयुर्वेदिक क्रीम — दाद, खाज, खुजली और सोरायसिस में राहत",
  description:
    "100% शुद्ध आयुर्वेदिक जड़ी-बूटियों (बाकुची तेल 15%, वैसलीन सल्फर 12%, कत्था 4%, गंध पुष्पा, शुद्ध गंधक, नीला थोथा) से निर्मित माँ आयुर्वेदिक क्रीम। दाद, पुरानी खुजली, दरार और सोरायसिस में प्रामाणिक राहत।",
  keywords: [
    "माँ आयुर्वेदिक क्रीम",
    "दाद की दवा",
    "खाज खुजली का इलाज",
    "सोरायसिस क्रीम",
    "त्वचा की खुजली",
    "आयुर्वेदिक स्किनकेयर",
    "दाद खाज खुजली",
  ],
  authors: [{ name: "माँ आयुर्वेदिक वेलनेस" }],
  metadataBase: new URL("https://maaayurvedic.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "माँ आयुर्वेदिक क्रीम — दाद, खाज, खुजली और सोरायसिस में राहत",
    description: "माँ का ख्याल, प्रकृति का कमाल। 100% शुद्ध आयुर्वेदिक प्राकृतिक फॉर्मूला।",
    url: "https://maaayurvedic.in",
    siteName: "माँ आयुर्वेदिक क्रीम",
    images: [
      {
        url: "/images/product.jpeg",
        width: 800,
        height: 800,
        alt: "माँ आयुर्वेदिक क्रीम 50g",
      },
    ],
    locale: "hi_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`${devanagari.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#fdfdfd] text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900 w-full max-w-full overflow-x-hidden">
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Header />
              <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
              <Footer />
              <FloatingSupport />
              <FloatingCart />
              <AuthModal />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
