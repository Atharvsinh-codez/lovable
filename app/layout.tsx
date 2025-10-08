import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { GTM, GCLIDTracker, CollectChat, CookieConsent } from '@/components/analytics/GTM';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Imediato Soluções em Seguros',
  description: 'Corretora de Seguros de Auto, Moto, Frotas e Uber. Cotação rápida e preços competitivos.',
  keywords: 'seguro de auto, seguro de carro, seguro de automovel, seguro de veiculo, seguro de uber, seguro de taxi, seguro de utilitario, seguro de moto, seguro de frotas, seguro auto, seguro carro, seguro automovel, seguro veiculo, seguro uber, seguro taxi, seguro utilitario, seguro moto, seguro frotas',
  authors: [{ name: 'Luciano Rodrigues Otero' }],
  creator: 'Luciano Rodrigues Otero',
  publisher: 'Imediato Soluções em Seguros',
  robots: 'index, follow',
  openGraph: {
    title: 'Imediato Soluções em Seguros',
    description: 'Corretora de Seguros de Auto, Moto, Frotas e Uber. Cotação rápida e preços competitivos.',
    url: 'https://www.segurosimediato.com.br',
    siteName: 'Imediato Soluções em Seguros',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imediato Soluções em Seguros',
    description: 'Corretora de Seguros de Auto, Moto, Frotas e Uber. Cotação rápida e preços competitivos.',
  },
  verification: {
    google: '7ExRewM8GII1bwZ73ZEBX9euCX9Sx5m8243ITCyx7cM',
  },
  alternates: {
    canonical: 'https://www.segurosimediato.com.br',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Meta Tags Custom do Webflow */}
        <link rel="canonical" href="https://www.segurosimediato.com.br/" />
        <meta name="google-site-verification" content="7ExRewM8GII1bwZ73ZEBX9euCX9Sx5m8243ITCyx7cM" />
        <meta name="google-site-verification" content="OGCWNwHYOwmFiCvqJXojZvKRTGrh2P9hlXzrcKAeAao" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, maximum-scale=1" />
        <meta name="apple-mobile-web-app-title" content="Imediato Solucoes em Seguros" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="author" content="Luciano Rodrigues Otero, lrotero@gmail.com" />
        <meta name="owner" content="Luciano Rodrigues Otero, lrotero@gmail.com" />
        <meta name="designer" content="Luciano Rodrigues Otero, lrotero@gmail.com" />
        <meta name="url" content="https://www.segurosimediato.com.br" />
        <meta name="identifier-URL" content="https://www.segurosimediato.com.br" />
        <meta name="reply-to" content="lrotero@gmail.com" />
        <meta name="subject" content="Corretora de Seguros de Auto" />
        <meta name="copyright" content="Imediato Solucoes em Seguros" />
        <meta name="Classification" content="Negocios, Seguros" />
        <meta name="theme-color" content="#108fce" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#108fce" />
        <meta name="msapplication-navbutton-color" content="#108fce" />

        {/* Estilos Customizados */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { -webkit-tap-highlight-color: rgba(0,0,0,0); }
            select, input{ -webkit-appearance:none; -moz-appearance:none; }
            .w-lightbox-backdrop { background-color: rgba(0, 0, 0, 0); }
            .w-lightbox-backdrop img { border: 4px solid rgba(0,0,0,0.5); }
            
            /* BG dots */
            :root{
              --dot-color: rgba(17, 24, 39, .07);
              --dot-size: 1px;
              --dot-gap: 10px;
            }
            .bg-dots{
              background-color:#fff;
              background-image: radial-gradient(circle at var(--dot-size) var(--dot-size), var(--dot-color) var(--dot-size), transparent var(--dot-size));
              background-size: var(--dot-gap) var(--dot-gap);
            }
            .bg-dots--dark{
              background-color:#0b1220;
              --dot-color: rgba(255,255,255,.08);
            }
            
            /* Blue grid */
            :root{
              --blue-base:#EAF4FF;
              --grid-color: rgba(17,24,39,.10);
              --grid-gap:14px;
              --grid-thickness:1px;
            }
            .blue-grid{
              background-color: var(--blue-base);
              background-image: repeating-linear-gradient(0deg,var(--grid-color) 0 var(--grid-thickness), transparent var(--grid-thickness) var(--grid-gap)), repeating-linear-gradient(90deg,var(--grid-color) 0 var(--grid-thickness), transparent var(--grid-thickness) var(--grid-gap));
            }
            @media (max-width:768px){
              .blue-grid{ --grid-gap:16px; }
            }
            
            /* Tech header effects */
            :root{
              --tech-bg-dark:#0b1220;
              --tech-bg-light:#EAF4FF;
              --tech-grid-dark:rgba(255,255,255,.07);
              --tech-grid-light:rgba(17,24,39,.10);
              --tech-accent-1:#33aaff;
              --tech-accent-2:#7c3aed;
              --tech-grid-gap:14px;
              --tech-grid-thickness:1px;
              --tech-glow-opacity:.24;
              --tech-sweep-opacity:.06;
            }
            .tech-header,.Brand.New.Header.tech-header{
              position:relative;
              overflow:hidden;
              isolation:isolate;
              min-height:56vh;
            }
            .tech-header--dark{ background:var(--tech-bg-dark); }
            .tech-header--light{ background:var(--tech-bg-light); }
            .tech-header::before,.Brand.New.Header.tech-header::before{
              content:"";
              position:absolute;
              inset:-20% -10% -30% -10%;
              z-index:-1;
              pointer-events:none;
              opacity:var(--tech-glow-opacity);
              background: radial-gradient(50rem 28rem at 10% 15%, var(--tech-accent-1), transparent 60%), radial-gradient(42rem 24rem at 85% 10%, var(--tech-accent-2), transparent 60%), radial-gradient(48rem 26rem at 70% 85%, rgba(16,185,129,.55), transparent 65%);
            }
            .tech-header::after,.Brand.New.Header.tech-header::after{
              content:"";
              position:absolute;
              inset:0;
              z-index:-1;
              pointer-events:none;
              background-image: repeating-linear-gradient(0deg, var(--tech-grid-color) 0 var(--tech-grid-thickness), transparent var(--tech-grid-thickness) var(--tech-grid-gap)), repeating-linear-gradient(90deg, var(--tech-grid-color) 0 var(--tech-grid-thickness), transparent var(--tech-grid-thickness) var(--tech-grid-gap)), linear-gradient(90deg, transparent, rgba(255,255,255,var(--tech-sweep-opacity)), transparent);
              background-size: var(--tech-grid-gap) var(--tech-grid-gap), var(--tech-grid-gap) var(--tech-grid-gap), 50% 100%;
              background-position: 0 0, 0 0, -200% 0;
              animation: tech-sweep 6s linear infinite;
            }
            .tech-header--dark::after { --tech-grid-color: var(--tech-grid-dark); }
            .tech-header--light::after { --tech-grid-color: var(--tech-grid-light); }
            @keyframes tech-sweep { to { background-position: 0 0, 0 0, 200% 0; } }
            @media (prefers-reduced-motion: reduce){
              .tech-header::after,.Brand.New.Header.tech-header::after{
                animation:none;
                background-image: repeating-linear-gradient(0deg, var(--tech-grid-color) 0 var(--tech-grid-thickness), transparent var(--tech-grid-thickness) var(--tech-grid-gap)), repeating-linear-gradient(90deg, var(--tech-grid-color) 0 var(--tech-grid-thickness), transparent var(--tech-grid-thickness) var(--tech-grid-gap));
              }
            }
            @media (max-width:991px){ :root{ --tech-grid-gap:16px; } }
            @media (max-width:479px){ :root{ --tech-grid-gap:18px; } }
          `
        }} />
      </head>
      <body className={inter.className}>
        {/* Analytics Components */}
        <GTM />
        <GCLIDTracker />
        <CollectChat apiKey={process.env.NEXT_PUBLIC_COLLECTCHAT_API_KEY} />
        
        {children}
        
        {/* Cookie Consent */}
        <CookieConsent />
        
        {/* Libs do Footer */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.22.4/dist/sweetalert2.all.min.js" strategy="lazyOnload" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.22.4/dist/sweetalert2.min.css" />
      </body>
    </html>
  );
}