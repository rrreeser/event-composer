/* Mock data for the Event composer prototype.
   Availability is expressed on a 8:00–18:00 timeline as busy [start,end] blocks
   in decimal hours (e.g. 9.5 = 9:30). */

const ORGANIZER = { name: "Tiffany Yu", email: "tiffany.yu@robinpowered.com", organizer: true, busy: [[9, 9.5], [13, 13.5]] };

const PEOPLE_POOL = [
  { name: "Theresa Webb", email: "twebb@example.com", busy: [[8.5, 9.5], [15, 16]] },
  { name: "Marcus Lee", email: "mlee@example.com", busy: [[10, 11], [13.5, 14]] },
  { name: "Priya Nair", email: "pnair@example.com", busy: [[8, 9], [12, 13]] },
  { name: "Devon Carter", email: "dcarter@example.com", busy: [[11, 12], [16.5, 17.5]] },
  { name: "Sofia Romano", email: "sromano@example.com", busy: [[9, 10], [14, 14.5]] },
  { name: "Aiden Brooks", email: "abrooks@example.com", busy: [[13, 14.5]] },
  { name: "Mei Chen", email: "mchen@example.com", busy: [[8, 8.5], [10.5, 11.5], [15.5, 16]] },
  { name: "Jordan Pierce", email: "jpierce@example.com", busy: [[12, 12.5], [16, 17]] },
  { name: "Lucas Ferreira", email: "lferreira@example.com", busy: [[9.5, 10.5]] },
  { name: "Hana Park", email: "hpark@example.com", busy: [[11.5, 12.5], [14, 15]] },
];

/* Bookable rooms shown on the schematic floor map.
   Geometry is a rectangle in % of the floor box: rx/ry = top-left, rw/rh = size.
   `available` drives the green (free) vs grey (booked/unavailable) treatment. */
const ROOMS = [
  // Left column (top → bottom)
  { id: "mission",  name: "Mission Control", floor: "Floor 1", building: "Boston HQ", cap: 14, available: true,
    amenities: ["tv", "video", "phone"], extra: 3, rx: 2, ry: 3, rw: 15, rh: 28,
    // bookings per weekday occurrence (used by recurring series health)
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[13, 14]] },
  { id: "echo",     name: "Echo Chamber",    floor: "Floor 1", building: "Boston HQ", cap: 6,  available: true,
    amenities: ["tv", "video"], extra: 1, rx: 2, ry: 33, rw: 15, rh: 28,
    series: [1,1,1,1,0,1,1,1,1,1,1,1], dayBusy: [[10, 11]] },
  { id: "falcon",   name: "Millenium Falcon",floor: "Floor 1", building: "Boston HQ", cap: 10, available: true,
    amenities: ["tv", "video", "phone"], extra: 2, rx: 2, ry: 63, rw: 15, rh: 34,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[15, 16]] },
  // Top edge (left → right)
  { id: "mandalore",name: "Mandalore",       floor: "Floor 1", building: "Boston HQ", cap: 8,  available: false,
    amenities: ["tv", "video"], extra: 1, rx: 19, ry: 3, rw: 20, rh: 17,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[9, 17]] },
  { id: "starship", name: "Starship",        floor: "Floor 1", building: "Boston HQ", cap: 12, available: true,
    amenities: ["tv", "video", "phone"], extra: 2, rx: 41, ry: 3, rw: 19, rh: 17,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[11, 12]] },
  { id: "mercury",  name: "Mercury",         floor: "Floor 1", building: "Boston HQ", cap: 4,  available: true,
    amenities: ["tv"], extra: 0, rx: 62, ry: 3, rw: 19, rh: 17,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [] },
  // Right column (top → bottom)
  { id: "hoth",     name: "Hoth",            floor: "Floor 1", building: "Boston HQ", cap: 8,  available: false,
    amenities: ["tv", "video"], extra: 1, rx: 83, ry: 3, rw: 15, rh: 28,
    series: [0,1,1,0,1,1,0,1,1,0,1,1], dayBusy: [[8, 18]] },
  { id: "alderaan", name: "Alderaan",        floor: "Floor 1", building: "Boston HQ", cap: 6,  available: true,
    amenities: ["tv", "video"], extra: 1, rx: 83, ry: 33, rw: 15, rh: 28,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[14, 15]] },
  { id: "solaris",  name: "Solaris",         floor: "Floor 1", building: "Boston HQ", cap: 8,  available: true,
    amenities: ["tv", "video"], extra: 1, rx: 83, ry: 63, rw: 15, rh: 34,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[11, 12.5]] },
  // Bottom edge
  { id: "whiskey",  name: "Whiskey Lounge",  floor: "Floor 1", building: "Boston HQ", cap: 12, available: true,
    amenities: ["tv", "video", "phone"], extra: 2, rx: 30, ry: 80, rw: 40, rh: 17, requestOnly: true,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[15, 16]] },
];

