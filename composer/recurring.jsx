/* FEATURE 2 — Recurring events & series management.
   Two variants:
     A. RepeatDropdown      — standard recurrence select + ends rule (safe)
     B. SeriesCadenceBuilder — day chips + month grid + per-occurrence room health (novel) */
const { useState: useStateR } = React;

const REPEAT_OPTS = [
  { id: "none",    label: "Does not repeat" },
  { id: "daily",   label: "Daily" },
  { id: "weekday", label: "Every weekday (Mon–Fri)" },
  { id: "weekly",  label: "Weekly on Monday" },
  { id: "biweekly",label: "Every 2 weeks on Monday" },
  { id: "monthly", label: "Monthly on the first Monday" },
];

/* ============ VARIANT A — Repeat dropdown ============ */
function RepeatDropdown({ value, onChange, ends, onEnds }) {
  const [open, setOpen] = useStateR(false);
  const cur = REPEAT_OPTS.find(o => o.id === value) || REPEAT_OPTS[0];
  const repeats = value !== "none";
  return (
    <div>
      <FieldLabel>Repeat</FieldLabel>
      <div style={{ position: "relative" }}>
        <Field icon="repeat" iconRight="angle-down" value={cur.label} onClick={() => setOpen(!open)} active={open} />
        {open && (
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, zIndex: 20, background: "#fff",
            border: "1px solid var(--color-border)", borderRadius: 8, boxShadow: "var(--shadow-md)", padding: 4,
            animation: "rcPop .14s ease both" }}>
            {REPEAT_OPTS.map(o => (
              <div key={o.id} onClick={() => { onChange(o.id); setOpen(false); }}
                style={{ padding: "8px 10px", borderRadius: 5, cursor: "pointer", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: o.id === value ? "var(--magenta-1)" : "transparent",
                  color: o.id === value ? "var(--color-primary)" : "var(--color-text)" }}
                onMouseEnter={(e) => { if (o.id !== value) e.currentTarget.style.background = "var(--gray-2)"; }}
                onMouseLeave={(e) => { if (o.id !== value) e.currentTarget.style.background = "transparent"; }}>
                {o.label}
                {o.id === value && <i className="fa-solid fa-check" style={{ fontSize: 11 }}></i>}
              </div>
            ))}
          </div>
        )}
      </div>
      {repeats && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Ends</span>
          <div style={{ display: "flex", border: "1px solid var(--color-border)", borderRadius: 4, overflow: "hidden" }}>
            {[["never", "Never"], ["after", "After 12"], ["on", "On date"]].map(([id, lbl]) => (
              <button key={id} onClick={() => onEnds(id)} style={{ padding: "6px 12px", fontSize: 13, cursor: "pointer",
                border: "none", borderRight: id !== "on" ? "1px solid var(--color-border)" : "none",
                background: ends === id ? "var(--color-link)" : "#fff", color: ends === id ? "#fff" : "var(--color-text)",
                fontWeight: ends === id ? 500 : 400, transition: "background .15s" }}>{lbl}</button>
            ))}
          </div>
        </div>
      )}
      {repeats && (
        <div style={{ marginTop: 10, fontSize: 12.5, color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: 7 }}>
          <i className="fa-solid fa-circle-info" style={{ color: "var(--blue-6)", fontSize: 12 }}></i>
          Edits to this event will ask whether to apply to this or the whole series.
        </div>
      )}
    </div>
  );
}

/* ============ VARIANT B — Series cadence builder ============ */
const DOW = [["S", 0], ["M", 1], ["T", 2], ["W", 3], ["T", 4], ["F", 5], ["S", 6]];
/* November 2026: Nov 1 = Sunday, 30 days */
const MONTH_DAYS = 30, MONTH_START_DOW = 0, MONTH_NAME = "November 2026";

