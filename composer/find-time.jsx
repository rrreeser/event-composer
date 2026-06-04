/* "Find a time" panel — replaces the composer body when the user clicks Find a time.
   Suggests slots that work across everyone's calendars + the chosen space.
   You (the organizer) are always an invited guest, so with no one else / no space
   added it falls back to your personal calendar. */
const { useState: useStateFt } = React;

/* lowercase am/pm formatter to match the requested mock ("3:30 pm") */
function fmtClock(h) {
  const hr = Math.floor(h),m = Math.round((h - hr) * 60);
  const ap = hr >= 12 ? "pm" : "am";
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return h12 + (m ? ":" + String(m).padStart(2, "0") : "") + " " + ap;
}

/* Build every candidate slot in the working day, tagging people + room conflicts. */
function buildTimeSlots(attendees, space, duration) {
  const overlaps = (s, e, b) => s < b[1] && e > b[0];
  const slots = [];
  for (let s = HOURS.start; s + duration <= HOURS.end; s += 0.5) {
    const e = s + duration;
    const conflictPeople = attendees.filter((p) => (p.busy || []).some((b) => overlaps(s, e, b)));
    const roomBusy = !!(space && (space.dayBusy || []).some((b) => overlaps(s, e, b)));
    slots.push({ start: s, end: e, conflictPeople, roomBusy });
  }
  return slots;
}

/* Overlapping avatar stack for conflict rows */
function FtAvatars({ people, max = 4 }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
      {shown.map((p, i) =>
      <span key={p.email} style={{ marginLeft: i === 0 ? 0 : -8, position: "relative", zIndex: i }}>
          <Avatar name={p.name} size={26} ring />
        </span>
      )}
      {extra > 0 &&
      <span style={{ marginLeft: -8, width: 26, height: 26, borderRadius: "50%", background: "var(--gray-5)",
        color: "#fff", fontSize: 10.5, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 0 2px #fff", position: "relative", zIndex: max }}>+{extra}</span>
      }
    </div>);

}

function SlotCard({ slot, dateLabel, spaceName, onPick }) {
  const [h, setH] = useStateFt(false);
  const people = slot.conflictPeople;
  const peopleLabel = people.length === 1 ? `${people[0].name} cannot attend` : `${people.length} people cannot attend`;
  return (
    <button onClick={() => onPick(slot)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", textAlign: "left",
      border: "1px solid " + (h ? "var(--color-primary)" : "var(--color-border)"), borderRadius: 8,
      background: "#fff", padding: "14px 16px", cursor: "pointer", transition: "border-color .15s",
      fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
          border: "2px solid " + (h ? "var(--color-primary)" : "var(--gray-5)"), transition: "border-color .15s" }}></span>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text)", whiteSpace: "nowrap" }}>{dateLabel}, {fmtClock(slot.start)} – {fmtClock(slot.end)}</span>
      </div>
      {slot.roomBusy &&
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 30 }}>
          <span style={{ width: 26, height: 26, borderRadius: 6, background: "var(--yellow-1)", border: "1px solid var(--yellow-6)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="fa-solid fa-door-closed" style={{ color: "var(--yellow-7)", fontSize: 12 }}></i>
          </span>
          <span style={{ fontSize: 13.5, color: "var(--color-text-secondary)" }}>{spaceName} is booked</span>
        </div>
      }
      {people.length > 0 &&
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 30 }}>
          <FtAvatars people={people} />
          <span style={{ fontSize: 13.5, color: "var(--color-text-secondary)" }}>{peopleLabel}</span>
        </div>
      }
    </button>);

}

function GroupHeading({ children }) {
  return <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text)" }}>{children}</div>;
}

/* A single time pill button: day-of-week + time, styled like a button (image 2).
   gradientBorder = pink→blue gradient border (matches the suggested-space card). */
