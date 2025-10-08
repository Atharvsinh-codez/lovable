"use client";

import Script from 'next/script';

/**
 * Google Tag Manager Component
 * Baseado na configuração original do Webflow
 */

interface GTMProps {
  gtmId?: string;
}

export function GTM({ gtmId = 'GTM-PD6J398' }: GTMProps) {
  return (
    <>
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `
        }}
      />
      
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}

/**
 * Google Analytics 4 Component
 */
interface GA4Props {
  measurementId?: string;
}

export function GA4({ measurementId }: GA4Props) {
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href
            });
          `
        }}
      />
    </>
  );
}

/**
 * Google Ads Conversion Tracking
 */
interface GoogleAdsProps {
  conversionId?: string;
  conversionLabel?: string;
}

export function GoogleAds({ conversionId, conversionLabel }: GoogleAdsProps) {
  if (!conversionId || !conversionLabel) return null;

  return (
    <Script
      id="google-ads-conversion"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          gtag('event', 'conversion', {
            'send_to': '${conversionId}/${conversionLabel}',
            'value': 1.0,
            'currency': 'BRL'
          });
        `
      }}
    />
  );
}

/**
 * GCLID Tracker Component
 */
export function GCLIDTracker() {
  return (
    <Script
      id="gclid-tracker"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function setCookie(name, value, days) {
              var date = new Date();
              date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
              var expires = "; expires=" + date.toUTCString();
              document.cookie = name + "=" + value + expires + ";path=/";
            }

            function getParam(p) {
              var params = new URLSearchParams(window.location.search);
              return params.get(p) ? decodeURIComponent(params.get(p)) : null;
            }

            // Captura gclid OU gbraid (qualquer um dos dois)
            var gclid = getParam("gclid") || getParam("GCLID") || getParam("gclId");
            var gbraid = getParam("gbraid") || getParam("GBRAID") || getParam("gBraid");
            
            // Define prioridade: se gclid existir, usa ele. Se não, usa gbraid.
            var trackingId = gclid || gbraid;
            
            if (trackingId) {
              var gclsrc = getParam("gclsrc");
              if (!gclsrc || gclsrc.indexOf("aw") !== -1) {
                setCookie("gclid", trackingId, 90);
                
                // Enviar para dataLayer
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  'gclid': trackingId,
                  'event': 'gclid_captured'
                });
              }
            }

            // Preencher campos GCLID automaticamente
            document.addEventListener("DOMContentLoaded", function () {
              const gclidFields = document.getElementsByName("GCLID_FLD");
              for (var i = 0; i < gclidFields.length; i++) {
                gclidFields[i].value = trackingId || '';
              }
            });
          })();
        `
      }}
    />
  );
}

/**
 * CollectChat Integration
 */
interface CollectChatProps {
  apiKey?: string;
}

export function CollectChat({ apiKey }: CollectChatProps) {
  if (!apiKey) return null;

  return (
    <>
      <Script
        src="https://collect.chat/script.js"
        strategy="afterInteractive"
      />
      <Script
        id="collectchat-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.CollectChatAttributes = {
              apiKey: '${apiKey}',
              gclid: document.cookie.match(/(^|;)\\s*gclid=([^;]+)/) ? 
                     decodeURIComponent(document.cookie.match(/(^|;)\\s*gclid=([^;]+)/)[2]) : null
            };
          `
        }}
      />
    </>
  );
}

/**
 * Cookie Consent Banner
 */
interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const handleAccept = () => {
    // Salvar consentimento
    localStorage.setItem('cookie-consent', 'accepted');
    onAccept?.();
  };

  const handleDecline = () => {
    // Salvar recusa
    localStorage.setItem('cookie-consent', 'declined');
    onDecline?.();
  };

  // Verificar se já foi aceito
  if (typeof window !== 'undefined') {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            Utilizamos cookies para melhorar sua experiência em nosso site. 
            Ao continuar navegando, você concorda com nossa{' '}
            <a href="/politica-privacidade" className="text-brand-primary hover:underline">
              Política de Privacidade
            </a>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
