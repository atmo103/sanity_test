"use client";
export default function PanelError({ reset }) {
  return <div className="dida-panel dida-panel--loading"><div><p>No pudimos cargar el panel.</p><button className="dida-button" onClick={reset}>Volver a intentar</button></div></div>;
}
