import type { AppProps } from 'next/app';
import '../styles/globals.css';

function Calendarium({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default Calendarium;
