"use client";
import { useRef } from "react";
import { imageUrl } from "../lib/cms/model";

export function TextField({ label, name, value, onChange, required = false, multiline = false, maxLength, type = "text", wide = false, rows = 4 }) {
  const id = `dida-${name}`;
  const shared = { id, name, value: value ?? "", onChange: (event) => onChange(name, event.target.value), maxLength, "aria-required": required || undefined };
  return <div className={`dida-field${wide ? " dida-field--wide" : ""}`}>
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    {multiline ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} min={type === "number" ? 0 : undefined} max={type === "number" ? 9999 : undefined} step={type === "number" ? 1 : undefined} />}
  </div>;
}
export function ImageField({ label, name, value, onUpload, busy, portrait = false, required = false }) {
  const ref = useRef(null);
  const url = imageUrl(value);
  return <div className="dida-field dida-image-field">
    <label htmlFor={`dida-${name}`}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    <div className="dida-image-field__row">
      <div className={`dida-image-field__art${portrait ? " dida-image-field__art--portrait" : ""}`}>
        {url ? <img src={url} alt={label} /> : <span aria-hidden="true">＋</span>}
      </div>
      <div>
        <input ref={ref} id={`dida-${name}`} type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" className="dida-file" disabled={busy} onChange={(event) => {
          const file = event.target.files?.[0]; if (file) onUpload(name, file); event.target.value = "";
        }} />
        <button className="dida-text-button" type="button" disabled={busy} onClick={() => ref.current?.click()}>{url ? "Cambiar imagen" : "Subir imagen"}</button>
        <p className="dida-help">JPG, PNG, WebP, AVIF o SVG · Máx. 4 MB</p>
      </div>
    </div>
  </div>;
}
export default function PanelFields({ record, onChange, onUpload, busy }) {
  const text = (label, name, options = {}) => <TextField key={name} label={label} name={name} value={record[name]} onChange={onChange} {...options} />;
  const picture = (label, name, options = {}) => <ImageField key={name} label={label} name={name} value={record[name]} onUpload={onUpload} busy={busy} {...options} />;
  return <div className="dida-fields">
    {record.kind === "testimonials" && <>
      {text("Nombre", "person", { required: true, maxLength: 100 })}
      {text("Cargo", "role", { required: true, maxLength: 160 })}
      {text("Empresa", "company", { required: true, maxLength: 120, wide: true })}
      {picture("Fotografía", "portrait", { portrait: true, required: true })}
      {picture("Logo de empresa", "logo", { required: true })}
      {text("Testimonio", "quoteMuted", { multiline: true, maxLength: 2000, wide: true })}
      {text("Frase destacada", "quoteBright", { multiline: true, maxLength: 1200, wide: true, rows: 3 })}
    </>}
    {record.kind === "clients" && <>
      {text("Nombre del cliente", "name", { required: true, maxLength: 160, wide: true })}
      {picture("Logo", "logo", { required: true })}
      <p className="dida-help dida-field--wide">El logo se muestra en blanco en la página de inicio. Para un mejor resultado, usa una imagen con fondo transparente.</p>
    </>}
    {record.kind === "news" && <>
      {text("Titular", "title", { required: true, maxLength: 240, wide: true, multiline: true, rows: 2 })}
      {text("Categoría", "category", { required: true, maxLength: 80 })}
      {text("Fecha", "date", { required: true, type: "date" })}
      {picture("Imagen de la noticia", "image", { required: true })}
      {text("Descripción de la imagen", "alt", { maxLength: 240 })}
      {text("Contenido", "content", { multiline: true, maxLength: 16000, wide: true, rows: 6 })}
      <p className="dida-help dida-field--wide">El contenido se guarda en el CMS. Esta prueba muestra las noticias en el Home, sin páginas de artículo.</p>
      <label className="dida-check dida-field--wide"><input type="checkbox" checked={record.featured === true} onChange={(event) => onChange("featured", event.target.checked)} />Destacar con imagen en el Home</label>
    </>}
    {text("Orden", "order", { type: "number" })}
    <div className="dida-field dida-visibility"><label className="dida-check"><input type="checkbox" checked={record.visible !== false} onChange={(event) => onChange("visible", event.target.checked)} />Visible en el Home</label><p className="dida-help">Los cambios aparecen al publicar.</p></div>
  </div>;
}
