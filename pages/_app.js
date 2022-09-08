import "../styles/globals.css";
import { ThemeProvider } from "../components/Theme/Theme";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
