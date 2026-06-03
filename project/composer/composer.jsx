/* The Create event composer drawer. Receives event state + setters + tweaks. */
const { useState: useStateCo, useRef: useRefCo } = React;

/* small helpers */
function SectionGap() {return <div style={{ height: 1, background: "var(--color-border-light)", margin: "4px 0" }}></div>;}

function AddRow({ icon, label, onClick }) {
  const [h, setH] = useStateCo(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 34, padding: "0 12px", alignSelf: "flex-start",
      border: "1px solid " + (h ? "var(--color-primary)" : "var(--color-border)"), borderRadius: 4, background: "#fff",
      cursor: "pointer", color: h ? "var(--color-primary)" : "var(--color-text)", fontSize: 14, fontWeight: 500,
      transition: "all .15s" }}>
      <i className={"fa-solid fa-" + icon} style={{ fontSize: 12 }}></i>{label}
    </button>);

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

/* People adder — collapsible container */
function PeopleSection({ attendees, onAdd, onRemove, slot }) {
  const [open, setOpen] = useStateCo(false); // search dropdown
  const [expanded, setExpanded] = useStateCo(true); // container open/closed
  const [q, setQ] = useStateCo("");
  const added = new Set(attendees.map((a) => a.email));
  const avail = PEOPLE_POOL.filter((p) => !added.has(p.email) && p.name.toLowerCase().includes(q.toLowerCase()));
  const busyAt = (p) => !p.organizer && !!slot && (p.busy || []).some((b) => slot.start < b[1] && slot.end > b[0]);
  return (
    <div>
      <FieldLabel>People</FieldLabel>
      <div style={{ border: "1px solid var(--color-border)", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
        <button onClick={() => setExpanded(!expanded)}
        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px",
          background: "#fff", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)" }}>
          <i className={"fa-solid fa-angle-" + (expanded ? "down" : "right")} style={{ color: "var(--gray-7)", fontSize: 13, width: 12, textAlign: "center" }}></i>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text)", flex: 1 }}>{attendees.length} {attendees.length === 1 ? "person" : "people"}</span>
          <AvatarStack people={attendees} />
        </button>
        {expanded &&
        <div style={{ borderTop: "1px solid var(--color-border-light)", padding: 12 }}>
            <div style={{ position: "relative" }}>
              <Input icon="magnifying-glass" placeholder="Add people" value={q}
            onChange={setQ} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} />
              {open && avail.length > 0 &&
            <div style={{ position: "absolute", top: 40, left: 0, right: 0, zIndex: 30, background: "#fff",
              border: "1px solid var(--color-border)", borderRadius: 8, boxShadow: "var(--shadow-md)", padding: 4,
              maxHeight: 220, overflowY: "auto", animation: "rcPop .14s ease both" }}>
                  {avail.map((p) =>
              <div key={p.email} onMouseDown={() => {onAdd(p);setQ("");}}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", borderRadius: 5, cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--gray-2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
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
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 2 }}>
              {attendees.map((p, i) =>
            <div key={p.email} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 4px" }}>
                  <Avatar name={p.name} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, color: "var(--color-text)" }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--color-text-tertiary)" }}>{p.email}</div>
                    {busyAt(p) && <div style={{ fontSize: 11.5, color: "var(--color-error)", fontWeight: 500 }}>Not available</div>}
                  </div>
                  {p.organizer ? <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Organizer</span> :
              <button onClick={() => onRemove(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-6)", fontSize: 13 }}><i className="fa-solid fa-xmark"></i></button>}
                </div>
            )}
            </div>
          </div>
        }
      </div>
    </div>);

}

/* Space card */
function SpaceCard({ room, services, onToggleService, buffer, onSetBuffer, onChange, onRemove }) {
  const amenityIcon = { tv: "tv", video: "video", phone: "phone" };
  const [bufOpen, setBufOpen] = useStateCo(buffer.on);
  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
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
      <div style={{ borderTop: "1px solid var(--color-border-light)", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {!services.includes("coffee") && <SuggestBtn variant="outline" block onClick={() => onToggleService("coffee")}>Add service request</SuggestBtn>}
        {!bufOpen && <SuggestBtn variant="outline" block onClick={() => {setBufOpen(true);onSetBuffer({ ...buffer, on: true });}}>Add buffer</SuggestBtn>}
        <SuggestBtn variant="outline" block onClick={onChange}>Change space</SuggestBtn>
        <SuggestBtn variant="outline" block danger onClick={onRemove}>Remove space</SuggestBtn>
      </div>
    </div>);

}

/* Suggested space — surfaced automatically once a guest is added and no space is chosen yet.
   Styled as an AI suggestion: sparkle header, gradient-bordered card, good-match banner. */
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

/* Full Spaces panel — replaces the composer body when picking a space.
   Lists every bookable room on the map; "Add to event" returns to the composer. */
function SpacesList({ onPick }) {
  const [q, setQ] = useStateCo("");
  const amenityIcon = { tv: "tv", video: "video", phone: "phone" };
  const list = ROOMS.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
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
          {r.requestOnly &&
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--color-text-secondary)" }}>
              <i className="fa-solid fa-lock" style={{ fontSize: 11, color: "var(--gray-7)" }}></i>
              This space is request-only
            </div>
        }
          <div style={{ marginTop: 12 }}>
            <Btn type="secondary" block onClick={() => onPick(r)}>{r.requestOnly ? "Create request" : "Add to event"}</Btn>
          </div>
        </div>
      )}
      {list.length === 0 &&
      <div style={{ textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 13, padding: "24px 0" }}>No spaces match “{q}”.</div>
      }
    </div>);

}

