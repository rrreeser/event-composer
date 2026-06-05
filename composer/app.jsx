/* Event composer prototype — app shell, state, tweaks. */
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "entryPoint": "direct-url"
}/*EDITMODE-END*/;

const ENTRY_CONFIGS = {
  "direct-url": {
    title: "", attendees: [ORGANIZER], spaces: [],
  },
  "edit-event": {
    title: "Weekly sync",
    attendees: [ORGANIZER, PEOPLE_POOL[0], PEOPLE_POOL[1], PEOPLE_POOL[3], PEOPLE_POOL[4]],
    spaces: [ROOMS[0]],
  },
  "space-first": {
    title: "", attendees: [ORGANIZER], spaces: [ROOMS[1]],
  },
};

/* Small segmented control for the tweak panel (descriptive labels → machine values). */
function Seg({ value, options, onChange }) {
  return (
    <div style={{ display: "flex", background: "#f0eeec", borderRadius: 8, padding: 3, gap: 2 }}>
      {options.map(o => {
        const on = value === o.value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            style={{ flex: 1, padding: "7px 8px", borderRadius: 6, border: "none", cursor: "pointer",
              background: on ? "#fff" : "transparent", color: on ? "#1c1c1c" : "#6b6256",
              boxShadow: on ? "0 1px 2px rgba(0,0,0,.12)" : "none", fontWeight: on ? 600 : 500,
              fontSize: 12, lineHeight: 1.3, transition: "all .15s", fontFamily: "var(--font-sans)" }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
function TweakField({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#3a342c", marginBottom: 2 }}>{label}</div>
      {hint && <div style={{ fontSize: 11.5, color: "#9a8f80", marginBottom: 7, lineHeight: 1.4 }}>{hint}</div>}
      {!hint && <div style={{ height: 7 }}></div>}
      {children}
    </div>
  );
}

function SuccessPanel({ ev, mapMode, onDone }) {
  const requestOnly = ev.spaces && ev.spaces.some(s => s.requestOnly);
  return (
    <div style={{ width: 420, flexShrink: 0, height: "100%", background: "#fff",
      border: !mapMode ? "1px solid var(--color-border)" : "none", borderLeft: "1px solid var(--color-border)",
      borderRadius: !mapMode ? 12 : 0, overflow: "hidden", display: "flex", flexDirection: "column",
      boxShadow: !mapMode ? "var(--shadow-lg)" : "-8px 0 24px rgba(0,0,0,.06)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: requestOnly ? "var(--yellow-1)" : "var(--green-1)",
          border: "1px solid " + (requestOnly ? "var(--yellow-6)" : "var(--green-6)"),
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
          animation: "rcPop .3s ease both" }}>
          <i className={"fa-solid fa-" + (requestOnly ? "paper-plane" : "circle-check")}
            style={{ fontSize: 26, color: requestOnly ? "var(--yellow-7)" : "var(--green-7)" }}></i>
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text)", marginBottom: 6 }}>
          {requestOnly ? "Request sent" : ev.seriesOn || ev.repeatVal !== "none" ? "Series created" : "Event created"}
        </div>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)", maxWidth: 280, marginBottom: 22, lineHeight: 1.5 }}>
          <strong style={{ color: "var(--color-text)", fontWeight: 500 }}>{ev.title || "Untitled event"}</strong>
          {ev.spaces && ev.spaces.length > 0 ? <> · {ev.spaces.map(s => s.name).join(', ')}</> : null}
          <br />{fmtTime(ev.start)} – {fmtTime(ev.end)} · Nov 2
          {(ev.seriesOn || ev.repeatVal !== "none") && <><br /><span style={{ fontSize: 12.5, color: "var(--color-text-tertiary)" }}>Repeats weekly · 12 occurrences</span></>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn type="secondary" onClick={onDone}>Create another</Btn>
          <Btn type="primary" onClick={onDone}>View event</Btn>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const mapMode = true;

  const [ev, setEv] = useStateApp({
    title: "", allDay: false, start: 14, end: 14.5,
    attendees: [ORGANIZER],
    spaces: [], services: [], buffer: { on: false, before: 5, after: 5 },
    desc: "", isPrivate: false, repeatVal: "none", repeatEnds: "after", seriesOn: false, suggestion: null,
  });
  const set = (patch) => setEv(prev => ({ ...prev, ...patch }));

  const [open, setOpen] = useStateApp(true);
  const [picking, setPicking] = useStateApp(false);
  const [finding, setFinding] = useStateApp(false);
  const [success, setSuccess] = useStateApp(false);
  const [viewingSpace, setViewingSpace] = useStateApp(null);
  const [activeResource, setActiveResource] = useStateApp("spaces");

  useEffectApp(() => {
    const config = ENTRY_CONFIGS[t.entryPoint];
    if (!config) return;
    setEv(prev => ({ ...prev, ...config, services: [], buffer: { on: false, before: 5, after: 5 } }));
    setOpen(true);
    setPicking(false);
    setFinding(false);
    setSuccess(false);
    setViewingSpace(null);
    setActiveResource("spaces");
  }, [t.entryPoint]);

  // Map click → view space details
  const viewRoom = (room) => { setViewingSpace(room); setActiveResource("spaces"); };

  // Space details footer action (add or remove)
  const handleSpaceAction = () => {
    const alreadyAdded = ev.spaces.some(s => s.id === viewingSpace.id);
    if (alreadyAdded) {
      const next = ev.spaces.filter(s => s.id !== viewingSpace.id);
      set({ spaces: next, ...(next.length === 0 ? { services: [], buffer: { on: false, before: 5, after: 5 } } : {}) });
    } else {
      set({ spaces: [...ev.spaces, viewingSpace] });
      setOpen(true);
    }
    setViewingSpace(null);
  };

  // SpacesList (inside composer) direct add/remove
  const pickRoom = (room) => {
    const isSelected = ev.spaces.some(s => s.id === room.id);
    set({ spaces: isSelected ? ev.spaces.filter(s => s.id !== room.id) : [...ev.spaces, room] });
    setPicking(false);
  };
  const reopen = () => {
    setSuccess(false); setOpen(true); setPicking(false); setFinding(false); setViewingSpace(null);
    setActiveResource("spaces");
    setEv(prev => ({ ...prev, title: "", spaces: [], services: [], seriesOn: false, repeatVal: "none", suggestion: null }));
  };

  const panel = viewingSpace ? (
    <SpaceDetailsPanel
      room={viewingSpace}
      alreadyAdded={ev.spaces.some(s => s.id === viewingSpace.id)}
      composerOpen={open}
      onBack={() => setViewingSpace(null)}
      onAdd={handleSpaceAction}
      onRemove={handleSpaceAction} />
  ) : (open || success) ? (
    success
      ? <SuccessPanel ev={ev} mapMode={mapMode} onDone={reopen} />
      : <Composer ev={ev} set={set} tweaks={t} picking={picking} setPicking={setPicking}
          finding={finding} setFinding={setFinding}
          mapMode={mapMode} onPickRoom={pickRoom}
          onClose={() => { setOpen(false); setViewingSpace(null); setActiveResource(null); set({ spaces: [], services: [], buffer: { on: false, before: 5, after: 5 } }); }} onSubmit={() => { setSuccess(true); }} />
  ) : null;

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--color-bg-layout)", overflow: "hidden" }}>
      <Sidebar onCreate={() => {setSuccess(false);setOpen(true);}} />
      {/* main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar onCreate={() => { setSuccess(false); setOpen(true); }} composerOpen={open} />
        <div style={{ flex: 1, position: "relative", minHeight: 0, display: "flex",
          justifyContent: mapMode ? "flex-start" : "center", alignItems: "center" }}>
          {/* canvas */}
          <div style={mapMode ? { flex: 1, position: "relative", minWidth: 0, alignSelf: "stretch" } : { position: "absolute", inset: 0 }}>
            {mapMode
              ? <MapCanvas selectableRooms={picking} selectedRoomIds={ev.spaces.map(s => s.id)} onPickRoom={viewRoom} composerOpen={open || !!viewingSpace} activeResource={activeResource} onResourceChange={setActiveResource} eventStart={ev.start} eventEnd={ev.end} />
              : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "radial-gradient(circle at 50% 0%, #fff, var(--color-bg-layout))" }}>
                  {!open && !success && (
                    <div style={{ textAlign: "center", color: "var(--color-text-tertiary)" }}>
                      <i className="fa-regular fa-calendar-plus" style={{ fontSize: 38, marginBottom: 14, color: "var(--gray-5)" }}></i>
                      <div style={{ fontSize: 15 }}>Press <strong style={{ color: "var(--color-text)" }}>Create event</strong> to start composing.</div>
                    </div>
                  )}
                </div>}
          </div>
          {/* standalone: composer floats centered inside the stage */}
          {!mapMode && panel && (
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0, padding: "24px 32px", zIndex: 2, maxHeight: "100%" }}>
              <div style={{ height: "min(880px, 100%)", display: "flex" }}>{panel}</div>
            </div>
          )}
        </div>
      </div>

      {/* map mode: right sider — composer/success when open, blank placeholder when closed */}
      {mapMode && (
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexShrink: 0 }}>
          {panel || <div style={{ width: 420, flexShrink: 0, height: "100%", background: "#fff",
            borderLeft: "1px solid var(--color-border)", boxShadow: "-8px 0 24px rgba(0,0,0,.06)" }} />}
        </div>
      )}

      {/* Tweaks */}
      <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 9999,
        width: 240, background: "rgba(250,249,247,.95)", borderRadius: 12, padding: "12px 14px",
        boxShadow: "0 4px 24px rgba(0,0,0,.14)", border: "1px solid rgba(0,0,0,.08)",
        fontFamily: "var(--font-sans)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase",
          color: "#9a8f80", marginBottom: 10 }}>Tweaks</div>
        <TweakField label="Entry point" hint="Starting state for the event composer.">
          <Seg value={t.entryPoint} onChange={(v) => setTweak("entryPoint", v)}
            options={[
              { value: "direct-url", label: "Direct URL" },
              { value: "edit-event", label: "Edit event" },
              { value: "space-first", label: "Space first" },
            ]} />
        </TweakField>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