/* Desks clustered into pods in the open center of the floor.
   ~half are available (green), half booked (grey). Geometry in % of floor box. */
function buildDesks() {
  const pods = [
    { cx: 31, cy: 35, cols: 4 },
    { cx: 67, cy: 35, cols: 3 },
    { cx: 31, cy: 64, cols: 3 },
    { cx: 67, cy: 64, cols: 4 },
  ];
  const W = 4, H = 5, GAPX = 1.6, SPINE = 4;
  const desks = [];
  let i = 0;
  pods.forEach((p) => {
    const rowW = p.cols * W + (p.cols - 1) * GAPX;
    const startX = p.cx - rowW / 2;
    [-1, 1].forEach((dir) => {
      for (let c = 0; c < p.cols; c++) {
        const x = startX + c * (W + GAPX);
        const y = dir < 0 ? p.cy - SPINE / 2 - H : p.cy + SPINE / 2;
        desks.push({ id: "desk-" + i, x, y, w: W, h: H, available: i % 2 === 0 });
        i++;
      }
    });
  });
  return desks;
}
const DESKS = buildDesks();

/* Floor 2 rooms — different perimeter layout from Floor 1:
   2 tall rooms on each side instead of 3, 2 wider rooms across the top. */
const ROOMS_F2 = [
  // Left column (2 tall)
  { id: "f2-pulsar",    name: "Pulsar",    floor: "Floor 2", building: "Boston HQ", cap: 12, available: true,
    amenities: ["tv", "video", "phone"], extra: 1, rx: 2, ry: 3,  rw: 15, rh: 44,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [] },
  { id: "f2-andromeda", name: "Andromeda", floor: "Floor 2", building: "Boston HQ", cap: 6,  available: false,
    amenities: ["tv"], extra: 0, rx: 2, ry: 49, rw: 15, rh: 48,
    series: [1,1,1,1,0,1,1,1,1,1,1,1], dayBusy: [[8, 18]] },
  // Top row (2 wider)
  { id: "f2-nebula",    name: "Nebula",    floor: "Floor 2", building: "Boston HQ", cap: 10, available: true,
    amenities: ["tv", "video"], extra: 2, rx: 19, ry: 3,  rw: 32, rh: 17,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[11, 12]] },
  { id: "f2-orion",     name: "Orion",     floor: "Floor 2", building: "Boston HQ", cap: 6,  available: false,
    amenities: ["tv"], extra: 1, rx: 53, ry: 3,  rw: 28, rh: 17,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[9, 17]] },
  // Right column (2 tall)
  { id: "f2-cosmos",    name: "Cosmos",    floor: "Floor 2", building: "Boston HQ", cap: 8,  available: true,
    amenities: ["tv", "video"], extra: 1, rx: 83, ry: 3,  rw: 15, rh: 44,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[14, 15]] },
  { id: "f2-quasar",    name: "Quasar",    floor: "Floor 2", building: "Boston HQ", cap: 4,  available: true,
    amenities: ["tv"], extra: 0, rx: 83, ry: 49, rw: 15, rh: 48,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [] },
  // Bottom (1 wider span than Floor 1)
  { id: "f2-horizon",   name: "Horizon",   floor: "Floor 2", building: "Boston HQ", cap: 20, available: true,
    amenities: ["tv", "video", "phone"], extra: 3, rx: 19, ry: 81, rw: 62, rh: 16, requestOnly: true,
    series: [1,1,1,1,1,1,1,1,1,1,1,1], dayBusy: [[15, 16]] },
];

