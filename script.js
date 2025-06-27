const submitBtn = document.getElementById("submitBtn");
const nameField = document.getElementById("nameField");
const costField = document.getElementById("costField");
const stockField = document.getElementById("stockField");
const descField = document.getElementById("descField");
const productDisplay = document.getElementById("productDisplay");

let products = [];
let nextId = 1;

// Load from localStorage on startup
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("productDB");
  if (stored) {
    products = JSON.parse(stored);
    products.forEach(p => renderProduct(p));
    nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  }
});

function createProductObject() {
  return {
    id: nextId++,
    title: nameField.value.trim(),
    price: parseFloat(costField.value),
    quantity: parseInt(stockField.value),
    info: descField.value.trim(),
    availability: 'in stock'
  };
}

function clearForm() {
  nameField.value = '';
  costField.value = '';
  stockField.value = '';
  descField.value = '';
}

function updateStorage() {
  localStorage.setItem("productDB", JSON.stringify(products));
}

function renderProduct(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const content = document.createElement("div");
  content.innerHTML = `
    <strong>${product.title}</strong><br>
    ₹${product.price} - ${product.quantity} in stock<br>
    ${product.info}<br>
    Status: <span class="status">${product.availability}</span>
  `;

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.checked = product.availability === "out of stock";
  toggle.title = "Toggle stock status";
  toggle.addEventListener("change", () => {
    product.availability = toggle.checked ? "out of stock" : "in stock";
    content.querySelector(".status").innerText = product.availability;
    updateStorage();
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    content.innerHTML = `
      <input type="text" value="${product.title}" id="editTitle${product.id}">
      <input type="number" value="${product.price}" id="editPrice${product.id}">
      <input type="number" value="${product.quantity}" id="editQty${product.id}">
      <input type="text" value="${product.info}" id="editInfo${product.id}">
      <button id="saveBtn${product.id}">Save</button>
      <button id="cancelBtn${product.id}">Cancel</button>
    `;
    document.getElementById(`saveBtn${product.id}`).onclick = () => {
      product.title = document.getElementById(`editTitle${product.id}`).value.trim();
      product.price = parseFloat(document.getElementById(`editPrice${product.id}`).value);
      product.quantity = parseInt(document.getElementById(`editQty${product.id}`).value);
      product.info = document.getElementById(`editInfo${product.id}`).value.trim();
      updateStorage();
      card.remove();
      renderProduct(product);
    };
    document.getElementById(`cancelBtn${product.id}`).onclick = () => {
      card.remove();
      renderProduct(product);
    };
  };

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.onclick = () => {
    card.remove();
    products = products.filter(p => p.id !== product.id);
    updateStorage();
  };

  card.append(content, toggle, editBtn, removeBtn);
  productDisplay.appendChild(card);
}

function addProduct() {
  const newItem = createProductObject();

  const existing = products.find(p => p.title === newItem.title && p.price === newItem.price);
  if (existing) {
    existing.quantity += newItem.quantity;
    updateStorage();
    productDisplay.innerHTML = "";
    products.forEach(p => renderProduct(p));
  } else {
    products.push(newItem);
    renderProduct(newItem);
    updateStorage();
  }

  clearForm();
}

[nameField, costField, stockField, descField].forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addProduct();
  });
});

submitBtn.addEventListener("click", addProduct);