function TimePill({ label, onClick, gradientBorder }) {
  const [h, setH] = useStateFt(false);
  const borderStyle = gradientBorder ?
  { border: "1px solid transparent",
    backgroundImage: "linear-gradient(#fff,#fff), linear-gradient(120deg, #E89BC4, #8FBEEA)",
    backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box",
    boxShadow: h ? "0 2px 8px rgba(120,40,150,.14)" : "none" } :
  { border: "1px solid " + (h ? "var(--color-primary)" : "var(--color-border)"), background: "#fff" };
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ display: "inline-flex", padding: "0 16px", borderRadius: 8,
      cursor: "pointer", color: "var(--color-text)", fontSize: 14,
      fontFamily: "var(--font-sans)", transition: "all .15s", whiteSpace: "nowrap", alignItems: "center", justifyContent: "center", fontWeight: "500", ...borderStyle, height: "32px" }}>
      {label}
    </button>);

}

/* Day labels relative to the event date (Mon, Nov 2), skipping weekends. */
function pillDayLabel(offset) {
  return ["Today", "Tue", "Wed", "Thu", "Fri", "Mon", "Tue", "Wed", "Thu", "Fri"][offset] || "Later";
}

function chipTime(h) {
  const hr = Math.floor(h),m = Math.round((h - hr) * 60);
  const ap = hr >= 12 ? "pm" : "am";
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return h12 + ":" + String(m).padStart(2, "0") + " " + ap;
}

/* Ordered list of suggestion candidates: distinct free times (spaced ≥1h apart),
   each shown on a successive day. The component shows the first two and pulls the
   next unused candidate in when one is picked. */
function buildPillSuggestions(attendees, space, duration) {
  const slots = buildTimeSlots(attendees, space, duration);
  const score = (s) => (s.roomBusy ? 1 : 0) + s.conflictPeople.length;
  const free = slots.filter((s) => score(s) === 0).sort((a, b) => a.start - b.start);
  const distinct = [];
  let last = -99;
  for (const s of free) {if (s.start - last >= 1) {distinct.push(s);last = s.start;}}
  return distinct.map((slot, i) => ({ dayOffset: i, slot }));
}

/* Small sparkle mark (gradient) for the More times header. */
function MoreTimesSparkle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs><linearGradient id="moreSpark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#BE1F77"></stop><stop offset="1" stopColor="#2774C1"></stop>
      </linearGradient></defs>
      <path d="M11 2 L12.7 8.3 L19 10 L12.7 11.7 L11 18 L9.3 11.7 L3 10 L9.3 8.3 Z" fill="url(#moreSpark)"></path>
      <path d="M18.5 2.5 L19.2 4.8 L21.5 5.5 L19.2 6.2 L18.5 8.5 L17.8 6.2 L15.5 5.5 L17.8 4.8 Z" fill="url(#moreSpark)"></path>
    </svg>);

}

/* "More times" section: a header + a row of day/time pill buttons, with a chevron
   that opens the full Find a time panel. Surfaced as guests are added.
   variant: "panel" = tinted gradient panel; "border" = plain bg + gradient-border pills. */
