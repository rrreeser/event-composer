/* The Create event composer drawer. Receives event state + setters + tweaks. */
const { useState: useStateCo } = React;

/* small helpers */
function SectionGap() {return <div style={{ height: 1, background: "var(--color-border-light)", margin: "4px 0" }}></div>;}

/* Full-width dashed "add" row used for empty sections and space card actions */
function AddRow({ icon, label, onClick }) {
  const [h, setH] = useStateCo(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 12px", width: "100%",
      border: "1px dashed " + (h ? "var(--color-primary)" : "var(--color-border)"), borderRadius: 6,
      background: "transparent", cursor: "pointer",
      color: h ? "var(--color-primary)" : "var(--color-text)",
      fontSize: 14, fontWeight: 400, fontFamily: "var(--font-sans)", transition: "all .15s" }}>
      <i className={"fa-solid fa-" + icon} style={{ fontSize: 12 }}></i>{label}
    </button>);
}

/* Thin full-width section divider */
function SectionDiv() {
  return <div style={{ height: 1, background: "var(--color-border-light)", flexShrink: 0 }} />;
}

/* Sparkle mark for the suggested-space header (magenta→blue gradient). */
function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs><linearGradient id="sugSpark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#BE1F77"></stop><stop offset="1" stopColor="#2774C1"></stop>
      </linearGradient></defs>
      <path d="M11 2 L12.7 8.3 L19 10 L12.7 11.7 L11 18 L9.3 11.7 L3 10 L9.3 8.3 Z" fill="url(#sugSpark)"></path>
      <path d="M18.5 2.5 L19.2 4.8 L21.5 5.5 L19.2 6.2 L18.5 8.5 L17.8 6.2 L15.5 5.5 L17.8 4.8 Z" fill="url(#sugSpark)"></path>
    </svg>);
}

/* Large footer button for the suggested-space card. */
function SuggestBtn({ variant, onClick, children, block, danger }) {
  const [h, setH] = useStateCo(false);
  const grad = variant === "gradient";
  const skin = grad ?
  { background: "linear-gradient(95deg, #BE1F77, #2774C1)", color: "#fff", border: "none", boxShadow: h ? "0 4px 14px rgba(120,40,150,.32)" : "none" } :
  { background: "#fff", color: danger ? "var(--color-error)" : "var(--color-text)",
    border: "1px solid " + (h ? (danger ? "var(--color-error)" : "var(--color-primary)") : "var(--color-border)") };
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ flex: block ? "none" : 1, width: block ? "100%" : "auto", borderRadius: 8, cursor: "pointer", fontSize: 15,
      fontFamily: "var(--font-sans)", transition: "all .15s", ...skin, height: "32px", fontWeight: "500" }}>{children}</button>);
}

/* Time field (click cycles nothing — display only, editable feel) */
function TimeField({ value }) {
  return (
    <div style={{ flex: 1, height: 36, border: "1px solid var(--color-border)", borderRadius: 4, display: "flex",
      alignItems: "center", gap: 8, padding: "0 11px", background: "#fff", minWidth: 0 }}>
      <span style={{ fontSize: 14, color: "var(--color-text)", flex: 1 }}>{value}</span>
      <i className="fa-regular fa-clock" style={{ color: "var(--gray-7)", fontSize: 12 }}></i>
    </div>);
}

/* Overlapping avatar stack for the collapsed People header */
function AvatarStack({ people, max = 3 }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((p, i) =>
      <span key={p.email} style={{ marginLeft: i === 0 ? 0 : -8, position: "relative", zIndex: i }}>
          <Avatar name={p.name} size={26} ring />
        </span>
      )}
      {extra > 0 &&
      <span style={{ marginLeft: -8, width: 26, height: 26, borderRadius: "50%", background: "var(--green-6)",
        color: "#fff", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 0 2px #fff", position: "relative", zIndex: max }}>+{extra}</span>
      }
    </div>);
}

/* Space card */
function roomBusyAt(room, start, end) {
  return (room.dayBusy || []).some(([s, e]) => start < e && end > s);
}

