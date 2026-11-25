import "./globals.css";
import { BRAND } from "@/lib/brand";
import { getSiteUrl, HOME_DESCRIPTION, HOME_TITLE, isPreviewDeployment } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: BRAND.name,
  title: {
    default: HOME_TITLE,
    template: `%s · ${BRAND.name}`,
  },
  description: HOME_DESCRIPTION,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: isPreviewDeployment()
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    locale: "en_IN",
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: BRAND.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
