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

function PillSelect({ icon, value, options, onChange }) {
  const [open, setOpen] = useStateCh(false);
  const [h, setH] = useStateCh(false);
  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(!open)}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 36, padding: "0 12px",
          border: "1px solid " + (h || open ? "var(--color-primary)" : "var(--color-border)"),
          borderRadius: 4, background: "#fff", cursor: "pointer", transition: "border-color .15s",
          whiteSpace: "nowrap", userSelect: "none" }}>
        {icon && <i className={"fa-solid fa-" + icon} style={{ color: "var(--gray-7)", fontSize: 13 }}></i>}
        <span style={{ fontSize: 14, color: "var(--color-text)", fontWeight: 500 }}>{value}</span>
        <i className="fa-solid fa-angle-down" style={{ color: "var(--gray-7)", fontSize: 11,
          transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}></i>
      </div>
      {open && <>
        <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
        <div style={{ position: "absolute", top: 42, left: 0, zIndex: 50, background: "#fff",
          border: "1px solid var(--color-border)", borderRadius: 8, boxShadow: "var(--shadow-md)",
          padding: 4, minWidth: 140, animation: "rcPop .12s ease both" }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                borderRadius: 5, cursor: "pointer", fontSize: 14,
                color: opt === value ? "var(--color-primary)" : "var(--color-text)",
                fontWeight: opt === value ? 500 : 400 }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--gray-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <i className={"fa-solid fa-check"} style={{ fontSize: 11, color: "var(--color-primary)",
                visibility: opt === value ? "visible" : "hidden" }}></i>
              {opt}
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function TopBar({ onCreate, composerOpen, activeFloor, setActiveFloor, activeBuilding }) {
  const floors = ["Floor 1", "Floor 2"];
  return (
    <div style={{ borderBottom: "1px solid var(--color-border)", background: "#fff",
      display: "flex", flexDirection: "column", padding: "16px 24px 0", flexShrink: 0, zIndex: 5 }}>
      <h1 style={{ margin: "0 0 12px", fontSize: 30, fontWeight: 500,
        fontFamily: "var(--font-sans)", color: "var(--color-text)", lineHeight: 1.1 }}>Map</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14 }}>
        <Pill icon="building" value={activeBuilding} caret={false} />
        <PillSelect value={activeFloor} options={floors} onChange={setActiveFloor} />
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

const SPACE_TYPE_OPTIONS = [
  { value: "Meeting room", label: "Meeting room" },
  { value: "Focus room",   label: "Focus room" },
  { value: "Lounge",       label: "Lounge" },
  { value: "Event space",  label: "Event space" },
];
const AMENITY_OPTIONS = [
  { value: "tv",    label: "TV" },
  { value: "video", label: "Video conferencing" },
  { value: "phone", label: "Phone" },
];
const CAPACITY_OPTIONS = [
  { value: "small",  label: "1–4 people" },
  { value: "medium", label: "5–8 people" },
  { value: "large",  label: "9–14 people" },
  { value: "xlarge", label: "15+ people" },
];

function SpaceFilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useStateCh(false);
  const active = !!value;
  const activeLabel = active ? (options.find(o => o.value === value) || {}).label : null;
  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 10px",
          background: active ? "#1c1c1c" : "#fff",
          color: active ? "#fff" : "var(--color-text)",
          border: "1px solid " + (active ? "#1c1c1c" : "var(--color-border)"),
          borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500,
          userSelect: "none", whiteSpace: "nowrap", transition: "all .15s" }}>
        <span>{activeLabel || label}</span>
        {active ? (
          <span onClick={e => { e.stopPropagation(); onChange(null); setOpen(false); }}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,.22)",
              fontSize: 12, cursor: "pointer", marginLeft: 2, lineHeight: 1 }}>×</span>
        ) : (
          <i className="fa-solid fa-angle-down" style={{ fontSize: 10, color: "var(--gray-7)",
            transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}></i>
        )}
      </div>
      {open && <>
        <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
        <div style={{ position: "absolute", top: 38, left: 0, zIndex: 50, background: "#fff",
          border: "1px solid var(--color-border)", borderRadius: 8, boxShadow: "var(--shadow-md)",
          padding: 4, minWidth: 170, animation: "rcPop .12s ease both" }}>
          {options.map(opt => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                borderRadius: 5, cursor: "pointer", fontSize: 13,
                color: opt.value === value ? "var(--color-primary)" : "var(--color-text)",
                fontWeight: opt.value === value ? 500 : 400 }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--gray-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <i className="fa-solid fa-check" style={{ fontSize: 11, color: "var(--color-primary)",
                visibility: opt.value === value ? "visible" : "hidden" }}></i>
              {opt.label}
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

/* Filter overlay: resource chips + inline space filter controls */
function MapFilters({ composerOpen, activeResource, onResourceChange, spaceFilters, onSpaceFilterChange }) {
  const sf = spaceFilters || { type: null, amenity: null, capacity: null };
  const chipStyle = (active) => ({
    display: "inline-flex", alignItems: "center", height: 34, padding: "0 14px",
    background: active ? "#1c1c1c" : "#fff",
    color: active ? "#fff" : "var(--color-text)",
    border: "1px solid " + (active ? "#1c1c1c" : "var(--color-border)"),
    borderRadius: 4, cursor: active && composerOpen ? "default" : "pointer",
    fontSize: 13, fontWeight: 500,
    transition: "background .15s, color .15s, border-color .15s",
  });
  const spaceDropdowns = (
    <>
      <SpaceFilterDropdown label="Space type" options={SPACE_TYPE_OPTIONS}
        value={sf.type} onChange={v => onSpaceFilterChange("type", v)} />
      <SpaceFilterDropdown label="Amenities" options={AMENITY_OPTIONS}
        value={sf.amenity} onChange={v => onSpaceFilterChange("amenity", v)} />
      <SpaceFilterDropdown label="Capacity" options={CAPACITY_OPTIONS}
        value={sf.capacity} onChange={v => onSpaceFilterChange("capacity", v)} />
    </>
  );

  return (
    <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8, zIndex: 3 }}>
      {composerOpen ? (
        <>
          <div style={chipStyle(true)}>Spaces</div>
          {spaceDropdowns}
        </>
      ) : activeResource ? (
        <>
          <div onClick={() => onResourceChange(null)} style={chipStyle(true)}>
            {activeResource.charAt(0).toUpperCase() + activeResource.slice(1)}
          </div>
          {activeResource === "spaces" && spaceDropdowns}
        </>
      ) : (
        ["Desks", "Spaces", "Lockers"].map(r => (
          <div key={r} onClick={() => onResourceChange(r.toLowerCase())} style={chipStyle(false)}>{r}</div>
        ))
      )}
    </div>
  );
}

