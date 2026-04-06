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
    headers: { Authorization: token }
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
  const res = await axios.get("http://localhost:3000/invoice", {
    headers: { Authorization: token }
  });

  const invoices = res.data;
  renderInvoices(invoices);
}

function renderInvoices(invoices) {
  const table = document.getElementById("invoiceTable");
  table.innerHTML = "";

  invoices.forEach(inv => {
    const row = `
      <tr class="border-b hover:bg-gray-50">
        <td class="py-2">${inv.clientName}</td>
        <td>₹${inv.totalAmount}</td>
        <td>
          <span class="${inv.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}">
            ${inv.status}
          </span>
        </td>
        <td>${new Date(inv.createdAt).toLocaleDateString()}</td>
        <td class="space-x-2">
          <button onclick="downloadPDF('${inv._id}')" class="text-blue-500">PDF</button>
          <button onclick="deleteInvoice('${inv._id}')" class="text-red-500">Delete</button>
        </td>
      </tr>
    `;

    table.innerHTML += row;
  });
}

// Delete
async function deleteInvoice(id) {
  await axios.delete(`http://localhost:3000/invoice/${id}`, {
    headers: { Authorization: token }
  });

  loadInvoices();
}

// PDF
function downloadPDF(id) {
  window.open(`http://localhost:3000/invoice/pdf/${id}?token=${token}`);
}

//  Navigation
function goToCreate() {
  window.location.href = "/create-invoice.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}

loadDashboard();

function goToEditProfile() {
  window.location.href = "/edit-business.html";
}