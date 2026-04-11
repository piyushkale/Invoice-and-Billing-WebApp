const params = new URLSearchParams(window.location.search);
const invoiceId = params.get("id");

const token = localStorage.getItem("token");

let items = [];
let isOwner = false;

//  Load Invoice
async function loadInvoice() {
  try {
    const res = await axios.get(`/api/invoice/${invoiceId}`, {
      headers: token ? { Authorization: token } : {},
    });

    const inv = res.data.invoice;
    document.getElementById("bizName").innerText =
      res.data.details.businessName;
    document.getElementById("bizAddress").innerText =
      res.data.details.address;
    document.getElementById("bizPhone").innerText =
      res.data.details.phone;
    
    document.getElementById("customerName").value = inv.customerName;

    items = inv.items;
    renderItems();

    document.getElementById("total").innerText = inv.totalAmount;

    // Check ownership
    isOwner = res.data.isOwner;

    setupUI();
  } catch (err) {
    console.error(err);
  }
}

//  Render Items
function renderItems() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "flex gap-2";

    row.innerHTML = `
      <input value="${item.name}" 
        class="border p-2 w-1/3" 
        ${!isOwner ? "disabled" : ""}
        onchange="updateItem(${index}, 'name', this.value)" />

      <input value="${item.quantity}" 
        class="border p-2 w-1/4" 
        ${!isOwner ? "disabled" : ""}
        onchange="updateItem(${index}, 'quantity', this.value)" />

      <input value="${item.price}" 
        class="border p-2 w-1/4" 
        ${!isOwner ? "disabled" : ""}
        onchange="updateItem(${index}, 'price', this.value)" />

      ${
        isOwner
          ? `<button onclick="removeItem(${index})" class="bg-red-500 text-white px-2">X</button>`
          : ""
      }
    `;

    container.appendChild(row);
  });
}

//  Update item
function updateItem(index, field, value) {
  if (field === "quantity" || field === "price") {
    value = Number(value);
  }

  items[index][field] = value;
  calculateTotal();
}

//  Remove
function removeItem(index) {
  items.splice(index, 1);
  renderItems();
  calculateTotal();
}

//  Total
function calculateTotal() {
  const total = items.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);

  document.getElementById("total").innerText = total;
}

//  Setup UI based on ownership
function setupUI() {
  const actions = document.getElementById("actions");

  if (isOwner) {
    document.getElementById("customerName").disabled = false;

    actions.innerHTML = `
      <button onclick="addItem()" class="bg-blue-500 text-white px-3 py-1 rounded">
        + Item
      </button>

      <button onclick="updateInvoice()" class="bg-green-500 text-white px-3 py-1 rounded">
        Update
      </button>
    `;
  }
}

//  Add Item
function addItem() {
  items.push({ name: "", quantity: 1, price: 0 });
  renderItems();
}

//  Update API
async function updateInvoice() {
  try {
    await axios.put(
      `/api/invoice/${invoiceId}`,
      {
        customerName: document.getElementById("customerName").value,
        items,
      },
      {
        headers: { Authorization: token },
      },
    );

    alert("Invoice Updated!");
  } catch (err) {
    console.error(err);
  }
}

loadInvoice();
