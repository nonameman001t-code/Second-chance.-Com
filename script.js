/* ------------------------------------------------------------------
   SECOND CHANCE CARS – car data
   To add or edit a car, change this list. Prices are in FCFA.
   Photos: put real pictures in the /images folder using the name
   shown in each colour's "img" field (example: images/corolla-silver.jpg).
   If a photo is missing, a coloured car drawing is shown instead.
------------------------------------------------------------------- */
const CARS = [
  { id:"corolla", name:"Toyota Corolla", year:2012, type:"Sedan", mileage:"142,000 km", fuel:"Petrol", gearbox:"Automatic",
    colors:[
      {name:"Silver", hex:"#B8BCC2", price:4200000, img:"images/corolla-silver.jpg"},
      {name:"White",  hex:"#F4F4F4", price:4300000, img:"images/corolla-white.jpg"},
      {name:"Black",  hex:"#1B1B1B", price:4400000, img:"images/corolla-black.jpg"}],
    reviews:[
      {name:"Ngwa P.", stars:5, text:"Very fuel efficient and the engine is smooth. Perfect for daily taxi work."},
      {name:"Sandrine T.", stars:4, text:"Clean inside, only small scratches. Fair price."}]},

  { id:"accent", name:"Hyundai Accent", year:2013, type:"Sedan", mileage:"118,000 km", fuel:"Petrol", gearbox:"Manual",
    colors:[
      {name:"Red",  hex:"#B3202A", price:3100000, img:"images/accent-red.jpg"},
      {name:"Grey", hex:"#7A7F85", price:3000000, img:"images/accent-grey.jpg"},
      {name:"Blue", hex:"#1F4E9C", price:3150000, img:"images/accent-blue.jpg"}],
    reviews:[
      {name:"Ernest K.", stars:4, text:"Cheap to run and spare parts are easy to find."},
      {name:"Mireille A.", stars:4, text:"Good first car. AC works very well."}]},

  { id:"sentra", name:"Nissan Sentra", year:2011, type:"Sedan", mileage:"156,000 km", fuel:"Petrol", gearbox:"Automatic",
    colors:[
      {name:"Gold",  hex:"#C2A25B", price:2900000, img:"images/sentra-gold.jpg"},
      {name:"Black", hex:"#1B1B1B", price:3000000, img:"images/sentra-black.jpg"}],
    reviews:[
      {name:"Thomas B.", stars:4, text:"Comfortable on bad roads. Good value for the money."}]},

  { id:"rav4", name:"Toyota RAV4", year:2010, type:"SUV", mileage:"168,000 km", fuel:"Petrol", gearbox:"Automatic",
    colors:[
      {name:"Green",  hex:"#4F6B4A", price:6800000, img:"images/rav4-green.jpg"},
      {name:"Silver", hex:"#B8BCC2", price:6900000, img:"images/rav4-silver.jpg"},
      {name:"Black",  hex:"#1B1B1B", price:7100000, img:"images/rav4-black.jpg"}],
    reviews:[
      {name:"Dr. Fon", stars:5, text:"Strong on the hills around Bamenda and very comfortable for the family."},
      {name:"Alice M.", stars:5, text:"Solid car, no surprises after three months."}]},

  { id:"crv", name:"Honda CR-V", year:2009, type:"SUV", mileage:"175,000 km", fuel:"Petrol", gearbox:"Automatic",
    colors:[
      {name:"Blue",  hex:"#2C4B7C", price:6200000, img:"images/crv-blue.jpg"},
      {name:"White", hex:"#F4F4F4", price:6400000, img:"images/crv-white.jpg"}],
    reviews:[
      {name:"Joseph N.", stars:4, text:"Spacious and smooth. Fuel use is a bit high in town."}]},

  { id:"hilux", name:"Toyota Hilux", year:2008, type:"Pickup", mileage:"210,000 km", fuel:"Diesel", gearbox:"Manual",
    colors:[
      {name:"White",  hex:"#F4F4F4", price:7500000, img:"images/hilux-white.jpg"},
      {name:"Silver", hex:"#B8BCC2", price:7600000, img:"images/hilux-silver.jpg"},
      {name:"Beige",  hex:"#CDBB93", price:7400000, img:"images/hilux-beige.jpg"}],
    reviews:[
      {name:"Cooperative Agri", stars:5, text:"Carries our farm loads every week and never complains."},
      {name:"Peter L.", stars:4, text:"Tough truck. Suspension is firm when empty."}]},

  { id:"hiace", name:"Toyota Hiace", year:2007, type:"Van / Bus", mileage:"230,000 km", fuel:"Diesel", gearbox:"Manual",
    colors:[
      {name:"White",  hex:"#F4F4F4", price:5900000, img:"images/hiace-white.jpg"},
      {name:"Silver", hex:"#B8BCC2", price:6000000, img:"images/hiace-silver.jpg"}],
    reviews:[
      {name:"Bright Transport", stars:5, text:"Seats 14 comfortably and the engine is still strong."}]}
];

const TYPES = ["All", ...new Set(CARS.map(c => c.type))];
const fmt = n => n.toLocaleString("en-US") + " FCFA";
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);

