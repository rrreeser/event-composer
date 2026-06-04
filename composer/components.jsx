/* Robin UI primitives — forked & extended from the Robin web-app UI kit.
   Exported to window so other babel scripts can use them. */
const { useState: useStateC, useRef: useRefC, useEffect: useEffectC } = React;

/* ---------- Button ---------- */
function Btn({ type = "secondary", size = "default", icon, iconRight, children, danger, block, onClick, disabled, style }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    height: size === "small" ? 28 : size === "large" ? 40 : 32,
    padding: size === "large" ? "0 20px" : size === "small" ? "0 10px" : "0 15px",
    borderRadius: 4, font: "500 14px/22px var(--font-sans)",
    border: "1px solid transparent", cursor: disabled ? "not-allowed" : "pointer",
    width: block ? "100%" : "auto", whiteSpace: "nowrap",
    transition: "background .18s, color .18s, border-color .18s, box-shadow .18s"
  };
  const variants = {
    primary: { background: danger ? "var(--red-6)" : "var(--color-primary)", color: "#fff" },
    secondary: { background: "#fff", color: "var(--color-text)", borderColor: "var(--color-border)" },
    ghost: { background: "#fff", color: "var(--color-primary)", borderColor: "var(--color-primary)" },
    link: { background: "transparent", color: "var(--color-link)", padding: "0 4px", height: "auto" },
    text: { background: "transparent", color: "var(--color-text)", padding: "0 8px" },
    gradient: { background: "linear-gradient(95deg, #BE1F77 0%, #7A0E4D 100%)", color: "#fff" }
  };
  const [hover, setHover] = useStateC(false);
  let s = { ...base, ...variants[type], ...style };
  if (disabled) s = { ...s, background: "#F5F5F5", color: "var(--gray-6)", borderColor: "#EAEAEA" };else
  if (hover) {
    if (type === "primary") s.background = danger ? "var(--red-7)" : "var(--color-primary-hover)";
    if (type === "secondary") {s.color = "var(--color-primary)";s.borderColor = "var(--color-primary)";}
    if (type === "ghost") s.background = "var(--magenta-1)";
    if (type === "link") s.color = "var(--color-link-hover)";
    if (type === "text") s.background = "var(--gray-2)";
    if (type === "gradient") s.boxShadow = "0 2px 12px rgba(190,31,119,.35)";
  }
  return (
    <button style={{ ...s, opacity: "1" }} onClick={disabled ? undefined : onClick}
    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {icon && <i className={"fa-solid fa-" + icon} style={{ fontSize: 13 }}></i>}
      {children}
      {iconRight && <i className={"fa-solid fa-" + iconRight} style={{ fontSize: 11 }}></i>}
    </button>);

}

/* ---------- Tag ---------- */
const TAGS = {
  default: ["#FAFAFA", "#D6D6D6", "#515151"],
  success: ["#F4FBEE", "#B6E08A", "#5C932A"],
  available: ["#F4FBEE", "#B6E08A", "#5C932A"],
  info: ["#F0FAFF", "#A9D4F5", "#2774C1"],
  processing: ["#F0FAFF", "#A9D4F5", "#2774C1"],
  warning: ["#FFFBE6", "#FFE48C", "#D99413"],
  error: ["#FFF1F0", "#FFB3AE", "#E81C1C"],
  reserved: ["#FFF0F6", "#F5B6D4", "#BE1F77"]
};
function Tag({ status = "default", icon, children, style }) {
  const [bg, bd, fg] = TAGS[status] || TAGS.default;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 22,
      padding: "0 7px", borderRadius: 4, fontSize: 12, fontWeight: 500,
      background: bg, border: "1px solid " + bd, color: fg, whiteSpace: "nowrap", ...style }}>
      {icon && <i className={"fa-solid fa-" + icon} style={{ fontSize: 9 }}></i>}
      {children}
    </span>);

}

/* ---------- Switch ---------- */
function Switch({ on, onChange, size = "default" }) {
  const w = size === "small" ? 30 : 36,h = size === "small" ? 16 : 20,k = h - 4;
  return (
    <span onClick={() => onChange && onChange(!on)} style={{ width: w, height: h, borderRadius: 20,
      background: on ? "var(--color-link)" : "var(--gray-4)", position: "relative",
      display: "inline-block", cursor: "pointer", transition: "background .18s", flexShrink: 0 }}>
      <span style={{ position: "absolute", width: k, height: k, borderRadius: "50%", background: "#fff",
        top: 2, left: on ? w - k - 2 : 2, transition: "left .18s", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }}></span>
    </span>);

}

