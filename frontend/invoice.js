const params = new URLSearchParams(window.location.search);
const invoiceId = params.get("id");

const token = localStorage.getItem("token");
let premiumUser = false;
let items = [];
let isOwner = false;

//  Load Invoice
async function loadInvoice() {
  try {
    const res = await axios.get(`/api/invoice/${invoiceId}`, {
      headers: token ? { Authorization: token } : {},
    });

    const inv = res.data.invoice;
    premiumUser = res.data.details.isPremium;
    await checkPremium();
    document.getElementById("bizName").innerText =
      res.data.details.businessName;
    document.getElementById("bizAddress").innerText = res.data.details.address;
    document.getElementById("bizPhone").innerText = res.data.details.phone;

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

async function checkPremium() {
  const chatDiv = document.getElementById("chatWidget");
  const toggleEditDiv = document.getElementById("toggleEditDiv");
  if (!premiumUser) {
    chatDiv.remove();
    toggleEditDiv.remove();
  } else {
    chatDiv.classList.remove("hidden");
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
    document.getElementById("toggleEditDiv").classList.toggle("hidden");
    document.getElementById("toggleEditDiv").classList.toggle("flex");
    actions.innerHTML = `
   
      <button onclick="addItem()" class="bg-blue-500 text-white px-3 py-1 rounded">
        + Item
      </button>

      <button onclick="updateInvoice()" class="bg-green-500 text-white px-3 py-1 rounded">
        Update
      </button>
    `;
  } else {
    document.getElementById("toggleEditDiv").remove();
  }
}

function editToggle() {
  const actionDiv = document.getElementById("actions");
  document.getElementById("toggleEditDiv").classList.toggle("hidden");
  actionDiv.classList.toggle("hidden");
  actionDiv.classList.toggle("flex");
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
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

loadInvoice();

//  socket io

// build auth object dynamically
const authData = {
  invoiceId,
};

if (token) {
  authData.token = token;
}

// connect socket
const socket = io({
  auth: authData,
});

socket.on("connect", async () => {
  await loadOldMessages();
  console.log("Connected:", socket.id);
});

let myRole = null;

socket.on("role", (role) => {
  myRole = role;
});

// receive messages
socket.on("receive_message", (msg) => {
  renderMessage(msg);
});

// send message
function sendMessage() {
  const input = document.getElementById("msg");
  const text = input.value.trim();

  if (!text) return;

  socket.emit("send_message", { text });

  input.value = "";
}

const chatBody = document.getElementById("chatBody");
const chatMessages = document.getElementById("chatMessages");

function toggleChat() {
  chatBody.classList.toggle("hidden");
}

function handleEnter(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

// render message
function renderMessage(msg) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("flex");

  const bubble = document.createElement("div");
  bubble.classList.add(
    "px-3",
    "py-2",
    "rounded-lg",
    "max-w-[75%]",
    "break-words",
  );

  if (msg.senderType === myRole) {
    wrapper.classList.add("justify-end");
    bubble.classList.add("bg-blue-600", "text-white");
  } else {
    wrapper.classList.add("justify-start");
    bubble.classList.add("bg-gray-200", "text-black");
  }

  bubble.innerText = msg.text;

  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function loadOldMessages() {
  try {
    const res = await axios.get(`/api/message/${invoiceId}`);
    const messages = res.data;

    chatMessages.innerHTML = "";

    messages.forEach((msg) => {
      renderMessage(msg);
    });

    // scroll to bottom after loading
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (err) {
    console.error("Failed to load messages", err);
  }
}
