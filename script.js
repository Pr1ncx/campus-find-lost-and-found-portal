const storageKey = "campus-find-items";

const initialItems = [
  {
    id: 1,
    type: "lost",
    category: "Accessories",
    name: "Black Water Bottle",
    location: "Library",
    date: "2026-10-24",
    contact: "sophia@campus.edu",
    description: "Black stainless steel bottle with a blue lid and a scratch on the lower left side.",
  },
  {
    id: 2,
    type: "found",
    category: "Electronics",
    name: "USB-C Charger",
    location: "Engineering Hall",
    date: "2026-10-23",
    contact: "desk@campus.edu",
    description: "Found near the student lab on the second floor. It has a white cable and a small sticker.",
  },
  {
    id: 3,
    type: "lost",
    category: "Books",
    name: "Chemistry Notebook",
    location: "Science Building",
    date: "2026-10-21",
    contact: "milos@campus.edu",
    description: "Blue notebook with handwritten formulas and a silver keychain attached.",
  },
  {
    id: 4,
    type: "found",
    category: "Documents",
    name: "Student ID Card",
    location: "Student Center",
    date: "2026-10-22",
    contact: "security@campus.edu",
    description: "Found near the cafeteria entrance. Please come to the student center desk for verification.",
  },
];

let items = JSON.parse(localStorage.getItem(storageKey)) || initialItems;

const itemsContainer = document.getElementById("itemsContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const reportForm = document.getElementById("reportForm");

let activeFilter = "all";
let searchTerm = "";

function saveItems() {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderItems() {
  const filteredItems = items.filter((item) => {
    const matchesType = activeFilter === "all" || item.type === activeFilter;
    const haystack = `${item.name} ${item.location} ${item.category} ${item.description}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  if (!filteredItems.length) {
    itemsContainer.innerHTML = `
      <div class="item-card" style="grid-column: 1 / -1;">
        <h3>No items found</h3>
        <p>Try another search term or submit a new listing for your campus community.</p>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="item-card">
          <div class="item-header">
            <span class="item-type ${item.type}">${item.type}</span>
            <span class="item-date">${formatDate(item.date)}</span>
          </div>

          <h3>${item.name}</h3>

          <div class="item-meta">
            <span>📍 ${item.location}</span>
            <span>🏷️ ${item.category}</span>
          </div>

          <p>${item.description}</p>

          <div class="item-footer">
            <strong>Contact: ${item.contact}</strong>
            <span class="contact-pill">${item.type === "lost" ? "Owner search" : "Finder listing"}</span>
          </div>
        </article>
      `
    )
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderItems();
  });
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  renderItems();
});

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newItem = {
    id: Date.now(),
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    name: document.getElementById("itemName").value.trim(),
    location: document.getElementById("location").value.trim(),
    date: document.getElementById("date").value,
    contact: document.getElementById("contact").value.trim(),
    description: document.getElementById("description").value.trim(),
  };

  items.unshift(newItem);
  saveItems();
  renderItems();
  reportForm.reset();
  alert("Your report has been posted successfully.");
});

renderItems();