function InlineTimeSuggestions({ attendees, space, duration, anchor = 14, onPick, onMore, variant = "panel" }) {
  const candidates = buildPillSuggestions(attendees, space, duration);
  const [shownIdx, setShownIdx] = useStateFt([0, 1]);
  const [cursor, setCursor] = useStateFt(2);
  // Reset the shown suggestions when the scheduling context changes (guests / space / duration).
  React.useEffect(() => {setShownIdx([0, 1]);setCursor(2);}, [attendees.length, space && space.id, duration]);
  if (candidates.length === 0) return null;
  const border = variant === "border";
  const grad = { background: "linear-gradient(90deg, #BE1F77, #2774C1)", WebkitBackgroundClip: "text",
    backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" };
  const wrap = border ?
  { animation: "rcReveal .3s ease both" } :
  { borderRadius: 10, padding: "12px 14px",
    background: "linear-gradient(105deg, var(--magenta-1) 0%, #F4EEFB 50%, #EAF2FB 100%)",
    border: "1px solid #ECD9E6", animation: "rcReveal .3s ease both" };
  // Apply a slot, then reveal the next never-shown suggestion in its place
  // (picked times don't come back — we already took them).
  const pick = (i) => {
    const cand = candidates[shownIdx[i]];
    if (!cand) return;
    onPick(cand.slot);
    if (cursor < candidates.length) {
      const nc = cursor;
      setShownIdx((v) => {const nv = [...v];nv[i] = nc;return nv;});
      setCursor((c) => c + 1);
    }
  };
  return (
    <div style={wrap}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {border ?
        <MoreTimesSparkle /> :
        <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: 14, color: "var(--color-primary)" }}></i>}
        <span style={{ ...{ ...grad, fontWeight: border ? "600" : "400", fontSize: "6px" }, fontSize: "14px", fontWeight: "400" }}>Find availability</span>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {shownIdx.map((ci, i) => {
          const p = candidates[ci];
          return p ?
          <TimePill key={i} gradientBorder={border} label={pillDayLabel(p.dayOffset) + ", " + chipTime(p.slot.start)} onClick={() => pick(i)} /> :
          null;
        })}
        <button onClick={onMore} title="Find a time" aria-label="View more times"
        style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "none", border: "none", cursor: "pointer", color: "var(--color-link)", fontSize: 14,
          fontWeight: 500, fontFamily: "var(--font-sans)", flexShrink: 0, padding: "0 2px", whiteSpace: "nowrap", height: "32px" }}>
          View more
        </button>
      </div>
    </div>);

}

function FindTimePanel({ attendees, space, duration, dateLabel, onPick }) {
  const slots = buildTimeSlots(attendees, space, duration);
  const avail = slots.filter((s) => s.conflictPeople.length === 0 && !s.roomBusy);
  const conf = slots.
  filter((s) => s.conflictPeople.length > 0 || s.roomBusy).
  sort((a, b) => (a.roomBusy ? 1 : 0) + a.conflictPeople.length - ((b.roomBusy ? 1 : 0) + b.conflictPeople.length) || a.start - b.start);

  const [nAvail, setNAvail] = useStateFt(3);
  const [nConf, setNConf] = useStateFt(2);
  const more = nAvail < avail.length || nConf < conf.length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      {avail.length > 0 &&
      <React.Fragment>
          <GroupHeading>Everyone is available</GroupHeading>
          {avail.slice(0, nAvail).map((s, i) =>
        <SlotCard key={"a" + i} slot={s} dateLabel={dateLabel} onPick={onPick} />
        )}
        </React.Fragment>
      }
      {conf.length > 0 &&
      <React.Fragment>
          <div style={{ height: avail.length > 0 ? 8 : 0 }}></div>
          <GroupHeading>Some conflicts</GroupHeading>
          {conf.slice(0, nConf).map((s, i) =>
        <SlotCard key={"c" + i} slot={s} dateLabel={dateLabel} spaceName={space && space.name} onPick={onPick} />
        )}
        </React.Fragment>
      }
      {avail.length === 0 && conf.length === 0 &&
      <div style={{ textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 13, padding: "24px 0" }}>No times available in this window.</div>
      }
      {more &&
      <div style={{ marginTop: 4 }}>
          <Btn type="secondary" block onClick={() => {setNAvail((n) => n + 3);setNConf((n) => n + 2);}}>Load more times</Btn>
        </div>
      }
    </div>);

}

/* Suggest a space: the tightest-fitting room that is free during the slot and
   not request-only — fits the headcount with minimal wasted capacity. */
function suggestSpace(attendees, start, end) {
  const n = attendees.length; // organizer is always counted
  const free = (r) => !(r.dayBusy || []).some((b) => start < b[1] && end > b[0]);
  const open = ROOMS.filter((r) => !r.requestOnly && free(r));
  const fits = open.filter((r) => r.cap >= n).sort((a, b) => a.cap - b.cap || b.amenities.length - a.amenities.length);
  if (fits.length) return fits[0];
  // nobody fits the headcount — fall back to the largest open room
  const big = open.sort((a, b) => b.cap - a.cap);
  return big[0] || null;
}

Object.assign(window, { FindTimePanel, buildTimeSlots, InlineTimeSuggestions, suggestSpace });