function SeriesCadenceBuilder({ room, enabled, onToggle }) {
  const [days, setDays] = useStateR([1]);        // weekdays selected (Mon)
  const [count, setCount] = useStateR(12);       // occurrences
  const [rebooked, setRebooked] = useStateR(false);

  const toggleDay = (d) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());

  // chronological occurrence days within the month from the event start (day 2 = Mon Nov 2)
  const occ = [];
  for (let d = 2; d <= MONTH_DAYS && occ.length < count; d++) {
    const wd = (MONTH_START_DOW + (d - 1)) % 7;
    if (days.includes(wd)) occ.push(d);
  }
  // room health: room.series flags map to occurrences in order (1 = holds, 0 = conflict)
  const flagFor = (idx) => {
    if (!room) return 2; // neutral (no room yet)
    if (rebooked) return 1;
    return (room.series && room.series[idx] !== undefined) ? room.series[idx] : 1;
  };
  const conflicts = room && !rebooked ? occ.filter((_, i) => flagFor(i) === 0).length : 0;
  const holds = occ.length - conflicts;

  // build 5-week grid
  const weeks = [];
  let cells = [];
  for (let i = 0; i < MONTH_START_DOW; i++) cells.push(null);
  for (let d = 1; d <= MONTH_DAYS; d++) { cells.push(d); if (cells.length === 7) { weeks.push(cells); cells = []; } }
  if (cells.length) { while (cells.length < 7) cells.push(null); weeks.push(cells); }
  const occIndex = (d) => occ.indexOf(d);

  if (!enabled) {
    return (
      <button onClick={() => onToggle(true)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%",
        padding: "10px 12px", border: "1px dashed var(--color-border)", borderRadius: 6, background: "#fff",
        cursor: "pointer", color: "var(--color-text)", fontSize: 14 }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}>
        <i className="fa-solid fa-repeat" style={{ color: "var(--gray-7)", fontSize: 13 }}></i>
        Make this a recurring series
      </button>
    );
  }

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: 8, padding: 14, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text)" }}>Recurring series</span>
        <button onClick={() => onToggle(false)} style={{ background: "none", border: "none", cursor: "pointer",
          color: "var(--color-text-tertiary)", fontSize: 13 }}><i className="fa-solid fa-xmark"></i></button>
      </div>

      {/* cadence controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Repeats on</span>
        <div style={{ display: "flex", gap: 4 }}>
          {DOW.map(([lbl, d], i) => {
            const on = days.includes(d);
            const wk = d === 0 || d === 6;
            return (
              <button key={i} onClick={() => toggleDay(d)} title={["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d]}
                style={{ width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 12, fontWeight: 500,
                  border: "1px solid " + (on ? "var(--color-primary)" : "var(--color-border)"),
                  background: on ? "var(--color-primary)" : "#fff", color: on ? "#fff" : wk ? "var(--gray-6)" : "var(--color-text)",
                  transition: "all .12s" }}>{lbl}</button>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Ends after</span>
        <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--color-border)", borderRadius: 4 }}>
          <button onClick={() => setCount(Math.max(1, count - 1))} style={{ width: 28, height: 30, border: "none", background: "#fff", cursor: "pointer", color: "var(--gray-7)" }}>−</button>
          <span style={{ width: 30, textAlign: "center", fontSize: 14, fontWeight: 500 }}>{count}</span>
          <button onClick={() => setCount(Math.min(12, count + 1))} style={{ width: 28, height: 30, border: "none", background: "#fff", cursor: "pointer", color: "var(--gray-7)" }}>+</button>
        </div>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>occurrences</span>
      </div>

      {/* mini month grid */}
      <div style={{ background: "var(--gray-1)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text)", marginBottom: 8, textAlign: "center" }}>{MONTH_NAME}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
          {DOW.map(([lbl], i) => <div key={i} style={{ textAlign: "center", fontSize: 10, color: "var(--color-text-tertiary)", paddingBottom: 2 }}>{lbl}</div>)}
          {weeks.flat().map((d, i) => {
            if (!d) return <div key={i}></div>;
            const oi = occIndex(d);
            const isOcc = oi !== -1;
            const flag = isOcc ? flagFor(oi) : null;
            const bg = !isOcc ? "transparent" : flag === 0 ? "var(--yellow-1)" : flag === 1 ? "var(--magenta-1)" : "var(--blue-1)";
            const bd = !isOcc ? "transparent" : flag === 0 ? "var(--yellow-6)" : flag === 1 ? "var(--color-primary)" : "var(--blue-6)";
            return (
              <div key={i} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                borderRadius: 5, fontSize: 11, position: "relative",
                background: bg, border: "1px solid " + bd, fontWeight: isOcc ? 600 : 400,
                color: isOcc ? (flag === 0 ? "var(--yellow-7)" : flag === 1 ? "var(--color-primary)" : "var(--blue-6)") : "var(--gray-6)" }}>
                {d}
                {isOcc && flag === 0 && <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 7, position: "absolute", bottom: 2 }}></i>}
              </div>
            );
          })}
        </div>
      </div>

      {/* series health */}
      {room ? (
        <div style={{ borderRadius: 8, border: "1px solid " + (conflicts ? "var(--yellow-6)" : "var(--green-6)"),
          background: conflicts ? "var(--yellow-1)" : "var(--green-1)", padding: "10px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i className={"fa-solid fa-" + (conflicts ? "triangle-exclamation" : "circle-check")}
              style={{ color: conflicts ? "var(--yellow-7)" : "var(--green-7)", fontSize: 13 }}></i>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text)" }}>
              {conflicts ? `${holds} of ${occ.length} hold ${room.name}` : `All ${occ.length} occurrences hold ${room.name}`}
            </span>
          </div>
          {conflicts > 0 && (
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                {conflicts} occurrence{conflicts > 1 ? "s" : ""} conflict — {room.name} is booked.
              </span>
              <AIChip onClick={() => setRebooked(true)} icon="wand-magic-sparkles">Auto-rebook</AIChip>
            </div>
          )}
          {rebooked && (
            <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--green-7)", display: "flex", alignItems: "center", gap: 7 }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: 12 }}></i>
              Conflicts moved to <strong style={{ fontWeight: 600 }}>Star Dust</strong> — nearest matching space.
            </div>
          )}
        </div>
      ) : (
        <div style={{ fontSize: 12.5, color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: 7 }}>
          <i className="fa-solid fa-circle-info" style={{ color: "var(--blue-6)", fontSize: 12 }}></i>
          Add a space to check room availability across the series.
        </div>
      )}
    </div>
  );
}

Object.assign(window, { RepeatDropdown, SeriesCadenceBuilder });