/* Fallback drawing used when a photo file is not found */
function carSVG(hex){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
  <rect width='300' height='200' fill='#E4EAE8'/><rect y='150' width='300' height='50' fill='#cfd8d5'/>
  <path d='M30 125c0-14 8-26 22-30l30-4 22-26c4-5 9-7 15-7h50c7 0 13 3 17 8l20 26 30 6c10 2 16 10 16 20v12H30z' fill='${hex}' stroke='#101820' stroke-opacity='.35' stroke-width='2'/>
  <path d='M104 94l18-22h46l20 22z' fill='#cfe6ee' stroke='#101820' stroke-opacity='.35'/>
  <circle cx='80' cy='140' r='20' fill='#101820'/><circle cx='80' cy='140' r='8' fill='#ccc'/>
  <circle cx='222' cy='140' r='20' fill='#101820'/><circle cx='222' cy='140' r='8' fill='#ccc'/></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
function setImg(el, src, hex, alt){
  el.alt = alt;
  el.onerror = () => { el.onerror = null; el.src = carSVG(hex); };
  el.src = src;
}
const lowest = car => Math.min(...car.colors.map(c => c.price));

/* ---------- Listing ---------- */
const filtersEl = document.getElementById("filters");
const groupsEl  = document.getElementById("groups");
let activeType = "All";

function renderFilters(){
  filtersEl.innerHTML = "";
  TYPES.forEach(t => {
    const b = document.createElement("button");
    b.textContent = t;
    b.setAttribute("role","tab");
    b.setAttribute("aria-selected", t === activeType);
    b.onclick = () => { activeType = t; renderFilters(); renderCars(); };
    filtersEl.appendChild(b);
  });
}

function renderCars(){
  groupsEl.innerHTML = "";
  TYPES.filter(t => t !== "All" && (activeType === "All" || activeType === t)).forEach(type => {
    const group = document.createElement("div");
    group.className = "group";
    group.innerHTML = `<h3>${type}</h3><div class="grid"></div>`;
    const grid = group.querySelector(".grid");
    CARS.filter(c => c.type === type).forEach(car => {
      const first = car.colors[0];
      const card = document.createElement("button");
      card.className = "card";
      card.type = "button";
      card.innerHTML = `<img><div class="card-body">
        <h4>${car.name} ${car.year}</h4>
        <p class="meta">${car.mileage} · ${car.gearbox} · ${car.fuel}</p>
        <p class="from">From ${fmt(lowest(car))}</p>
        <div class="dots">${car.colors.map(c => `<i style="background:${c.hex}" title="${c.name}"></i>`).join("")}</div>
      </div>`;
      setImg(card.querySelector("img"), first.img, first.hex, `${car.name} in ${first.name}`);
      card.onclick = () => openCar(car);
      grid.appendChild(card);
    });
    groupsEl.appendChild(group);
  });
}

/* ---------- Detail dialog ---------- */
const dlg = document.getElementById("carDialog");
const $ = id => document.getElementById(id);

function openCar(car){
  $("dTitle").textContent = `${car.name} ${car.year}`;
  $("dMeta").textContent = `${car.type} · ${car.mileage} · ${car.gearbox} · ${car.fuel}`;

  const avg = car.reviews.reduce((s,r) => s + r.stars, 0) / car.reviews.length;
  $("dRating").textContent = `${avg.toFixed(1)} / 5 (${car.reviews.length})`;
  $("dReviews").innerHTML = car.reviews.map(r =>
    `<div class="review"><span class="stars">${stars(r.stars)}</span> <b>${r.name}</b><p>${r.text}</p></div>`).join("");

  $("colourList").innerHTML = "";
  $("swatches").innerHTML = "";
  car.colors.forEach((c, i) => {
    const s = document.createElement("button");
    s.className = "swatch"; s.type = "button";
    s.style.background = c.hex;
    s.title = c.name;
    s.setAttribute("role","radio");
    s.setAttribute("aria-label", `${c.name}, ${fmt(c.price)}`);
    s.onclick = () => pick(i);
    $("swatches").appendChild(s);

    const row = document.createElement("div");
    row.innerHTML = `<span>${c.name}</span><span>${fmt(c.price)}</span>`;
    row.style.cursor = "pointer";
    row.onclick = () => pick(i);
    $("colourList").appendChild(row);
  });

  function pick(i){
    const c = car.colors[i];
    setImg($("dImg"), c.img, c.hex, `${car.name} in ${c.name}`);
    $("dPrice").textContent = fmt(c.price);
    $("dColor").textContent = `Colour: ${c.name}`;
    [...$("swatches").children].forEach((el, k) => el.setAttribute("aria-checked", k === i));
    [...$("colourList").children].forEach((el, k) => el.classList.toggle("on", k === i));
    $("dEnquire").onclick = () => {
      dlg.close();
      document.querySelector("textarea[name=message]").value =
        `Hello, I am interested in the ${c.name} ${car.name} ${car.year} (${fmt(c.price)}).`;
    };
  }
  pick(0);
  dlg.showModal();
}
$("closeBtn").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

/* ---------- Hero image, contact form, footer ---------- */
setImg($("heroImg"), "images/hero.jpg", "#0F4C4A", "Used cars available at Second Chance Cars");

/* Change this to your real WhatsApp number (country code, no + or spaces) */
const WHATSAPP_NUMBER = "237600000000";
$("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const text = `Hello Second Chance Cars. I am ${f.get("name")} (${f.get("phone")}). ${f.get("message")}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
});
$("year").textContent = new Date().getFullYear();

renderFilters();
renderCars();
