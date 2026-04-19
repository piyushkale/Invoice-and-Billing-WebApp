const token = localStorage.getItem("token");

window.onload = async () => {
  try {
    await checkAdmin();
    pendingBusinesses();
    approvedBusinesses();
    rejectedBusinesses();
  } catch (error) {
    console.log(error.message);
  }
};

async function checkAdmin() {
  try {
    const res = await axios.get("/api/auth/roleAuthenticate", {
      headers: { Authorization: token },
    });
    if (res.data.role !== "admin") {
      window.location.href = "/index.html";
      return;
    }
    document.body.classList.remove("hidden");
  } catch (error) {
    window.location.href = "/index.html";
    console.log(error.message);
  }
}

// pending approval function
async function pendingBusinesses() {
  try {
    const res = await axios.get("/api/admin/businessStatus?status=pending", {
      headers: { Authorization: token },
    });
    const data = res.data;
    displayPendingRequests(data);
  } catch (error) {
    console.log(error.message);
  }
}

function displayPendingRequests(data) {
  const pendingContainer = document.getElementById("pendingContainer");
  pendingContainer.innerHTML = ` <div class="flex justify-around flex-row text-slate-800 bg-black/10">
          <h2>Name</h2>
          <h3>Email</h3>
          <h3>Status</h3>
        </div>`;
  data.map((biz, i) => {
    pendingContainer.innerHTML += `  <div
          class="flex justify-around p-2 items-center flex-row text-slate-800/80 bg-black/10"
        >
          <h2>${i + 1}. ${biz.name}</h2>
          <h3>${biz.email}</h3>

          <button onclick="updateStatus('${biz._id}','approved')"
            class="px-3 py-1 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 relative overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:scale-x-0 hover:before:scale-x-100 before:origin-left before:transition before:duration-300 before:skew-x-12 cursor-pointer"
          >
            Accept
          </button>
          <button onclick="updateStatus('${biz._id}','rejected')"
            class="px-3 py-1 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 relative overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:scale-x-0 hover:before:scale-x-100 before:origin-left before:transition before:duration-300 before:skew-x-12 cursor-pointer"
          >
            Reject
          </button>
        </div>`;
  });
}

// Update business user status (accept or reject)
async function updateStatus(id, status) {
  try {
    const res = await axios.put(
      "/api/admin/updateStatus",
      { id, status },
      { headers: { Authorization: token } },
    );

    console.log(res.data.message);
    pendingBusinesses();
    approvedBusinesses();
    rejectedBusinesses();
  } catch (error) {
    console.log(error.message);
  }
}

// approved businesses function

async function approvedBusinesses() {
  try {
    const res = await axios.get("/api/admin/businessStatus?status=approved", {
      headers: { Authorization: token },
    });
    const data = res.data;

    displayApprovedBusinesses(data);
  } catch (error) {
    console.log(error.message);
  }
}

function displayApprovedBusinesses(data) {
  const approvedContainer = document.getElementById("approvedContainer");
  approvedContainer.innerHTML = `  <div class="flex justify-around flex-row text-slate-800 bg-black/10">
          <h2>Name</h2>
          <h3>Email</h3>
        </div>`;

  data.map((biz, i) => {
    approvedContainer.innerHTML += `  <div
          class="flex justify-around p-2 items-center flex-row text-slate-800 bg-black/10"
        >
          <h2>${i + 1}.  ${biz.name}</h2>
          <h3>${biz.email}</h3>
        </div>`;
  });
}

// rejected businesses function

async function rejectedBusinesses() {
  try {
    const res = await axios.get("/api/admin/businessStatus?status=rejected", {
      headers: { Authorization: token },
    });
    const data = res.data;
    displayRejectedBusinesses(data);
  } catch (error) {
    console.log(error.message);
  }
}

function displayRejectedBusinesses(data) {
  const rejectedContainer = document.getElementById("rejectedContainer");
  rejectedContainer.innerHTML = `<div class="flex justify-around flex-row text-slate-800 bg-black/10">
          <h2>Name</h2>
          <h3>Email</h3>
        </div>`;

  data.map((biz) => {
    rejectedContainer.innerHTML += `<div
          class="flex justify-around p-2 items-center flex-row text-slate-800 bg-black/10"
        >
          <h2>${biz.name}</h2>
          <h3>${biz.email}</h3>
        </div>`;
  });
}

// banned businesses

//logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}
