/* Robin app chrome: navy Sidebar, map TopBar, and the interactive floor MapCanvas. */
const { useState: useStateCh } = React;

function Sidebar({ onCreate }) {
  const items = [
    { id: "Map", icon: "location-dot", active: true },
    { id: "Schedule", icon: "calendar" },
    { id: "People", icon: "users" },
    { id: "Meeting spaces", icon: "door-open" },
    { id: "Workplace", icon: "building", caret: true },
    { id: "Analytics", icon: "chart-line" },
    { id: "Manage", icon: "gear" },
  ];
  const footer = [
    { id: "Support", icon: "circle-question" },
    { id: "Feedback", icon: "message" },
    { id: "Notifications", icon: "bell", badge: 3 },
  ];
  const Item = ({ it }) => {
    const [h, setH] = useStateCh(false);
    const on = it.active;
    return (
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} title={it.id}
        style={{ display: "flex", alignItems: "center", gap: 12, height: 40, padding: "0 12px",
          borderRadius: 6, cursor: "pointer", position: "relative",
          color: on ? "#fff" : "rgba(255,255,255,.65)",
          background: on ? "rgba(255,255,255,.10)" : h ? "rgba(255,255,255,.05)" : "transparent",
          fontSize: 14, fontWeight: on ? 500 : 400, transition: "background .15s, color .15s" }}>
        <i className={"fa-solid fa-" + it.icon} style={{ width: 18, textAlign: "center", fontSize: 15 }}></i>
        <span style={{ flex: 1 }}>{it.id}</span>
        {it.caret && <i className="fa-solid fa-angle-down" style={{ fontSize: 11, opacity: .6 }}></i>}
        {it.badge && <span style={{ position: "absolute", top: 7, right: 12, background: "var(--red-6)", color: "#fff",
          fontSize: 10, fontWeight: 600, borderRadius: 10, padding: "0 5px" }}>{it.badge}</span>}
      </div>
    );
  };
  return (
    <div style={{ width: 220, background: "var(--navy)", height: "100%", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 64, padding: "0 16px" }}>
        <svg width="26" height="21" viewBox="0 0 19.281 15.363" style={{ flexShrink: 0 }}><path fill="#fff" fillRule="evenodd" d="M 4.552 4.545 C 6.33 1.074 9.889 -1.164 14.006 0.638 C 14.017 0.643 15.547 1.341 16.579 2.992 C 16.848 3.423 17.26 3.746 17.74 3.912 L 18.033 4.013 L 19.281 4.445 C 19.067 4.631 18.854 4.817 18.64 5.003 C 18.263 5.33 17.973 5.714 17.755 6.165 C 17.63 6.423 17.504 6.715 17.457 7.001 C 17.412 7.269 17.379 7.542 17.327 7.811 C 17.206 8.444 17.036 9.068 16.801 9.67 C 15.577 12.246 13.26 14.281 10.281 15.047 C 6.353 16.057 2.37 14.576 0 11.592 C 0.622 11.283 1.334 10.811 1.981 10.108 C 2.216 10.288 2.457 10.462 2.707 10.625 C 4.215 11.612 5.815 12.133 7.298 12.133 C 7.584 12.133 7.868 12.114 8.144 12.075 C 10.242 11.775 12.008 10.204 12.343 8.341 C 12.721 6.239 11.281 3.971 9.257 3.474 C 7.807 2.969 6.521 3.595 5.276 4.202 C 5.037 4.318 4.794 4.437 4.552 4.545 Z M 14.333 3.082 C 14.001 3.082 13.732 3.351 13.731 3.683 C 13.731 4.015 14.001 4.286 14.333 4.286 C 14.665 4.286 14.936 4.015 14.936 3.683 C 14.935 3.351 14.665 3.082 14.333 3.082 Z"></path></svg>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: "-.02em" }}>Robin</span>
        <i className="fa-solid fa-angle-left" style={{ marginLeft: "auto", color: "rgba(255,255,255,.5)", fontSize: 13 }}></i>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "4px", flex: 1 }}>
        {items.map(it => <Item key={it.id} it={it} />)}
      </div>
      <div style={{ borderTop: "1px solid var(--navy-border)", padding: "8px 4px 4px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ padding: "4px 8px 8px" }}>
          <Btn type="primary" icon="plus" block size="large" onClick={onCreate}>Create event</Btn>
        </div>
        {footer.map(it => <Item key={it.id} it={it} />)}
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 48, padding: "0 12px", cursor: "pointer" }}>
          <Avatar name="Tiffany Yu" size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>Tiffany Yu</div>
            <div style={{ color: "rgba(255,255,255,.55)", fontSize: 11 }}>Boston HQ</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, label, value, caret = true }) {
  const [h, setH] = useStateCh(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 36, padding: "0 12px",
        border: "1px solid " + (h ? "var(--color-primary)" : "var(--color-border)"), borderRadius: 4,
        background: "#fff", cursor: "pointer", transition: "border-color .15s", whiteSpace: "nowrap" }}>
      {icon && <i className={"fa-solid fa-" + icon} style={{ color: "var(--gray-7)", fontSize: 13 }}></i>}
      {label && <span style={{ fontSize: 14, color: "var(--gray-7)" }}>{label}</span>}
      <span style={{ fontSize: 14, color: "var(--color-text)", fontWeight: 500 }}>{value}</span>
      {caret && <i className="fa-solid fa-angle-down" style={{ color: "var(--gray-7)", fontSize: 11 }}></i>}
    </div>
  );
}