/* Floor 2 desks — 3 pods in different positions than Floor 1's 4 pods. */
function buildDesksF2() {
  const pods = [
    { cx: 35, cy: 38, cols: 3 },
    { cx: 65, cy: 38, cols: 4 },
    { cx: 50, cy: 63, cols: 3 },
  ];
  const W = 4, H = 5, GAPX = 1.6, SPINE = 4;
  const desks = [];
  let i = 0;
  pods.forEach((p) => {
    const rowW = p.cols * W + (p.cols - 1) * GAPX;
    const startX = p.cx - rowW / 2;
    [-1, 1].forEach((dir) => {
      for (let c = 0; c < p.cols; c++) {
        const x = startX + c * (W + GAPX);
        const y = dir < 0 ? p.cy - SPINE / 2 - H : p.cy + SPINE / 2;
        desks.push({ id: "f2-desk-" + i, x, y, w: W, h: H, available: i % 3 !== 0 });
        i++;
      }
    });
  });
  return desks;
}
const DESKS_F2 = buildDesksF2();

const FLOOR_DATA = {
  1: { label: "Floor 1", rooms: ROOMS,    desks: DESKS },
  2: { label: "Floor 2", rooms: ROOMS_F2, desks: DESKS_F2 },
};

/* Service request catalog */
const SERVICES = [
  { id: "coffee", label: "Coffee & tea", price: 12, icon: "mug-hot" },
  { id: "lunch",  label: "Catered lunch", price: 0, icon: "utensils" },
  { id: "av",     label: "AV setup", price: 0, icon: "video" },
];

/* Smart-scheduling suggested slots (computed-feel; precomputed for the demo).
   freeOf = number free out of total invited. */
function buildSuggestions(attendees) {
  const total = attendees.length || 1;
  return [
    { day: "Today", date: "Nov 2", start: 14,   end: 14.5, free: total,             label: "2:00 PM" },
    { day: "Today", date: "Nov 2", start: 16,   end: 16.5, free: Math.max(total-1,1),label: "4:00 PM" },
    { day: "Tomorrow", date: "Nov 3", start: 10.5, end: 11, free: total,            label: "10:30 AM" },
    { day: "Thu",   date: "Nov 4", start: 9,    end: 9.5,  free: total,             label: "9:00 AM" },
    { day: "Thu",   date: "Nov 4", start: 15.5, end: 16,   free: Math.max(total-2,1),label: "3:30 PM" },
  ];
}

const HOURS = { start: 8, end: 18 }; // timeline range

function fmtTime(h) {
  const hr = Math.floor(h), m = Math.round((h - hr) * 60);
  const ap = hr >= 12 ? "PM" : "AM";
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return h12 + (m ? ":" + String(m).padStart(2, "0") : ":00") + " " + ap;
}
function fmtTimeShort(h) {
  const hr = Math.floor(h), m = Math.round((h - hr) * 60);
  const ap = hr >= 12 ? "p" : "a";
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return h12 + (m ? ":" + String(m).padStart(2, "0") : "") + ap;
}

Object.assign(window, { ORGANIZER, PEOPLE_POOL, ROOMS, DESKS, ROOMS_F2, DESKS_F2, FLOOR_DATA, SERVICES, buildSuggestions, HOURS, fmtTime, fmtTimeShort });
