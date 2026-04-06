const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/index.html";
}

async function createBusiness() {
  const businessName = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const gst = document.getElementById("gst").value;
  if (!name || !address || !phone) {
    return alert("Please fill all required fields");
  }
  try {
    await axios.post(
      "/api/businessProfile",
      {
        businessName,
        address,
        phone,
        gst,
      },
      {
        headers: { Authorization: token },
      },
    );

    alert("Business Created!");
    window.location.href = "/dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Error creating business");
  }
}
