"use client";
import { useEffect, useRef, useState } from "react";
import { emptyRecord, imageUrl, recordTitle, sections } from "../lib/cms/model";
import PanelFields from "./PanelFields";

function Icon({ name, ...props }) {
  const paths = { arrow: "M4 12h16m-6-6 6 6-6 6", plus: "M12 5v14M5 12h14", menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6", logout: "M9 5H5v14h4m4-13 6 6-6 6m-4-6h10", refresh: "M20 7v5h-5m4-1a7 7 0 1 0-1 6" };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.arrow} /></svg>;
}
async function api(path, options = {}) {
  const response = await fetch(`/api/panel/${path}`, { ...options, cache: "no-store", headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...options.headers } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "No pudimos completar la operación. Intenta de nuevo.");
  return result;
}
function Confirmation({ data, close }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className="dida-dialog" aria-labelledby="dida-confirm-title" onCancel={close}>
    <h2 id="dida-confirm-title">{data.title}</h2><p>{data.message}</p>
    <div className="dida-dialog__actions"><button className="dida-button" autoFocus onClick={close}>Cancelar</button><button className="dida-button dida-button--primary" onClick={() => { close(); data.run(); }}>{data.label}</button></div>
  </dialog>;
}
export default function Panel({ authenticated, configured, connected }) {
  const [signedIn, setSignedIn] = useState(authenticated);
  const [password, setPassword] = useState("");
  const [section, setSection] = useState("testimonials");
  const [records, setRecords] = useState([]);
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(authenticated);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline);
  const list = records.filter((record) => record.kind === section);
  const headingRef = useRef(null);

  function choose(record) { setDraft(record ? structuredClone(record) : null); setBaseline(record ? structuredClone(record) : null); setError(""); setNotice(""); }
  function apply(result, selectedId, kind = section) {
    setRecords(result.records); setInitialized(result.initialized);
    choose(result.records.find((r) => r._id === selectedId && r.kind === kind) || result.records.find((r) => r.kind === kind) || null);
  }
  useEffect(() => {
    if (!signedIn || !connected) { setLoading(false); return; }
    const controller = new AbortController();
    api("content", { signal: controller.signal }).then((result) => {
      setRecords(result.records); setInitialized(result.initialized);
      const first = result.records.find((r) => r.kind === "testimonials") || null;
      setDraft(first); setBaseline(first); setLoading(false);
    }).catch((err) => { if (err.name !== "AbortError") { setError(err.message); setLoading(false); } });
    return () => controller.abort();
  }, [signedIn, connected]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function protect(run) {
    if (dirty) setConfirmation({ title: "¿Descartar los cambios?", message: "Hay cambios sin guardar en este registro.", label: "Descartar cambios", run });
    else run();
  }
  function navigate(kind) {
    protect(() => { setSection(kind); setMenuOpen(false); choose(records.find((r) => r.kind === kind)); });
  }
  function select(id) { protect(() => choose(records.find((r) => r._id === id))); }
  function create() { protect(() => { choose(emptyRecord(section, list.length ? Math.max(...list.map((r) => r.order)) + 1 : 0)); headingRef.current?.focus(); }); }
  async function login(event) {
    event.preventDefault(); setBusy("login"); setError("");
    try { await api("session", { method: "POST", body: JSON.stringify({ password }) }); setPassword(""); setLoading(true); setSignedIn(true); }
    catch (err) { setError(err.message); } finally { setBusy(""); }
  }
  async function logout() {
    protect(async () => {
      setBusy("logout"); setError("");
      try { await api("session", { method: "DELETE" }); choose(null); setSignedIn(false); setRecords([]); }
      catch (err) { setError(err.message); } finally { setBusy(""); }
    });
  }
  async function reload() {
    protect(async () => { setBusy("reload"); setError(""); try { apply(await api("content"), draft?._id); setNotice("Datos actualizados."); } catch (err) { setError(err.message); } finally { setBusy(""); } });
  }
  async function initialize(reset = false) {
    setBusy(reset ? "reset" : "initialize"); setError("");
    try {
      const result = await api(reset ? "reset" : "initialize", { method: "POST", body: JSON.stringify(reset ? { confirmation: "RESTABLECER" } : {}) });
      apply(result, null); setNotice(reset ? "La prueba volvió a su contenido inicial." : "Contenido cargado. Ya puedes editar y publicar.");
    } catch (err) { setError(err.message); } finally { setBusy(""); }
  }
  async function saveRecord(record) {
    return api("record", { method: "POST", body: JSON.stringify({ action: "save", record }) });
  }
  async function submit(action) {
    if (!draft || busy) return;
    let previewWindow;
    if (action === "preview") {
      previewWindow = window.open("about:blank", "dida-preview");
      if (previewWindow) previewWindow.opener = null;
    }
    setBusy(action); setError(""); setNotice("");
    try {
      const saved = await saveRecord(draft);
      const record = saved.records.find((r) => r._id === saved.selectedId);
      apply(saved, saved.selectedId);
      if (action === "publish") {
        const published = await api("record", { method: "POST", body: JSON.stringify({ action: "publish", record }) });
        apply(published, published.selectedId); setNotice("Publicado. El cambio ya está disponible en el sitio.");
      } else if (action === "preview") {
        const url = `/panel/vista-previa?section=${section}${record?._id ? `&record=${encodeURIComponent(record._id)}` : ""}#${section === "news" ? "home-news-title" : section === "clients" ? "clientes" : "testimonios"}`;
        if (previewWindow) previewWindow.location.href = url;
        setNotice(previewWindow ? "Borrador guardado. Vista previa abierta en otra pestaña." : "Borrador guardado. Abre la vista previa con el enlace de abajo.");
      } else setNotice("Borrador guardado. Aún no cambia el sitio público.");
    } catch (err) { previewWindow?.close(); setError(err.message); } finally { setBusy(""); }
  }
  async function upload(name, file) {
    if (file.size > 4 * 1024 * 1024) { setError("La imagen debe pesar como máximo 4 MB."); return; }
    setBusy("upload"); setError(""); setNotice("");
    const form = new FormData(); form.append("file", file);
    try { const result = await api("upload", { method: "POST", body: form }); setDraft((old) => ({ ...old, [name]: result.image })); setNotice("Imagen cargada. Guarda o publica el registro para usarla."); }
    catch (err) { setError(err.message); } finally { setBusy(""); }
  }
  function remove() {
    setConfirmation({ title: "¿Eliminar este registro?", message: "Se quitará del panel y del sitio público. Esta acción no se puede deshacer.", label: "Eliminar", run: async () => {
      setBusy("delete"); setError("");
      try { const result = await api("record", { method: "POST", body: JSON.stringify({ action: "delete", record: baseline }) }); apply(result, null); setNotice("Registro eliminado."); }
      catch (err) { setError(err.message); } finally { setBusy(""); }
    } });
  }
  const working = Boolean(busy);
  if (!signedIn) return <main className="dida-panel dida-login" lang="es">
    <a className="dida-brand" href="/" aria-label="DidaControl, ir al sitio"><span className="dida-brand__mark">D<span>·</span></span>DidaControl</a>
    <form className="dida-login__card" onSubmit={login}>
      <span className="dida-eyebrow">PANEL DE CONTENIDO</span><h1>Tu contenido,<br /><span>en tus manos.</span></h1><p>Actualiza testimonios, clientes y noticias desde un solo lugar.</p>
      {configured ? <><label className="dida-field"><span>Clave de acceso</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required maxLength={256} autoFocus /></label><button className="dida-button dida-button--primary" disabled={working}>{working ? "Entrando…" : "Entrar al panel"}<Icon name="arrow" /></button></> : <div className="dida-message dida-message--error">Falta configurar la clave de acceso en el servidor. Consulta INICIO_PANEL.md incluido con los archivos.</div>}
      {error && <p className="dida-message dida-message--error" role="alert">{error}</p>}
      <a className="dida-login__back" href="/">Volver al sitio <Icon name="arrow" /></a>
    </form><p className="dida-login__footer">DidaControl · Administración de contenido</p>
  </main>;

  return <div className="dida-panel dida-workspace" lang="es">
    <a className="dida-skip" href="#dida-main">Ir al contenido</a>
    <aside className={`dida-sidebar${menuOpen ? " is-open" : ""}`}>
      <a className="dida-brand" href="/" target="_blank" rel="noopener"><span className="dida-brand__mark">D<span>·</span></span>DidaControl</a><p className="dida-eyebrow">Panel de contenido</p>
      <nav aria-label="Secciones de contenido">{Object.entries(sections).map(([key, value]) => <button key={key} className={`dida-nav-item${section === key ? " is-active" : ""}`} onClick={() => navigate(key)} disabled={working} aria-current={section === key ? "page" : undefined}><span aria-hidden="true" />{value.title}<small>{records.filter((r) => r.kind === key).length}</small></button>)}</nav>
      <div className="dida-sidebar__bottom"><p>Haz un cambio.<br />Mira cómo cobra vida.</p><button className="dida-text-button" onClick={() => setConfirmation({ title: "¿Restablecer la prueba?", message: "Se borrarán los cambios de esta demostración y volverán los testimonios, clientes y noticias iniciales.", label: "Restablecer", run: () => initialize(true) })} disabled={working || !initialized}>Restablecer prueba</button><button className="dida-logout" onClick={logout} disabled={working}><Icon name="logout" />Cerrar sesión</button></div>
    </aside>
    <div className="dida-main-shell">
      <header className="dida-topbar"><a className="dida-brand dida-brand--mobile" href="/" target="_blank" rel="noopener">DidaControl</a><span className="dida-topbar__label">CONTENIDO / {sections[section].title}</span><a href="/" target="_blank" rel="noopener">Ver sitio<Icon name="arrow" /></a><button className="dida-menu-toggle" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button></header>
      <main id="dida-main" className="dida-main">
        <div className="dida-mobile-section"><label htmlFor="dida-section">Sección</label><select id="dida-section" value={section} onChange={(e) => navigate(e.target.value)} disabled={working}>{Object.entries(sections).map(([key, value]) => <option value={key} key={key}>{value.title}</option>)}</select></div>
        <div className="dida-page-heading"><div><p className="dida-eyebrow">Contenido</p><h1>{sections[section].title}</h1></div><button className="dida-button dida-button--primary" onClick={create} disabled={working || !initialized}><Icon name="plus" />{`${section === "news" ? "Nueva" : "Nuevo"} ${sections[section].singular}`}</button></div>
        {!connected && <div className="dida-message dida-message--error" role="alert">Falta configurar el token de Sanity en el servidor. Consulta INICIO_PANEL.md.</div>}
        {error && <div className="dida-message dida-message--error" role="alert">{error}<button className="dida-text-button" onClick={reload} disabled={working}>Recargar datos</button></div>}
        {notice && <p className="dida-message" role="status">{notice}</p>}
        {loading ? <div className="dida-empty" role="status">Cargando contenido…</div> : connected && !initialized && !error ? <div className="dida-empty"><p className="dida-eyebrow">Todo listo para empezar</p><h2>Tu contenido empieza aquí.</h2><p>Carga los testimonios, logos y noticias que ya tiene el Home para empezar a editarlos.</p><button className="dida-button dida-button--primary" onClick={() => initialize()} disabled={working}>{working ? "Cargando…" : "Cargar contenido inicial"}</button></div> : initialized && <div className="dida-editor-layout">
          <div className="dida-record-list">
            <div className="dida-record-list__heading"><span className="dida-eyebrow">{list.length} REGISTROS</span><button className="dida-icon-button" onClick={reload} disabled={working} aria-label="Recargar datos"><Icon name="refresh" /></button></div>
            <label className="dida-record-select"><span>Seleccionar registro</span><select value={draft?._id || "new"} onChange={(e) => select(e.target.value)} disabled={working}><option value="new" disabled>{draft && !draft._id ? "Nuevo registro" : "Elige un registro"}</option>{list.map((r) => <option value={r._id} key={r._id}>{recordTitle(r)}</option>)}</select></label>
            <div className="dida-record-cards">{list.map((record) => <button key={record._id} className={`dida-record-card${draft?._id === record._id ? " is-selected" : ""}`} onClick={() => select(record._id)} disabled={working} aria-pressed={draft?._id === record._id}>
              <span className={`dida-record-card__image${section === "testimonials" ? " is-portrait" : ""}`}>{imageUrl(record.portrait || record.logo || record.image) ? <img src={imageUrl(record.portrait || record.logo || record.image)} alt="" /> : <span>↗</span>}</span><span className="dida-record-card__copy"><strong>{recordTitle(record)}</strong><small>{record.hasDraft ? "Borrador" : record.visible === false ? "Oculto" : "Publicado"}</small></span><Icon name="arrow" />
            </button>)}</div>
            <p className="dida-record-list__hint">Guarda para continuar después.<br />Publica para actualizar el sitio.</p>
          </div>
          {draft ? <form className="dida-editor" onSubmit={(e) => { e.preventDefault(); submit("publish"); }}>
            <div className="dida-editor__heading"><h2 tabIndex={-1} ref={headingRef}>Editar {sections[section].singular}</h2><span className="dida-status"><i className={dirty ? "is-dirty" : ""} />{dirty ? "Sin guardar" : draft.hasDraft || !draft._id ? "Borrador" : "Publicado"}</span></div>
            <fieldset disabled={working}><PanelFields record={draft} onChange={(name, value) => setDraft((old) => ({ ...old, [name]: value }))} onUpload={upload} busy={working} /></fieldset>
            <footer className="dida-editor__actions"><button type="button" className="dida-delete" onClick={remove} disabled={working || !draft._id}>Eliminar</button><div><button className="dida-button" type="button" disabled={working} onClick={() => submit("save")}>Guardar borrador</button><button className="dida-button" type="button" disabled={working} onClick={() => submit("preview")}>Vista previa</button><button className="dida-button dida-button--primary" type="submit" disabled={working}>{working ? busy === "upload" ? "Subiendo…" : "Guardando…" : "Publicar"}</button></div></footer>
            <p className="dida-help dida-editor__help">* Campos obligatorios para publicar. <a href="/panel/vista-previa" target="_blank" rel="noopener">Abrir vista previa guardada ↗</a></p>
          </form> : <div className="dida-empty"><h2>Aún no hay {sections[section].title.toLowerCase()}.</h2><p>Crea el primer registro para verlo aquí.</p><button className="dida-button dida-button--primary" onClick={create}><Icon name="plus" />Crear {sections[section].singular}</button></div>}
        </div>}
      </main>
    </div>
    {confirmation && <Confirmation data={confirmation} close={() => setConfirmation(null)} />}
  </div>;
}