function Composer({ ev, set, tweaks, picking, setPicking, finding, setFinding, onClose, onSubmit, mapMode, onPickRoom }) {
  const [moreOpen, setMoreOpen] = useStateCo(false);
  const [descOpen, setDescOpen] = useStateCo(false);
  const [videoOpen, setVideoOpen] = useStateCo(false);
  const [dismissSuggest, setDismissSuggest] = useStateCo(false);
  const compact = tweaks.density === "compact";
  const floating = !mapMode;

  const slot = { start: ev.start, end: ev.end };
  const setSlot = (s) => set({ start: s.start, end: s.end });
  const dur = ev.end - ev.start;

  const subview = picking ? "spaces" : finding ? "find" : null;
  const goBack = () => {setPicking(false);setFinding(false);};
  const headerTitle = subview === "spaces" ? "Spaces" : subview === "find" ? "Find a time" : "Create event";

  const hasGuests = ev.attendees.filter((a) => !a.organizer).length > 0;
  const openFind = () => {setPicking(false);setFinding(true);};
  const inlineSuggest = (loc) => tweaks.inlineSuggest === loc && hasGuests ?
  <InlineTimeSuggestions attendees={ev.attendees} space={ev.space} duration={dur} anchor={ev.start}
  variant={tweaks.moreTimesStyle} onPick={(s) => set({ start: s.start, end: s.end })} onMore={openFind} /> :
  null;

  const suggestedSpace = !ev.space && hasGuests && !dismissSuggest ? suggestSpace(ev.attendees, ev.start, ev.end) : null;
  const peopleSuggest = inlineSuggest("people");

  const requestOnly = ev.space && ev.space.requestOnly;
  const ctaLabel = requestOnly ? "Send request" : "Create event";

  return (
    <div style={{ width: 420, flexShrink: 0, height: "100%", background: "#fff",
      border: floating ? "1px solid var(--color-border)" : "none", borderLeft: "1px solid var(--color-border)",
      borderRadius: floating ? 12 : 0, overflow: "hidden",
      display: "flex", flexDirection: "column", boxShadow: floating ? "var(--shadow-lg)" : "-8px 0 24px rgba(0,0,0,.06)" }}>
      {/* header */}
      <div style={{ height: 56, display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--color-border-light)", flexShrink: 0, padding: "0px 16px" }}>
        {subview &&
        <button onClick={goBack} title="Back"
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-7)", fontSize: 17, padding: 0, display: "inline-flex", marginLeft: -4 }}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
        }
        <span style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text)" }}>{headerTitle}</span>
        <div style={{ flex: 1 }}></div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-7)", fontSize: 16 }}><i className="fa-solid fa-xmark"></i></button>
      </div>

      {subview === "spaces" ?
      <SpacesList onPick={(r) => onPickRoom(r)} /> :
      subview === "find" ?
      <FindTimePanel attendees={ev.attendees} space={ev.space} duration={dur} dateLabel="Mon, Nov 2"
      onPick={(s) => {set({ start: s.start, end: s.end });setFinding(false);}} /> :

      <React.Fragment>
      {/* body */}
      <div style={{ ...{ flex: 1, overflowY: "auto", padding: compact ? 16 : 20, display: "flex", flexDirection: "column", gap: compact ? 12 : 18 }, gap: "17px", alignItems: "stretch", padding: "16px" }}>
        {/* calendar account */}
        <Field icon="calendar" iconRight="angle-down" value="Primary (tiffany.yu@robinpowered.com)" onClick={() => {}} />

        {/* title */}
        <div>
          <FieldLabel required>Title</FieldLabel>
          <Input placeholder="Add a title" value={ev.title} onChange={(v) => set({ title: v })} autoFocus />
        </div>

        {/* date & time */}
        <div>
          <FieldLabel>Date and time</FieldLabel>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <Field icon="calendar" value="2026-11-02" style={{ flex: 1.3 }} />
            <Checkbox checked={ev.allDay} onChange={(v) => set({ allDay: v })} label="All day" />
          </div>
          {!ev.allDay &&
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <TimeField value={fmtTime(ev.start)} />
              <span style={{ color: "var(--color-text-tertiary)", fontSize: 13 }}>to</span>
              <TimeField value={fmtTime(ev.end)} />
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>GMT</span>
            </div>
            }
          <button onClick={() => setMoreOpen(!moreOpen)} style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer",
              color: "var(--color-link)", fontSize: 13, padding: 0, display: "inline-flex", alignItems: "center", gap: "0px" }}>
            <i className="fa-solid fa-plus" style={{ fontSize: 10, height: "0px", width: "0px", opacity: "0" }}></i>{moreOpen ? "Fewer options" : "More options"}
          </button>
          {moreOpen &&
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Time zone</div>
                  <Field iconRight="angle-down" value="GMT−05:00 Eastern" onClick={() => {}} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Show me as</div>
                  <Field iconRight="angle-down" value="Busy" onClick={() => {}} />
                </div>
              </div>
              {/* RECURRING — hidden until More options is opened */}
              {tweaks.recurring === "cadence" ?
              <SeriesCadenceBuilder room={ev.space} enabled={ev.seriesOn} onToggle={(v) => set({ seriesOn: v })} /> :
              <RepeatDropdown value={ev.repeatVal} onChange={(v) => set({ repeatVal: v })} ends={ev.repeatEnds} onEnds={(e) => set({ repeatEnds: e })} />}
            </div>
            }

          {/* inline suggested times — under Date and time variant */}
          {inlineSuggest("datetime")}

          {/* Find availability — suggested time pills (people placement, above People) */}
          {peopleSuggest && <div style={{ marginTop: 16 }}>{peopleSuggest}</div>}
        </div>

        {/* people */}
        <div>
          <PeopleSection attendees={ev.attendees} slot={{ start: ev.start, end: ev.end }}
            onAdd={(p) => set({ attendees: [...ev.attendees, p] })}
            onRemove={(p) => set({ attendees: ev.attendees.filter((a) => a.email !== p.email) })} />
        </div>

        {/* space */}
        <div>
          {ev.space ?
            <React.Fragment>
              <FieldLabel>Space</FieldLabel>
              <SpaceCard room={ev.space} services={ev.services} buffer={ev.buffer}
              onToggleService={(s) => set({ services: ev.services.includes(s) ? ev.services.filter((x) => x !== s) : [...ev.services, s] })}
              onSetBuffer={(b) => set({ buffer: b })}
              onChange={() => setPicking(true)}
              onRemove={() => set({ space: null, services: [], buffer: { on: false, before: 5, after: 5 } })} />
            </React.Fragment> :
            suggestedSpace ?
            <SuggestedSpaceCard room={suggestedSpace}
            onAdd={() => set({ space: suggestedSpace })}
            onBrowse={() => setPicking(true)} /> :

            <React.Fragment>
              <FieldLabel>Space</FieldLabel>
              <AddRow icon="plus" label="Add space" onClick={() => setPicking(true)} />
            </React.Fragment>
            }
        </div>

        {/* description */}
        <div>
          {descOpen ?
            <div>
                <FieldLabel>Description</FieldLabel>
                <div style={{ border: "1px solid var(--color-border)", borderRadius: 6 }}>
                  <div style={{ display: "flex", gap: 2, padding: "6px 8px", borderBottom: "1px solid var(--color-border-light)" }}>
                    {["bold", "italic", "list-ul", "list-ol", "link"].map((ic) =>
                  <button key={ic} style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", color: "var(--gray-7)", borderRadius: 4, fontSize: 12 }}><i className={"fa-solid fa-" + ic}></i></button>
                  )}
                  </div>
                  <textarea value={ev.desc} onChange={(e) => set({ desc: e.target.value })} placeholder="Add agenda, notes, or links"
                style={{ width: "100%", border: "none", outline: "none", resize: "vertical", minHeight: 72, padding: 10,
                  font: "400 14px/22px var(--font-sans)", color: "var(--color-text)", boxSizing: "border-box" }} />
                </div>
              </div> :
            <AddRow icon="plus" label="Add description" onClick={() => setDescOpen(true)} />}
        </div>

        {/* video conference */}
        <div>
          {videoOpen ?
            <div>
                <FieldLabel>Video conference</FieldLabel>
                <Field icon="video" iconRight="angle-down" value="Zoom" onClick={() => {}} />
              </div> :
            <AddRow icon="plus" label="Add video conference" onClick={() => setVideoOpen(true)} />}
        </div>

        {/* mark private */}
        <Checkbox checked={ev.isPrivate} onChange={(v) => set({ isPrivate: v })} label="Mark as private" />
      </div>

      {/* footer */}
      <div style={{ padding: 16, borderTop: "1px solid var(--color-border-light)", flexShrink: 0 }}>
        <Btn type="primary" block size="large" disabled={!ev.title} onClick={onSubmit}>{ctaLabel}</Btn>
      </div>
      </React.Fragment>
      }
    </div>);

}

Object.assign(window, { Composer });