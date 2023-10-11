import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DarkModeProvider, useDarkMode } from "../context/DarkMode";

function Calendarium({ Component, pageProps }: AppProps) {
  return (

    <DarkModeProvider>
        <Component {...pageProps} />
    </DarkModeProvider>
  )
}

export default Calendarium;
