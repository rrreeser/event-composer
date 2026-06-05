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
    <div style={{ borderBottom: "1px solid var(--color-border)", background: "#fff",
      display: "flex", flexDirection: "column", padding: "16px 24px 0", flexShrink: 0, zIndex: 5 }}>
      <h1 style={{ margin: "0 0 12px", fontSize: 30, fontWeight: 500,
        fontFamily: "var(--font-sans)", color: "var(--color-text)", lineHeight: 1.1 }}>Map</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14 }}>
        <Pill icon="building" value="54 State St." />
        <Pill value="Floor 1" />
        {!composerOpen && <>
          <div style={{ width: 1, height: 28, background: "var(--color-border-light)", margin: "0 4px" }}></div>
          <Pill icon="calendar" value="Nov 2" />
          <Pill icon="clock" value="All day" />
        </>}
        <div style={{ flex: 1 }}></div>
      </div>
    </div>
  );
}

/* Filter overlay: resource chips + inline space filter controls */
function MapFilters({ composerOpen, activeResource, onResourceChange }) {
  const chipStyle = (active) => ({
    display: "inline-flex", alignItems: "center", height: 34, padding: "0 14px",
    background: active ? "#1c1c1c" : "#fff",
    color: active ? "#fff" : "var(--color-text)",
    border: "1px solid " + (active ? "#1c1c1c" : "var(--color-border)"),
    borderRadius: 4, cursor: active && composerOpen ? "default" : "pointer",
    fontSize: 13, fontWeight: 500,
    transition: "background .15s, color .15s, border-color .15s",
  });
  const spaceDropdowns = ["Space type", "Amenities", "Capacity"].map(f => (
    <div key={f} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 34, padding: "0 12px",
      background: "#fff", border: "1px solid var(--color-border)", borderRadius: 4,
      fontSize: 13, color: "var(--color-text)", cursor: "pointer" }}>
      {f} <i className="fa-solid fa-angle-down" style={{ fontSize: 10, color: "var(--gray-7)" }}></i>
    </div>
  ));

  return (
    <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8, zIndex: 3 }}>
      {composerOpen ? (
        /* Composer open: only Spaces chip (locked) + dropdowns inline */
        <>
          <div style={chipStyle(true)}>Spaces</div>
          {spaceDropdowns}
        </>
      ) : activeResource ? (
        /* Chip selected: show only that chip + (for spaces) dropdowns inline */
        <>
          <div onClick={() => onResourceChange(null)} style={chipStyle(true)}>
            {activeResource.charAt(0).toUpperCase() + activeResource.slice(1)}
          </div>
          {activeResource === "spaces" && spaceDropdowns}
        </>
      ) : (
        /* No selection: show all three chips */
        ["Desks", "Spaces", "Lockers"].map(r => (
          <div key={r} onClick={() => onResourceChange(r.toLowerCase())} style={chipStyle(false)}>{r}</div>
        ))
      )}
    </div>
  );
}

/* The schematic floor map: rooms as rectangles around the perimeter,
   desks clustered into pods in the open center. Green = available, grey = booked. */
function MapCanvas({ selectableRooms, selectedRoomIds = [], onPickRoom, composerOpen, activeResource, onResourceChange, eventStart, eventEnd }) {
  const roomsDimmed = activeResource === "desks" || activeResource === "lockers";
  const desksDimmed = activeResource === "spaces" || activeResource === "lockers";
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#D5D9DF" }}>
      <MapFilters composerOpen={composerOpen} activeResource={activeResource} onResourceChange={onResourceChange} />
      <MapLegend />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 32px 32px" }}>
        <div style={{ position: "relative", width: "min(100%, 1060px)", aspectRatio: "3 / 2",
          background: "#fff", border: "1px solid var(--color-border)", borderRadius: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
          <div style={{ position: "absolute", left: "18%", top: "21%", width: "64%", height: "59%",
            background: "#FAFBFC", border: "1px dashed #E2E5E9", borderRadius: 6 }}></div>
          {DESKS.map(d => <Desk key={d.id} d={d} dimmed={desksDimmed} />)}
          {ROOMS.map(r => (
            <RoomRect key={r.id} room={r} selectable={selectableRooms}
              selected={selectedRoomIds.includes(r.id)} dimmed={roomsDimmed}
              eventStart={eventStart} eventEnd={eventEnd}
              onClick={() => onPickRoom(r)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* A single bookable room rectangle. */
function RoomRect({ room, selectable, selected, onClick, dimmed, eventStart, eventEnd }) {
  const [h, setH] = useStateCh(false);
  const avail = !((room.dayBusy || []).some(([s, e]) => eventStart < e && eventEnd > s));
  const canPick = !dimmed;
  const showHover = canPick && avail; // hover ring only for available rooms
  const fill = dimmed ? "#ECECEC" : (selected ? "var(--blue-6)" : avail ? "var(--green-6)" : "#ECECEC");
  const border = dimmed ? "#C8C8C8" : (selected ? "var(--blue-7)" : avail ? "var(--green-7)" : "#C8C8C8");
  const nameColor = dimmed ? "#9C9C9C" : (selected ? "#fff" : avail ? "#000" : "#9C9C9C");
  const textShadow = !dimmed && avail && !selected ? "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff" : "none";
  return (
    <div onClick={canPick ? onClick : undefined}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "absolute", left: room.rx + "%", top: room.ry + "%", width: room.rw + "%", height: room.rh + "%",
        background: fill, border: "2px solid " + border, borderRadius: 6, boxSizing: "border-box",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textAlign: "center", padding: 6,
        cursor: canPick ? "pointer" : "default", zIndex: selected ? 3 : 1,
        boxShadow: showHover && h ? "0 6px 16px rgba(39,116,193,.18)" : "none",
        outline: showHover && h && !selected ? "2px solid var(--blue-6)" : "none", outlineOffset: -2,
        transition: "box-shadow .15s, outline .12s, background .15s" }}>
      <span style={{ font: "500 14px/1.25 var(--font-sans)", color: nameColor, maxWidth: "100%", textShadow }}>{room.name}</span>
    </div>
  );
}

/* A single desk. Greyed out when the Spaces resource is active (not part of that flow). */
function Desk({ d, dimmed }) {
  const grey = dimmed || !d.available;
  return (
    <div style={{ position: "absolute", left: d.x + "%", top: d.y + "%", width: d.w + "%", height: d.h + "%",
      background: grey ? "#C8C8C8" : "var(--green-6)", borderRadius: 3, boxSizing: "border-box",
      border: "1px solid " + (grey ? "rgba(0,0,0,.05)" : "rgba(0,0,0,.08)") }}></div>
  );
}

/* Availability key, pinned bottom-left in the canvas margin. */
function MapLegend() {
  const row = (swatch, label) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{swatch}<span>{label}</span></div>
  );
  const sq = (bg, bd) => <span style={{ width: 13, height: 13, borderRadius: 3, background: bg, border: "1.5px solid " + bd, flexShrink: 0 }}></span>;
  return (
    <div style={{ position: "absolute", left: 16, bottom: 16, zIndex: 3, background: "rgba(255,255,255,.96)",
      border: "1px solid var(--color-border)", borderRadius: 6, padding: "9px 11px",
      display: "flex", flexDirection: "column", gap: 7, fontSize: 12, color: "var(--color-text-secondary)",
      boxShadow: "var(--shadow-sm)" }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: ".04em" }}>Availability</span>
      {row(sq("var(--green-6)", "var(--green-7)"), "Available")}
      {row(sq("#ECECEC", "#C8C8C8"), "Unavailable")}
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, MapCanvas, Pill });