function TopBar({ onCreate, composerOpen }) {
  return (
    <div style={{ height: 64, borderBottom: "1px solid var(--color-border)", background: "#fff",
      display: "flex", alignItems: "center", gap: 12, padding: "0 24px", flexShrink: 0, zIndex: 5 }}>
      <Pill icon="building" value="54 State St." />
      <Pill value="Floor 1" />
      <div style={{ width: 1, height: 28, background: "var(--color-border-light)", margin: "0 4px" }}></div>
      <Pill icon="calendar" value="Today · Nov 2" />
      <div style={{ flex: 1 }}></div>
    </div>
  );
}

/* Filter row that sits over the map (Spaces / Space type / Amenities / Capacity) */
function MapFilters() {
  return (
    <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8, zIndex: 3 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 34, padding: "0 14px",
        background: "var(--navy)", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 500 }}>
        <i className="fa-solid fa-door-open" style={{ fontSize: 12 }}></i> Spaces
      </div>
      {["Space type", "Amenities", "Capacity"].map(f => (
        <div key={f} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 34, padding: "0 12px",
          background: "#fff", border: "1px solid var(--color-border)", borderRadius: 4, fontSize: 13, color: "var(--color-text)" }}>
          {f} <i className="fa-solid fa-angle-down" style={{ fontSize: 10, color: "var(--gray-7)" }}></i>
        </div>
      ))}
    </div>
  );
}

/* The floor map with interactive room markers. */
function MapCanvas({ selectableRooms, selectedRoomId, onPickRoom, dimmed }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#D5D9DF" }}>
      <MapFilters />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ position: "relative", width: "min(100%, 1180px)", aspectRatio: "2488 / 1426",
          filter: dimmed ? "saturate(.55) brightness(1.02)" : "none", transition: "filter .3s" }}>
          <img src={selectableRooms ? "assets/floor-available.png" : "assets/floor.png"} alt="Floor plan"
            style={{ width: "100%", height: "100%", display: "block", userSelect: "none", pointerEvents: "none" }} />
          {selectableRooms && ROOMS.map(r => {
            const sel = selectedRoomId === r.id;
            return <RoomMarker key={r.id} room={r} selected={sel} onClick={() => onPickRoom(r)} />;
          })}
        </div>
      </div>
    </div>
  );
}

function RoomMarker({ room, selected, onClick }) {
  const [h, setH] = useStateCh(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "absolute", left: room.x + "%", top: room.y + "%", transform: "translate(-50%,-50%)",
        display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 20, cursor: "pointer",
        background: selected ? "var(--color-primary)" : "#fff",
        color: selected ? "#fff" : room.color, zIndex: selected || h ? 4 : 2,
        border: "2px solid " + (selected ? "var(--color-primary)" : room.color),
        font: "600 13px/1 var(--font-sans)", whiteSpace: "nowrap",
        boxShadow: h || selected ? "0 4px 14px rgba(0,0,0,.22)" : "0 1px 3px rgba(0,0,0,.15)",
        transition: "transform .12s, box-shadow .15s", transformOrigin: "center",
        ...(h && !selected ? { transform: "translate(-50%,-50%) scale(1.06)" } : {}) }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: selected ? "#fff" : "var(--green-6)" }}></span>
      {room.name}
      {selected && <i className="fa-solid fa-check" style={{ fontSize: 10, marginLeft: 2 }}></i>}
    </button>
  );
}

Object.assign(window, { Sidebar, TopBar, MapCanvas, Pill });
