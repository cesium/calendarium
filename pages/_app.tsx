import type { AppProps } from "next/app";
import "../styles/globals.css";
import {ThemeProvider} from 'next-themes';

function Calendarium({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" storageKey="darkTheme" defaultTheme="system">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default Calendarium;