/* ---------- Checkbox ---------- */
function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
    onClick={(e) => {e.preventDefault();onChange && onChange(!checked);}}>
      <span style={{ width: 16, height: 16, borderRadius: 3, flexShrink: 0,
        border: "1px solid " + (checked ? "var(--color-primary)" : "var(--color-border)"),
        background: checked ? "var(--color-primary)" : "#fff", display: "inline-flex",
        alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
        {checked && <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 9 }}></i>}
      </span>
      {label && <span style={{ fontSize: 14, color: "var(--color-text)" }}>{label}</span>}
    </label>);

}

/* ---------- Avatar ---------- */
const AV_COLORS = ["#BE1F77", "#2774C1", "#72B433", "#D99413", "#7A0E4D", "#1E5E9E", "#5C932A"];
function Avatar({ name = "", size = 32, color, ring }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const c = color || AV_COLORS[(name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AV_COLORS.length];
  return (
    <span style={{ width: size, height: size, borderRadius: "50%", background: c, color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 600,
      fontSize: size * 0.4, flexShrink: 0, boxShadow: ring ? "0 0 0 2px #fff" : "none" }}>{initials}</span>);

}

/* ---------- Input ---------- */
function Input({ value, onChange, placeholder, icon, iconRight, prefix, error, autoFocus, onFocus, onBlur, style }) {
  const [focus, setFocus] = useStateC(false);
  return (
    <div style={{ height: 36, border: "1px solid " + (error ? "var(--color-error)" : focus ? "var(--color-link)" : "var(--color-border)"),
      borderRadius: 4, display: "flex", alignItems: "center", gap: 8, padding: "0 11px",
      background: "#fff", boxShadow: focus ? "0 0 0 2px rgba(39,116,193,.12)" : "none",
      transition: "border-color .15s, box-shadow .15s", ...style, opacity: "1" }}>
      {icon && <i className={"fa-solid fa-" + icon} style={{ color: "var(--gray-7)", fontSize: 13 }}></i>}
      {prefix}
      <input value={value} placeholder={placeholder} autoFocus={autoFocus}
      onChange={(e) => onChange && onChange(e.target.value)}
      onFocus={() => {setFocus(true);onFocus && onFocus();}}
      onBlur={() => {setFocus(false);onBlur && onBlur();}}
      style={{ flex: 1, border: "none", outline: "none", font: "400 14px/22px var(--font-sans)",
        color: "var(--color-text)", background: "transparent", minWidth: 0 }} />
      {iconRight && <i className={"fa-solid fa-" + iconRight} style={{ color: "var(--gray-7)", fontSize: 12 }}></i>}
    </div>);

}

/* ---------- Field (read-only / click-to-act) ---------- */
function Field({ icon, iconRight, value, placeholder, dashed, onClick, active, style }) {
  const [h, setH] = useStateC(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ height: 36, border: (dashed ? "1px dashed " : "1px solid ") + (active ? "var(--color-link)" : h && onClick ? "var(--color-primary)" : "var(--color-border)"),
      borderRadius: 4, display: "flex", alignItems: "center", gap: 8,
      fontSize: 14, background: "#fff", cursor: onClick ? "pointer" : "default", minWidth: 0,
      transition: "border-color .15s", ...style, padding: "12px 11px" }}>
      {icon && <i className={"fa-solid fa-" + icon} style={{ color: "var(--gray-7)", fontSize: 13 }}></i>}
      <span style={{ color: value ? "var(--color-text)" : "var(--gray-6)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value || placeholder}</span>
      {iconRight && <i className={"fa-solid fa-" + iconRight} style={{ color: "var(--gray-7)", fontSize: 12 }}></i>}
    </div>);

}

/* ---------- Section label ---------- */
function FieldLabel({ children, required, hint }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
      <span style={{ font: "400 14px/22px var(--font-sans)", color: "var(--color-text)" }}>
        {required && <span style={{ color: "var(--color-error)", marginRight: 3 }}>*</span>}{children}
      </span>
      {hint}
    </div>);

}

/* ---------- AI pill (gradient accent for AI moments) ---------- */
function AIChip({ children, onClick, icon = "wand-magic-sparkles" }) {
  const [h, setH] = useStateC(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 10px",
      borderRadius: 13, border: "1px solid transparent", cursor: "pointer", whiteSpace: "nowrap",
      background: "linear-gradient(95deg, rgba(190,31,119,.1), rgba(122,14,77,.12))",
      color: "var(--color-primary)", font: "500 12.5px/1 var(--font-sans)",
      boxShadow: h ? "0 0 0 1px var(--magenta-3)" : "0 0 0 1px transparent", transition: "box-shadow .15s" }}>
      <i className={"fa-solid fa-" + icon} style={{ fontSize: 11 }}></i>
      {children}
    </button>);

}

/* ---------- Tooltip-ish info dot ---------- */
function Dot({ color = "var(--green-6)", size = 8 }) {
  return <span style={{ width: size, height: size, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }}></span>;
}

Object.assign(window, { Btn, Tag, Switch, Checkbox, Avatar, Input, Field, FieldLabel, AIChip, Dot, AV_COLORS, TAGS });