import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div data-theme="valentine" className="min-h-screen">
      <Component {...pageProps} />
    </div>
  );
}
