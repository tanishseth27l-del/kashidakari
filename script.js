// ================================
// Kashidakari — frontend behaviour
// ================================

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle?.addEventListener("click", () => {
  mainNav.style.display = mainNav.style.display === "flex" ? "none" : "flex";
  mainNav.style.flexDirection = "column";
  mainNav.style.position = "absolute";
  mainNav.style.top = "64px";
  mainNav.style.left = "0";
  mainNav.style.right = "0";
  mainNav.style.background = "#FAF6EE";
  mainNav.style.padding = "18px 24px";
  mainNav.style.gap = "1em";
  mainNav.style.borderBottom = "1px solid rgba(46,49,72,.1)";
});

// ---------- Order list state ----------
let orderItems = []; // array of item names (strings)

const selectedList = document.getElementById("selectedList");
const itemPicker = document.getElementById("itemPicker");
const addItemBtn = document.getElementById("addItemBtn");
const waOrderBtn = document.getElementById("waOrderBtn");

const SHOP_WHATSAPP_NUMBER = "919335902489";

function renderSelectedList() {
  if (orderItems.length === 0) {
    selectedList.innerHTML = `<li class="muted">Abhi khaali hai — collection se items jodein</li>`;
    return;
  }
  selectedList.innerHTML = orderItems
    .map(
      (item, idx) =>
        `<li>${item} <button type="button" data-idx="${idx}" class="remove-item">Hatayein ✕</button></li>`
    )
    .join("");

  selectedList.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.idx, 10);
      orderItems.splice(i, 1);
      renderSelectedList();
      updateWhatsAppLink();
    });
  });
}

function addItem(name) {
  if (!name) return;
  orderItems.push(name);
  renderSelectedList();
  updateWhatsAppLink();
}

// Buttons on collection cards
document.querySelectorAll(".add-order").forEach((btn) => {
  btn.addEventListener("click", () => {
    addItem(btn.dataset.item);
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });
  });
});

// "+ List mein jodein" button next to dropdown
addItemBtn?.addEventListener("click", () => {
  const val = itemPicker.value;
  if (!val) return;
  addItem(val);
  itemPicker.value = "";
});

// ---------- WhatsApp order link ----------
function updateWhatsAppLink() {
  const name = document.getElementById("ofName").value.trim();
  const phone = document.getElementById("ofPhone").value.trim();
  const address = document.getElementById("ofAddress").value.trim();
  const notes = document.getElementById("ofNotes").value.trim();

  let msg = `Namaste Kashidakari,\nMujhe order karna hai:\n`;
  msg += orderItems.length ? orderItems.map((i) => `- ${i}`).join("\n") : "- (item batayenge)";
  msg += `\n\nNaam: ${name || "-"}`;
  msg += `\nPhone: ${phone || "-"}`;
  if (address) msg += `\nAddress: ${address}`;
  if (notes) msg += `\nNote: ${notes}`;

  const encoded = encodeURIComponent(msg);
  waOrderBtn.href = `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encoded}`;
}

["ofName", "ofPhone", "ofAddress", "ofNotes"].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateWhatsAppLink);
});
updateWhatsAppLink();
renderSelectedList();

// ---------- Order form submit (saves to backend) ----------
const orderForm = document.getElementById("orderForm");
const orderStatus = document.getElementById("orderStatus");

orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("ofName").value.trim(),
    phone: document.getElementById("ofPhone").value.trim(),
    address: document.getElementById("ofAddress").value.trim(),
    notes: document.getElementById("ofNotes").value.trim(),
    items: orderItems,
  };

  if (payload.items.length === 0) {
    orderStatus.textContent = "Kam se kam ek item collection se chunein.";
    orderStatus.className = "form-status err";
    return;
  }

  orderStatus.textContent = "Bhej rahe hain...";
  orderStatus.className = "form-status";

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      orderStatus.textContent = "✔ " + data.message;
      orderStatus.className = "form-status ok";
      orderForm.reset();
      orderItems = [];
      renderSelectedList();
      updateWhatsAppLink();
    } else {
      orderStatus.textContent = data.message || "Kuch galat ho gaya, dobara try karein.";
      orderStatus.className = "form-status err";
    }
  } catch (err) {
    orderStatus.textContent = "Server tak nahi pahunch paye. WhatsApp button se order bhejein.";
    orderStatus.className = "form-status err";
  }
});

// ---------- Contact form submit ----------
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById("cfName").value.trim(),
    phone: document.getElementById("cfPhone").value.trim(),
    message: document.getElementById("cfMessage").value.trim(),
  };

  contactStatus.textContent = "Bhej rahe hain...";
  contactStatus.className = "form-status";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      contactStatus.textContent = "✔ " + data.message;
      contactStatus.className = "form-status ok";
      contactForm.reset();
    } else {
      contactStatus.textContent = data.message || "Kuch galat ho gaya.";
      contactStatus.className = "form-status err";
    }
  } catch (err) {
    contactStatus.textContent = "Server tak nahi pahunch paye.";
    contactStatus.className = "form-status err";
  }
});
