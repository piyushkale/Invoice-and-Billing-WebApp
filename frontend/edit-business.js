const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/index.html";
}

// Load existing data
async function loadBusiness() {
  try {
    const res = await axios.get("/api/businessProfile/", {
      headers: { Authorization: token }
    });

    const biz = res.data;
document.getElementById("businessName").innerText = biz.businessName;
    document.getElementById("name").value = biz.businessName;
    document.getElementById("address").value = biz.address;
    document.getElementById("phone").value = biz.phone;
    document.getElementById("gst").value = biz.gst;

  } catch (err) {
    console.error(err);
  }
}

// Update
async function updateBusiness() {
  const businessName = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const gst = document.getElementById("gst").value;

  try {
    await axios.post("/api/businessProfile", {
      businessName,
      address,
      phone,
      gst
    }, {
      headers: { Authorization: token }
    });

    alert("Profile Updated!");
    window.location.href = "/dashboard.html";

  } catch (err) {
    console.error(err);
  }
}

loadBusiness();