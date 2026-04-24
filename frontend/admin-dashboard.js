const token = localStorage.getItem("token");

window.onload = async () => {
  try {
    await checkAdmin();
    pendingBusinesses();
    approvedBusinesses();
    rejectedBusinesses();
    bannedBusinesses();
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

    pendingBusinesses();
    approvedBusinesses();
    bannedBusinesses();
    searchBusiness();
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
async function bannedBusinesses() {
  try {
    const res = await axios.get("/api/admin/businessStatus?status=banned", {
      headers: { Authorization: token },
    });
    const data = res.data;
    displayBannedBusinesses(data);
  } catch (error) {
    console.log(error.message);
  }
}

function displayBannedBusinesses(data) {
  const bannedContainer = document.getElementById("bannedContainer");
  bannedContainer.innerHTML = `<div class="flex justify-around flex-row text-slate-800 bg-black/10">
          <h2>Name</h2>
          <h3>Email</h3>
        </div>`;

  data.map((biz) => {
    bannedContainer.innerHTML += `<div
          class="flex justify-around p-2 items-center flex-row text-slate-800 bg-black/10"
        >
          <h2>${biz.name}</h2>
          <h3>${biz.email}</h3>
        </div>`;
  });
}

// handle search

let timeout;

async function searchBusiness() {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    try {
      let text = document.getElementById("searchElement").value.trim();

      if (text.length < 4) {
        document.getElementById("searchDiv").classList.add("hidden");
        return;
      }

      const res = await axios.get(`/api/admin/search?query=${text}`, {
        headers: { Authorization: token },
      });

      if (!res.data || res.data.length < 1) {
        document.getElementById("searchDiv").classList.add("hidden");
        return;
      }
      renderSearchResults(res.data);
    } catch (error) {
      console.log(error.message);
    }
  }, 400); // 400ms delay
}

function renderSearchResults(data) {
  const mainDiv = document.getElementById("searchDiv");
  mainDiv.classList.remove("hidden");
  mainDiv.classList.remove("flex");
  mainDiv.innerHTML = `  <div class="flex justify-evenly py-1 gap-11 px-10">
          <h2>Name</h2>
          <h2>Email</h2>
          <h3>Status</h3>
          
        </div>`;

  data.map((biz) => {
    mainDiv.innerHTML += `<div class="flex justify-evenly gap-11 py-0.5 px-10 hover:bg-slate-100">
          <h2>${biz.name}</h2>
          <h2>${biz.email}</h2>
          <h3>${biz.status}</h3>
           ${
             biz.status === "approved"
               ? `<button onclick="updateStatus('${biz._id}','banned')"
              class="bg-red-400 px-2 rounded-md cursor-pointer hover:bg-red-500 transition duration-200">
              Ban
            </button>`
               : ""
           }
           ${
             biz.status === "pending"
               ? `<button onclick="updateStatus('${biz._id}','approved')"
            class="bg-emerald-400 px-2 rounded-md cursor-pointer hover:bg-emerald-500 transition duration-200"
          >
            Approve
          </button>
          <button onclick="updateStatus('${biz._id}','rejected')"
            class="bg-red-400 px-2 rounded-md cursor-pointer hover:bg-red-500 transition duration-200"
          >
            Reject
          </button>`
               : ""
           }
          
        </div>
      `;
  });
}

//logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}
