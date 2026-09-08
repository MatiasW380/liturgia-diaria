import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Cristo en tu día</title>
        <meta name="description" content="Evangelio, santo del día, reflexión y Liturgia de las Horas." />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