function SpaceCard({ room, isUnavailable, services, onToggleService, buffer, onSetBuffer, onChange, onRemove }) {
  const amenityIcon = { tv: "tv", video: "video", phone: "phone" };
  const [bufOpen, setBufOpen] = useStateCo(buffer.on);
  return (
    <div style={{ border: "1px solid " + (isUnavailable ? "var(--color-error)" : "var(--color-border)"), borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "var(--color-text)", lineHeight: 1.15, fontSize: 16, fontWeight: 400 }}>{room.name}</div>
            <div style={{ fontSize: 13.5, color: "var(--color-text-tertiary)", marginTop: 4, marginBottom: 12 }}>{room.floor}, {room.building}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--gray-8)", fontSize: 13.5, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fa-solid fa-user-group" style={{ fontSize: 12 }}></i>{room.cap}</span>
              <i className="fa-solid fa-wheelchair" style={{ fontSize: 13 }}></i>
              {room.amenities.map((a) => <i key={a} className={"fa-solid fa-" + amenityIcon[a]} style={{ fontSize: 13 }}></i>)}
              {room.extra > 0 && <span style={{ fontSize: 13, color: "var(--color-text-secondary)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}>+{room.extra} amenities</span>}
            </div>
          </div>
          <div style={{ borderRadius: 8, background: "linear-gradient(135deg,#3a3f4a,#21252d)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", width: 80, height: 80 }}>
            <i className="fa-solid fa-couch" style={{ color: "rgba(255,255,255,.42)", fontSize: 24 }}></i>
          </div>
        </div>
      </div>
      {isUnavailable &&
      <div style={{ margin: "0 16px 12px", padding: "8px 10px", background: "var(--color-error-bg)", border: "1px solid var(--color-error-border)",
        borderRadius: 6, fontSize: 12.5, color: "var(--color-error)", display: "flex", gap: 7 }}>
          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 12, marginTop: 2, flexShrink: 0 }}></i>
          The space is unavailable at this time.
        </div>
      }
      {room.requestOnly &&
      <div style={{ margin: "0 16px 12px", padding: "8px 10px", background: "var(--yellow-1)", border: "1px solid var(--yellow-6)",
        borderRadius: 6, fontSize: 12.5, color: "var(--color-text-secondary)", display: "flex", gap: 7 }}>
          <i className="fa-solid fa-clock-rotate-left" style={{ color: "var(--yellow-7)", fontSize: 12, marginTop: 2 }}></i>
          This space is request only. An admin will review and approve your request before it's booked.
        </div>
      }
      {/* service requests */}
      {services.length > 0 &&
      <div style={{ borderTop: "1px solid var(--color-border-light)", padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Service requests</div>
          {services.map((s) => {
          const svc = SERVICES.find((x) => x.id === s);
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <i className={"fa-solid fa-" + svc.icon} style={{ color: "var(--gray-7)", fontSize: 12, width: 16 }}></i>
                <span style={{ fontSize: 13, color: "var(--color-text)", flex: 1 }}>{svc.label}</span>
                {svc.price > 0 && <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>${svc.price}</span>}
                <button onClick={() => onToggleService(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-6)", fontSize: 12 }}><i className="fa-solid fa-xmark"></i></button>
              </div>);
        })}
        </div>
      }
      {/* buffer */}
      {bufOpen &&
      <div style={{ borderTop: "1px solid var(--color-border-light)", padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>Buffer</div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Before event", "After event"].map((lbl, i) =>
          <div key={lbl} style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 4 }}>{lbl}</div>
                <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--color-border)", borderRadius: 4 }}>
                  <span style={{ width: 34, textAlign: "center", fontSize: 13 }}>{i === 0 ? buffer.before : buffer.after}</span>
                  <span style={{ padding: "0 8px", fontSize: 12, color: "var(--gray-7)", borderLeft: "1px solid var(--color-border)" }}>min</span>
                </div>
              </div>
          )}
          </div>
        </div>
      }
      {/* actions */}
      <div style={{ borderTop: "1px solid var(--color-border-light)", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {!services.includes("coffee") && <AddRow icon="plus" label="Add service request" onClick={() => onToggleService("coffee")} />}
        {!bufOpen && <AddRow icon="plus" label="Add buffer" onClick={() => { setBufOpen(true); onSetBuffer({ ...buffer, on: true }); }} />}
        <div style={{ display: "flex", gap: 8 }}>
          <SuggestBtn variant="outline" onClick={onChange}>Change</SuggestBtn>
          <SuggestBtn variant="outline" danger onClick={onRemove}>Remove</SuggestBtn>
        </div>
      </div>
    </div>);
}

/* Suggested space — surfaced automatically once a guest is added and no space is chosen yet. */
function SuggestedSpaceCard({ room, onAdd, onBrowse }) {
  const amenityIcon = { tv: "tv", video: "video", phone: "phone" };
  const grad = { background: "linear-gradient(90deg, #BE1F77, #2774C1)", WebkitBackgroundClip: "text",
    backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" };
  return (
    <div style={{ animation: "rcReveal .3s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <SparkleIcon />
        <span style={{ ...grad, fontSize: "14px", fontWeight: "400" }}>Suggested space</span>
      </div>
      <div style={{ borderRadius: 12, border: "1px solid transparent",
        backgroundImage: "linear-gradient(#fff,#fff), linear-gradient(120deg, #F3B6D6, #A9D0F0)",
        backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box" }}>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "var(--color-text)", lineHeight: 1.15, fontSize: "16px", fontWeight: "400" }}>{room.name}</div>
              <div style={{ fontSize: 13.5, color: "var(--color-text-tertiary)", marginTop: 4, marginBottom: 12 }}>{room.floor}, {room.building}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--gray-8)", fontSize: 13.5, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><i className="fa-solid fa-user-group" style={{ fontSize: 12 }}></i>{room.cap}</span>
                <i className="fa-solid fa-wheelchair" style={{ fontSize: 13 }}></i>
                {room.amenities.map((a) => <i key={a} className={"fa-solid fa-" + amenityIcon[a]} style={{ fontSize: 13 }}></i>)}
                {room.extra > 0 && <span style={{ fontSize: 13, color: "var(--color-text-secondary)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}>+{room.extra} amenities</span>}
              </div>
            </div>
            <div style={{ borderRadius: 8, background: "linear-gradient(135deg,#3a3f4a,#21252d)", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px" }}>
              <i className="fa-solid fa-couch" style={{ color: "rgba(255,255,255,.42)", fontSize: 24 }}></i>
            </div>
          </div>
          <div style={{ marginTop: 14, borderRadius: 8, padding: "11px 14px", fontSize: 14,
            background: "linear-gradient(100deg, var(--magenta-1) 0%, #F4EEFB 50%, #EAF2FB 100%)" }}>
            <span style={{ ...grad, fontWeight: "400" }}>Good match: </span>
            <span style={{ color: "var(--color-text)" }}>Fits {room.cap} • Meeting room</span>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--color-border-light)", padding: 14, display: "flex", gap: 12, borderColor: "rgb(240, 240, 240)" }}>
          <SuggestBtn variant="gradient" onClick={onAdd}>Add to event</SuggestBtn>
          <SuggestBtn variant="outline" onClick={onBrowse}>Find another</SuggestBtn>
        </div>
      </div>
    </div>);
}

/* Full Spaces panel — replaces the composer body when picking a space. */
function SpacesList({ onPick, selectedRoomIds = [], activeFloor, setActiveFloor, activeBuilding }) {
  const [q, setQ] = useStateCo("");
  const amenityIcon = { tv: "tv", video: "video", phone: "phone" };
  const floors = ["Floor 1", "Floor 2"];
  const floorRooms = ROOMS.filter(r => r.floor === activeFloor);
  const list = floorRooms.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Pill icon="building" value={activeBuilding} caret={false} />
        <PillSelect value={activeFloor} options={floors} onChange={setActiveFloor} />
      </div>
      <Input icon="magnifying-glass" placeholder="Search" value={q} onChange={setQ} />
      {list.map((r) =>
      <div key={r.id} style={{ border: "1px solid var(--color-border)", borderRadius: 8, padding: 14, background: "#fff" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text)" }}>{r.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--color-text-tertiary)", marginBottom: 8 }}>{r.floor}, {r.building}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--gray-7)", fontSize: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i className="fa-solid fa-user-group" style={{ fontSize: 11 }}></i>{r.cap}</span>
                <i className="fa-solid fa-wheelchair" style={{ fontSize: 12 }}></i>
                {r.amenities.map((a) => <i key={a} className={"fa-solid fa-" + amenityIcon[a]} style={{ fontSize: 12 }}></i>)}
                <span style={{ fontSize: 11.5, textDecoration: "underline", color: "var(--color-text-secondary)" }}>{r.amenities.length + r.extra} amenities</span>
              </div>
            </div>
            <div style={{ width: 84, height: 60, borderRadius: 6, background: "linear-gradient(135deg,#3a3f4a,#21252d)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fa-solid fa-couch" style={{ color: "rgba(255,255,255,.42)", fontSize: 18 }}></i>
            </div>
          </div>
          {r.requestOnly && r.available &&
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--color-text-secondary)" }}>
              <i className="fa-solid fa-lock" style={{ fontSize: 11, color: "var(--gray-7)" }}></i>
              This space is request-only
            </div>
        }
          {!r.available &&
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--color-text-tertiary)" }}>
              <i className="fa-solid fa-circle" style={{ fontSize: 8, color: "#C8C8C8" }}></i>
              Unavailable for this time
            </div>
        }
          <div style={{ marginTop: 12 }}>
            {r.available
              ? <Btn type="secondary" block onClick={() => onPick(r)}>
                  {r.requestOnly ? "Create request" : selectedRoomIds.includes(r.id) ? "Remove from event" : "Add to event"}
                </Btn>
              : <Btn type="secondary" block disabled>Unavailable</Btn>}
          </div>
        </div>
      )}
      {list.length === 0 &&
      <div style={{ textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 13, padding: "24px 0" }}>No spaces match "{q}".</div>
      }
    </div>);
}

function SpaceDetailsPanel({ room, alreadyAdded, composerOpen, onBack, onAdd, onRemove }) {
  return (
    <div style={{ width: 420, flexShrink: 0, height: "100%", background: "#fff",
      borderLeft: "1px solid var(--color-border)", display: "flex", flexDirection: "column",
      boxShadow: "-8px 0 24px rgba(0,0,0,.06)" }}>
      {/* header */}
      <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid var(--color-border-light)", flexShrink: 0, padding: "0 16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer",
          color: "var(--gray-7)", fontSize: 17, padding: 0, display: "inline-flex", marginLeft: -4 }}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <span style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text)" }}>Space details</span>
        <div style={{ flex: 1 }} />
      </div>
      {/* body */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ width: "100%", height: 200, background: "linear-gradient(135deg, #3a3f4a, #21252d)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i className="fa-solid fa-couch" style={{ color: "rgba(255,255,255,.25)", fontSize: 52 }}></i>
        </div>
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <Tag status={room.available ? "available" : "error"}>
            {room.available ? "Available" : "Booked"}
          </Tag>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#3a3f4a,#21252d)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="fa-solid fa-door-open" style={{ color: "rgba(255,255,255,.55)", fontSize: 18 }}></i>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text)", lineHeight: 1.2 }}>{room.name}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginTop: 3 }}>{room.floor} · {room.building}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--color-text)" }}>
              <i className="fa-solid fa-user-group" style={{ color: "var(--gray-7)", fontSize: 14, width: 18, textAlign: "center" }}></i>
              Fits: {room.cap}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--color-text)" }}>
              <i className="fa-solid fa-wheelchair" style={{ color: "var(--gray-7)", fontSize: 14, width: 18, textAlign: "center" }}></i>
              Accessible
            </div>
          </div>
          {!composerOpen
            ? <Btn type="primary" block size="large" onClick={onAdd}>Create event</Btn>
            : alreadyAdded
              ? <Btn type="primary" block size="large" danger onClick={onRemove}>Remove from event</Btn>
              : <Btn type="primary" block size="large" onClick={onAdd}>Add to event</Btn>}
        </div>
      </div>
    </div>
  );
}

function DeskDetailsPanel({ desk, onBack }) {
  return (
    <div style={{ width: 420, flexShrink: 0, height: "100%", background: "#fff",
      borderLeft: "1px solid var(--color-border)", display: "flex", flexDirection: "column",
      boxShadow: "-8px 0 24px rgba(0,0,0,.06)" }}>
      <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid var(--color-border-light)", flexShrink: 0, padding: "0 16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer",
          color: "var(--gray-7)", fontSize: 17, padding: 0, display: "inline-flex", marginLeft: -4 }}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <span style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text)" }}>Desk details</span>
        <div style={{ flex: 1 }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#3a3f4a,#21252d)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="fa-solid fa-chair-office" style={{ color: "rgba(255,255,255,.55)", fontSize: 18 }}></i>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text)", lineHeight: 1.2 }}>{desk.name}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginTop: 3 }}>{desk.floor} · {desk.building}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmCloseModal({ onCancel, onConfirm }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 360,
        boxShadow: "var(--shadow-lg)", animation: "rcPop .18s ease both" }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text)", marginBottom: 8 }}>
          Your event isn't saved
        </div>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 24 }}>
          All unsaved changes will be lost. Are you sure?
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn type="secondary" onClick={onCancel}>Cancel</Btn>
          <Btn type="primary" onClick={onConfirm}>Ok</Btn>
        </div>
      </div>
    </div>
  );
}

