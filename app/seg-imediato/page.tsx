"use client";

export default function Page() {
  return (
    <div style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
      <iframe
        title="Espelho Seguros Imediato"
        src="/mirror/"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        style={{ border: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
