const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/index.html";
}

// Load everything
async function loadDashboard() {
  try {
    await loadBusiness();
    await loadInvoices();
  } catch (err) {
    console.error(err);
  }
}

// Business
async function loadBusiness() {
  const res = await axios.get("api/businessProfile", {
    headers: { Authorization: token },
  });

  const biz = res.data;
  document.getElementById("businessName").innerText = biz.businessName;
  document.getElementById("bizName").innerText = biz.businessName;
  document.getElementById("bizAddress").innerText = biz.address;
  document.getElementById("bizPhone").innerText = biz.phone;
  document.getElementById("bizGST").innerText = biz.gst || "N/A";
}

// Invoices
async function loadInvoices() {
  const res = await axios.get("/api/invoice", {
    headers: { Authorization: token },
  });

  const invoices = res.data.invoices;
  document.getElementById("last30Id").innerText = `Rs ${res.data.total}`;
  document.getElementById("lastYearId").innerText = `Rs ${res.data.totalYear}`;
  document.getElementById("billsId").innerText = `${res.data.count}`;
  renderInvoices(invoices);
}

function renderInvoices(invoices) {
  const table = document.getElementById("invoiceTable");
  table.innerHTML = "";

  invoices.forEach((inv) => {
    const url = `http://localhost:3000/invoice.html?id=${inv._id}`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(url)}`;
    const row = `
      <tr class="border-b hover:bg-gray-50">
        <td class="py-2 cursor-pointer hover:bg-blue-100 transition-all duration-100" onclick="window.location.href ='/invoice.html?id=${inv._id}'">${inv.customerName}</td>
        <td>₹${inv.totalAmount}</td>
       
        <td>${new Date(inv.createdAt).toLocaleDateString()}</td>
        <td class="space-x-2">
          <button onclick="downloadPDF('${inv._id}')" class="text-blue-500 hover:bg-red-500 px-1 hover:text-white cursor-pointer">PDF</button>
      <button onclick="copyLink('${inv._id}')"
  class="text-blue-500 hover:bg-blue-500/80 px-1 hover:text-white cursor-pointer">
  Share 🔗
</button>
     
 <button onclick="window.open('${whatsappLink}','_blank');"
  class="text-green-500 hover:bg-green-500/80 px-1 hover:text-white cursor-pointer">
  Whatsapp 
</button>

          <button onclick="deleteInvoice('${inv._id}')" class="text-red-500 hover:bg-red-500 px-1 hover:text-white cursor-pointer">Delete</button>
        </td>
      </tr>
    `;

    table.innerHTML += row;
  });
}

// Delete
async function deleteInvoice(id) {
  await axios.delete(`http://localhost:3000/invoice/${id}`, {
    headers: { Authorization: token },
  });

  loadInvoices();
}

// PDF
async function downloadPDF(id) {
  const token = localStorage.getItem("token");

  const res = await axios.get(`http://localhost:3000/api/invoice/${id}/pdf`, {
    headers: { Authorization: token },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));

  const a = document.createElement("a");

  a.href = url;
  a.download = `invoice-${id}.pdf`;
  a.click();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}

loadDashboard();

function goToEditProfile() {
  window.location.href = "/edit-business.html";
}

let items = [];

function addItem() {
  items.push({ name: "", quantity: 1, price: 0 });
  renderItems();
  calculateTotal();
}

function renderItems() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "flex gap-2";

    div.innerHTML = `
      <input type="text" placeholder="Item" value="${item.name}"
        onchange="updateItem(${index}, 'name', this.value)"
        class="border p-2 w-1/3"/>

      <input type="number" placeholder="Qty"
        value="${item.quantity}"
        onchange="updateItem(${index}, 'quantity', this.value)"
        class="border p-2 w-1/4"/>

      <input type="number" placeholder="Price" value="${item.price}"
        onchange="updateItem(${index}, 'price', this.value)"
        class="border p-2 w-1/4"/>

      <button onclick="removeItem(${index})"
        class="bg-red-500 text-white px-2">X</button>
    `;

    container.appendChild(div);
  });
}

function updateItem(index, field, value) {
  if (field === "quantity" || field === "price") {
    value = Number(value);
  }

  items[index][field] = value;
  renderItems();
  calculateTotal();
}

function removeItem(index) {
  items.splice(index, 1);
  renderItems();
  calculateTotal();
}

function calculateTotal() {
  const total = items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  document.getElementById("total").innerText = total;
}

async function createInvoice() {
  const customerName = document.getElementById("customerName").value;

  if (!customerName || items.length === 0) {
    return alert("Fill all fields");
  }

  try {
    await axios.post(
      "/api/invoice/",
      {
        customerName,
        items,
      },
      {
        headers: { Authorization: token },
      },
    );

    alert("Invoice Created!");
    items = [];
    renderItems();
    addItem();
    loadInvoices();
    document.getElementById("customerName").value = "";
  } catch (err) {
    console.error(err);
    alert("Error creating invoice");
  }
}

addItem();

function copyLink(id) {
  const url = `http://localhost:3000/invoice.html?id=${id}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert("Link copied!");
    })
    .catch((err) => {
      console.error(err);
    });
}