function Composer({ ev, set: rawSet, tweaks, picking, setPicking, finding, setFinding, onClose, onSubmit, mapMode, onPickRoom, activeFloor, setActiveFloor, activeBuilding, dirty, onDirty }) {
  const [moreOpen, setMoreOpen] = useStateCo(false);
  const [descOpen, setDescOpen] = useStateCo(false);
  const [videoOpen, setVideoOpen] = useStateCo(false);
  const [dismissSuggest, setDismissSuggest] = useStateCo(false);
  const [confirmClose, setConfirmClose] = useStateCo(false);
  const [peopleOpen, setPeopleOpen] = useStateCo(false);
  const [peopleExpanded, setPeopleExpanded] = useStateCo(true);
  const [spaceExpanded, setSpaceExpanded] = useStateCo(true);
  const [pplDropOpen, setPplDropOpen] = useStateCo(false);
  const [pplQ, setPplQ] = useStateCo("");
  const floating = !mapMode;

  // Shadow set so every user-initiated change marks the form dirty via onDirty prop.
  const set = (patch) => { onDirty(); rawSet(patch); };

  const dur = ev.end - ev.start;
  const subview = picking ? "spaces" : finding ? "find" : null;
  const goBack = () => { setPicking(false); setFinding(false); };
  const baseTitle = tweaks.entryPoint === "edit-event" ? "Edit event" : "Create event";
  const headerTitle = subview === "spaces" ? "Spaces" : subview === "find" ? "Suggested times" : baseTitle;
  const openFind = () => { setPicking(false); setFinding(true); };

  const hasGuests = ev.attendees.filter(a => !a.organizer).length > 0;
  const suggestedSpace = (!ev.spaces || ev.spaces.length === 0) && hasGuests && !dismissSuggest
    ? suggestSpace(ev.attendees, ev.start, ev.end, activeFloor) : null;

  const fmtInput = (h) => {
    const hr = Math.floor(h), m = Math.round((h - hr) * 60);
    return hr + ":" + String(m).padStart(2, "0");
  };

  const spaceNamesSummary = () => {
    if (!ev.spaces || ev.spaces.length === 0) return "";
    if (ev.spaces.length <= 2) return ev.spaces.map(s => s.name).join(", ");
    return ev.spaces.slice(0, 2).map(s => s.name).join(", ") + ", and " + (ev.spaces.length - 2) + " more";
  };

  const pplPool = PEOPLE_POOL.filter(p =>
    !ev.attendees.find(a => a.email === p.email) &&
    p.name.toLowerCase().includes(pplQ.toLowerCase())
  );
  const busyAt = (p) => !p.organizer && (p.busy || []).some(b => ev.start < b[1] && ev.end > b[0]);

  /* Section collapse toggle button */
  const SectionToggle = ({ expanded, onToggle, label, count, right }) => (
    <button onClick={onToggle}
      style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none",
        border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-sans)" }}>
      <i className={"fa-solid fa-angle-" + (expanded ? "down" : "right")}
        style={{ fontSize: 12, color: "var(--gray-7)", width: 14, flexShrink: 0 }}></i>
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text)" }}>
        {label}{count != null ? " (" + count + ")" : ""}
      </span>
      {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
    </button>
  );

  return (
    <React.Fragment>
    <div style={{ width: 420, flexShrink: 0, height: "100%", background: "#fff",
      border: floating ? "1px solid var(--color-border)" : "none", borderLeft: "1px solid var(--color-border)",
      borderRadius: floating ? 12 : 0, overflow: "hidden",
      display: "flex", flexDirection: "column", boxShadow: floating ? "var(--shadow-lg)" : "-8px 0 24px rgba(0,0,0,.06)" }}>

      {/* header */}
      <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid var(--color-border-light)", flexShrink: 0, padding: "0 16px" }}>
        {subview &&
          <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer",
            color: "var(--gray-7)", fontSize: 17, padding: 0, display: "inline-flex", marginLeft: -4 }}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
        }
        <span style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text)" }}>{headerTitle}</span>
        <div style={{ flex: 1 }}></div>
        <button onClick={() => { if (dirty) setConfirmClose(true); else onClose(); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-7)", fontSize: 16 }}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {subview === "spaces" ?
        <SpacesList selectedRoomIds={(ev.spaces || []).map(s => s.id)} onPick={(r) => onPickRoom(r)}
          activeFloor={activeFloor} setActiveFloor={setActiveFloor} activeBuilding={activeBuilding} /> :
      subview === "find" ?
        <FindTimePanel attendees={ev.attendees} space={ev.spaces && ev.spaces[0]} duration={dur} dateLabel="Mon, Nov 2"
          onPick={(s) => { set({ start: s.start, end: s.end }); setFinding(false); }} /> :

      <React.Fragment>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── Title ── */}
        <div style={{ padding: "16px 20px" }}>
          <FieldLabel>Title</FieldLabel>
          <Input placeholder="Add title" value={ev.title} onChange={(v) => set({ title: v })} autoFocus />
        </div>
        <SectionDiv />

        {/* ── Date and time ── */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text)" }}>
              {moreOpen ? "Start time" : "Date and time"}
            </span>
            <button onClick={() => setMoreOpen(!moreOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)",
                fontSize: 13, fontWeight: 500, fontFamily: "var(--font-sans)", padding: 0 }}>
              {moreOpen ? "Show less" : "Show more"}
            </button>
          </div>

          {moreOpen ? (
            <React.Fragment>
              <div style={{ display: "flex", gap: 8 }}>
                <Field icon="calendar" value="2026-11-02" style={{ flex: 1 }} />
                <TimeField value={fmtInput(ev.start)} />
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>End time</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Field icon="calendar" value="2026-11-02" style={{ flex: 1 }} />
                <TimeField value={fmtInput(ev.end)} />
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Recurrence</div>
              <RepeatDropdown value={ev.repeatVal} onChange={(v) => set({ repeatVal: v })}
                ends={ev.repeatEnds} onEnds={(e) => set({ repeatEnds: e })} />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Checkbox checked={ev.allDay} onChange={(v) => set({ allDay: v })} label="All day" />
                <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--color-text-secondary)" }}>GMT</span>
              </div>
              <Checkbox checked={false} onChange={() => {}} label="Do not require check-in" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Field icon="calendar" value="2026-11-02" />
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <TimeField value={fmtInput(ev.start)} />
                <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>to</span>
                <TimeField value={fmtInput(ev.end)} />
                <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>GMT</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                {ev.repeatVal === "none" ? "Does not repeat" : ev.repeatVal}
              </div>
            </React.Fragment>
          )}

          {/* Suggested times — always visible */}
          <button onClick={openFind}
            style={{ display: "flex", alignItems: "center", gap: 10, height: 40,
              border: "1px solid var(--color-border)", borderRadius: 6, padding: "0 12px",
              cursor: "pointer", background: "#fff", width: "100%", fontFamily: "var(--font-sans)",
              transition: "border-color .15s" }}>
            <i className="fa-solid fa-clock-rotate-left" style={{ color: "var(--gray-7)", fontSize: 14 }}></i>
            <span style={{ flex: 1, fontSize: 14, color: "var(--color-text)", textAlign: "left" }}>Suggested times</span>
            <i className="fa-solid fa-angle-right" style={{ color: "var(--gray-7)", fontSize: 12 }}></i>
          </button>
        </div>
        <SectionDiv />

        {/* ── People ── */}
        <div style={{ padding: "16px 20px" }}>
          {!peopleOpen ? (
            <AddRow icon="plus" label="People" onClick={() => setPeopleOpen(true)} />
          ) : (
            <React.Fragment>
              <SectionToggle
                expanded={peopleExpanded}
                onToggle={() => setPeopleExpanded(!peopleExpanded)}
                label="People"
                count={ev.attendees.length}
                right={!peopleExpanded && ev.attendees.length > 0
                  ? <AvatarStack people={ev.attendees} max={3} />
                  : null}
              />
              {peopleExpanded && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ position: "relative", marginBottom: 10 }}>
                    <Input icon="magnifying-glass" placeholder="Add people" value={pplQ}
                      onChange={setPplQ}
                      onFocus={() => setPplDropOpen(true)}
                      onBlur={() => setTimeout(() => setPplDropOpen(false), 150)} />
                    {pplDropOpen && pplPool.length > 0 &&
                      <div style={{ position: "absolute", top: 40, left: 0, right: 0, zIndex: 30,
                        background: "#fff", border: "1px solid var(--color-border)", borderRadius: 8,
                        boxShadow: "var(--shadow-md)", padding: 4, maxHeight: 220, overflowY: "auto",
                        animation: "rcPop .14s ease both" }}>
                        {pplPool.map(p =>
                          <div key={p.email}
                            onMouseDown={() => { set({ attendees: [...ev.attendees, p] }); setPplQ(""); }}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px",
                              borderRadius: 5, cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--gray-2)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <Avatar name={p.name} size={28} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13.5, color: "var(--color-text)" }}>{p.name}</div>
                              <div style={{ fontSize: 11.5, color: "var(--color-text-tertiary)" }}>{p.email}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  </div>
                  {ev.attendees.map(p =>
                    <div key={p.email} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                      <Avatar name={p.name} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text)" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{p.email}</div>
                        {busyAt(p) && <div style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>
                          {p.name.split(" ")[0]} cannot attend
                        </div>}
                      </div>
                      {p.organizer && <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", flexShrink: 0 }}>Organizer</span>}
                      <button
                        onClick={() => { if (!p.organizer) set({ attendees: ev.attendees.filter(a => a.email !== p.email) }); }}
                        style={{ background: "none", border: "none", cursor: p.organizer ? "default" : "pointer",
                          color: "var(--gray-6)", fontSize: 14, padding: 4, flexShrink: 0 }}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          )}
        </div>
        <SectionDiv />

        {/* ── Space ── */}
        <div style={{ padding: "16px 20px" }}>
          {(!ev.spaces || ev.spaces.length === 0) ? (
            suggestedSpace ?
              <SuggestedSpaceCard room={suggestedSpace}
                onAdd={() => { set({ spaces: [suggestedSpace] }); setSpaceExpanded(true); }}
                onBrowse={() => setPicking(true)} /> :
              <AddRow icon="plus" label="Space" onClick={() => setPicking(true)} />
          ) : (
            <React.Fragment>
              <SectionToggle
                expanded={spaceExpanded}
                onToggle={() => setSpaceExpanded(!spaceExpanded)}
                label="Space"
                count={ev.spaces.length}
                right={!spaceExpanded
                  ? <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--gray-2)",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa-solid fa-door-open" style={{ fontSize: 13, color: "var(--gray-7)" }}></i>
                    </div>
                  : null}
              />
              {!spaceExpanded &&
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 22, marginTop: 4 }}>
                  {spaceNamesSummary()}
                </div>
              }
              {spaceExpanded && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                  {ev.spaces.map(space =>
                    <SpaceCard key={space.id} room={space}
                      isUnavailable={roomBusyAt(space, ev.start, ev.end)}
                      services={ev.services} buffer={ev.buffer}
                      onToggleService={s => set({ services: ev.services.includes(s) ? ev.services.filter(x => x !== s) : [...ev.services, s] })}
                      onSetBuffer={b => set({ buffer: b })}
                      onChange={() => setPicking(true)}
                      onRemove={() => {
                        const next = ev.spaces.filter(s => s.id !== space.id);
                        set({ spaces: next, ...(next.length === 0 ? { services: [], buffer: { on: false, before: 5, after: 5 } } : {}) });
                      }} />
                  )}
                  <AddRow icon="plus" label="Another space" onClick={() => setPicking(true)} />
                </div>
              )}
            </React.Fragment>
          )}
        </div>
        <SectionDiv />

        {/* ── Description ── */}
        <div style={{ padding: "16px 20px" }}>
          {descOpen ? (
            <React.Fragment>
              <FieldLabel>Description</FieldLabel>
              <div style={{ border: "1px solid var(--color-border)", borderRadius: 6 }}>
                <div style={{ display: "flex", gap: 2, padding: "6px 8px", borderBottom: "1px solid var(--color-border-light)" }}>
                  {["bold", "italic", "list-ul", "list-ol", "link"].map(ic =>
                    <button key={ic} style={{ width: 26, height: 26, border: "none", background: "none",
                      cursor: "pointer", color: "var(--gray-7)", borderRadius: 4, fontSize: 12 }}>
                      <i className={"fa-solid fa-" + ic}></i>
                    </button>
                  )}
                </div>
                <textarea value={ev.desc} onChange={e => set({ desc: e.target.value })}
                  placeholder="Add agenda, notes, or links"
                  style={{ width: "100%", border: "none", outline: "none", resize: "vertical", minHeight: 72,
                    padding: 10, font: "400 14px/22px var(--font-sans)", color: "var(--color-text)", boxSizing: "border-box" }} />
              </div>
            </React.Fragment>
          ) : (
            <AddRow icon="plus" label="Description" onClick={() => setDescOpen(true)} />
          )}
        </div>
        <SectionDiv />

        {/* ── Video conference ── */}
        <div style={{ padding: "16px 20px" }}>
          {videoOpen ? (
            <React.Fragment>
              <FieldLabel>Video conference</FieldLabel>
              <Field icon="video" iconRight="angle-down" value="Zoom" onClick={() => {}} />
            </React.Fragment>
          ) : (
            <AddRow icon="plus" label="Video conference" onClick={() => setVideoOpen(true)} />
          )}
        </div>
        <SectionDiv />

        {/* ── Mark as private ── */}
        <div style={{ padding: "16px 20px" }}>
          <Checkbox checked={ev.isPrivate} onChange={v => set({ isPrivate: v })} label="Mark as private" />
        </div>

      </div>

      {/* footer */}
      <div style={{ padding: 16, borderTop: "1px solid var(--color-border-light)", flexShrink: 0 }}>
        <Btn type="primary" block size="large" onClick={onSubmit}>Save</Btn>
      </div>
      </React.Fragment>
      }
    </div>
    {confirmClose && <ConfirmCloseModal onCancel={() => setConfirmClose(false)} onConfirm={onClose} />}
    </React.Fragment>);
}

Object.assign(window, { Composer, SpaceDetailsPanel, DeskDetailsPanel, ConfirmCloseModal });