/* The schematic floor map: rooms as rectangles around the perimeter,
   desks clustered into pods in the open center. Green = available, grey = booked. */
function MapCanvas({ selectableRooms, selectedRoomIds = [], onPickRoom, onPickDesk, composerOpen, activeResource, onResourceChange, eventStart, eventEnd, activeFloor, spaceFilters, onSpaceFilterChange }) {
  const roomsDimmed = activeResource === "desks" || activeResource === "lockers";
  const desksDimmed = composerOpen || activeResource === "spaces" || activeResource === "lockers";
  const floorRooms = ROOMS.filter(r => r.floor === activeFloor);
  const floorDesks = activeFloor === "Floor 2" ? DESKS_F2 : DESKS;
  const hasFilter = spaceFilters && (spaceFilters.type || spaceFilters.amenity || spaceFilters.capacity);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#D5D9DF" }}>
      <MapFilters composerOpen={composerOpen} activeResource={activeResource} onResourceChange={onResourceChange}
        spaceFilters={spaceFilters} onSpaceFilterChange={onSpaceFilterChange} />
      <MapLegend />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 32px 32px" }}>
        <div style={{ position: "relative", width: "min(100%, 1060px)", aspectRatio: "3 / 2",
          background: "#fff", border: "1px solid var(--color-border)", borderRadius: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
          <div style={{ position: "absolute", left: "18%", top: "21%", width: "64%", height: "59%",
            background: "#FAFBFC", border: "1px dashed #E2E5E9", borderRadius: 6 }}></div>
          {floorDesks.map(d => <Desk key={d.id} d={d} dimmed={desksDimmed} onClick={() => onPickDesk && onPickDesk(d)} />)}
          {floorRooms.map(r => {
            const filterDimmed = hasFilter && !matchesSpaceFilters(r, spaceFilters);
            return (
            <RoomRect key={r.id} room={r} selectable={selectableRooms}
              selected={selectedRoomIds.includes(r.id)} dimmed={roomsDimmed || filterDimmed}
              eventStart={eventStart} eventEnd={eventEnd}
              onClick={() => onPickRoom(r)} />
            );
          })}
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
function Desk({ d, dimmed, onClick }) {
  const [h, setH] = useStateCh(false);
  const grey = dimmed || !d.available;
  return (
    <div onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      title={d.name}
      style={{ position: "absolute", left: d.x + "%", top: d.y + "%", width: d.w + "%", height: d.h + "%",
        background: grey ? "#C8C8C8" : (h ? "var(--green-7)" : "var(--green-6)"),
        borderRadius: 3, boxSizing: "border-box",
        border: "1px solid " + (grey ? "rgba(0,0,0,.05)" : "rgba(0,0,0,.08)"),
        cursor: "pointer",
        outline: h && !grey ? "2px solid var(--blue-6)" : "none",
        outlineOffset: -1,
        transition: "background .12s, outline .12s" }}></div>
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

const TIFFANY_BOOKINGS = [
  { type: "desk",   icon: "chair",        name: "Desk 12A",        floor: "Floor 1", start: 9,    end: 17 },
  { type: "space",  icon: "door-open",    name: "Echo Chamber",    floor: "Floor 1", start: 10,   end: 11 },
  { type: "locker", icon: "lock",         name: "Locker 4B",       floor: "Floor 2", start: null, end: null },
];

function BookingRow({ booking }) {
  const timeStr = booking.start !== null
    ? fmtTimeShort(booking.start) + " – " + fmtTimeShort(booking.end)
    : "All day";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: "1px solid var(--color-border-light)" }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: "var(--gray-1)", border: "1px solid var(--color-border)",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className={"fa-solid fa-" + booking.icon}
          style={{ fontSize: 14, color: "var(--color-text-secondary)" }}></i>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{booking.name}</div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
          {timeStr} · {booking.floor}
        </div>
      </div>
    </div>
  );
}

function OfficeSider() {
  return (
    <div style={{ width: 420, flexShrink: 0, height: "100%", background: "#fff",
      borderLeft: "1px solid var(--color-border)", boxShadow: "-8px 0 24px rgba(0,0,0,.06)",
      display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text)", marginBottom: 8, lineHeight: 1.1 }}>
          Boston HQ
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: "var(--color-text-secondary)" }}>
          <i className="fa-solid fa-users" style={{ fontSize: 13 }}></i>
          <span><strong style={{ color: "var(--color-text)", fontWeight: 500 }}>47</strong> people in the office today</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: ".06em", color: "var(--color-text-tertiary)", marginBottom: 4 }}>
          Your bookings today
        </div>
        {TIFFANY_BOOKINGS.map((b, i) => <BookingRow key={i} booking={b} />)}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, MapCanvas, Pill, PillSelect, OfficeSider });
