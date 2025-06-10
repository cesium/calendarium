import "./globals.css";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

import * as fs from "fs";
import { DataProvider } from "../contexts/DataProvider";

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const filters = await getFilters();
  const shifts = await getShifts();
  // const filters = [];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts and Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        {/* Web App Related */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/pwa/ios/512.png"></link>
        {/* Splash Screen configuration for IOS devices */}
        <meta name="mobile-web-app-capable" content="yes"></meta>
        <link
          href="/pwa/splashscreens/iphone5_splash.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/iphone6_splash.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/iphoneplus_splash.png"
          media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/iphonex_splash.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/iphonexr_splash.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/iphonexsmax_splash.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/ipad_splash.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/ipadpro1_splash.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/ipadpro3_splash.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/pwa/splashscreens/ipadpro2_splash.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <Script
          defer
          src={process.env.UMAMI_URL}
          data-website-id={process.env.UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      </head>
      <body className="dark:bg-neutral-900">
        <ThemeProvider
          attribute="class"
          storageKey="darkTheme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DataProvider filters={filters} shifts={shifts}>
            {children}
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

async function getFilters() {
  try {
    const filters = JSON.parse(fs.readFileSync("data/filters.json", "utf-8"));
    return filters;
  } catch (error) {
    console.error("Error loading filters:", error);
    return [];
  }
}

async function getShifts() {
  try {
    const shifts = JSON.parse(fs.readFileSync("data/shifts.json", "utf-8"));
    return shifts;
  } catch (error) {
    console.error("Error loading shifts:", error);
    return [];
  }
}
