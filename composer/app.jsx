/* Event composer prototype — app shell, state, tweaks. */
const { useState: useStateApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "surface": "map",
  "inlineSuggest": "people",
  "moreTimesStyle": "border",
  "recurring": "cadence",
  "density": "comfortable"
}/*EDITMODE-END*/;

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
  const requestOnly = ev.space && ev.space.requestOnly;
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
          {ev.space ? <> · {ev.space.name}</> : null}
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
  const mapMode = t.surface === "map";

  const [ev, setEv] = useStateApp({
    title: "Weekly sync", allDay: false, start: 14, end: 14.5,
    attendees: [ORGANIZER, PEOPLE_POOL[0], PEOPLE_POOL[1], PEOPLE_POOL[3], PEOPLE_POOL[4], PEOPLE_POOL[5], PEOPLE_POOL[9]],
    space: null, services: [], buffer: { on: false, before: 5, after: 5 },
    desc: "", isPrivate: false, repeatVal: "none", repeatEnds: "after", seriesOn: false, suggestion: null,
  });
  const set = (patch) => setEv(prev => ({ ...prev, ...patch }));

  const [open, setOpen] = useStateApp(true);
  const [picking, setPicking] = useStateApp(false);
  const [finding, setFinding] = useStateApp(false);
  const [success, setSuccess] = useStateApp(false);

  const pickRoom = (room) => { set({ space: room }); setPicking(false); };
  const reopen = () => {
    setSuccess(false); setOpen(true); setPicking(false); setFinding(false);
    setEv(prev => ({ ...prev, title: "", space: null, services: [], seriesOn: false, repeatVal: "none", suggestion: null }));
  };

  const panel = (open || success) ? (
    success
      ? <SuccessPanel ev={ev} mapMode={mapMode} onDone={reopen} />
      : <Composer ev={ev} set={set} tweaks={t} picking={picking} setPicking={setPicking}
          finding={finding} setFinding={setFinding}
          mapMode={mapMode} onPickRoom={pickRoom}
          onClose={() => setOpen(false)} onSubmit={() => { setSuccess(true); }} />
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
              ? <MapCanvas selectableRooms={picking} selectedRoomId={ev.space && ev.space.id} onPickRoom={pickRoom} dimmed={open && !picking} />
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

      {/* map mode: composer is a full-height sider flush to the top of the screen */}
      {mapMode && panel && (
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexShrink: 0 }}>{panel}</div>
      )}

      {/* Tweaks */}
      <TweaksPanel>
        <TweakField label="Surface" hint="Where the composer lives.">
          <Seg value={t.surface} onChange={(v) => setTweak("surface", v)}
            options={[{ value: "map", label: "Over map" }, { value: "standalone", label: "Standalone" }]} />
        </TweakField>
        <div style={{ height: 1, background: "#eceae7", margin: "4px 0 16px" }}></div>
        <TweakField label="Inline suggested times" hint="Surface a row of suggested times as guests are added. Pick where they appear.">
          <Seg value={t.inlineSuggest} onChange={(v) => setTweak("inlineSuggest", v)}
            options={[{ value: "off", label: "Off" }, { value: "datetime", label: "Date & time" }, { value: "people", label: "People" }]} />
        </TweakField>
        <TweakField label="Find availability style" hint="How the suggested-time pills are framed.">
          <Seg value={t.moreTimesStyle} onChange={(v) => setTweak("moreTimesStyle", v)}
            options={[{ value: "border", label: "Gradient border" }, { value: "panel", label: "Tinted panel" }]} />
        </TweakField>
        <TweakField label="Recurring events" hint="Repeat & manage a series.">
          <Seg value={t.recurring} onChange={(v) => setTweak("recurring", v)}
            options={[{ value: "dropdown", label: "Repeat dropdown" }, { value: "cadence", label: "Cadence builder" }]} />
        </TweakField>
        <div style={{ height: 1, background: "#eceae7", margin: "4px 0 16px" }}></div>
        <TweakField label="Density">
          <Seg value={t.density} onChange={(v) => setTweak("density", v)}
            options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]} />
        </TweakField>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
