const API = axios.create({
  baseURL: "/api",
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});

let isLogin = true;

const form = document.getElementById("authForm");
const title = document.getElementById("title");
const nameInput = document.getElementById("name");
const toggleBtn = document.getElementById("toggleBtn");
const toggleText = document.getElementById("toggleText");


toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;

  if (isLogin) {
    title.innerText = "Login";
    nameInput.classList.add("hidden");
    toggleText.innerText = "Don't have an account?";
    toggleBtn.innerText = "Signup";
  } else {
    title.innerText = "Signup";
    nameInput.classList.remove("hidden");
    toggleText.innerText = "Already have an account?";
    toggleBtn.innerText = "Login";
  }
});



form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    let res;

    if (isLogin) {
      res = await API.post("/auth/login", { email, password });
    } else {
      await API.post("/auth/register", { name, email, password });

      alert("Signup successful! Please login.");
      toggleBtn.click();
      return;
    }

    
    
    localStorage.setItem("token", res.data.token);

    checkBusiness();
  } catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
  }
});

async function checkBusiness() {
  const token = localStorage.getItem("token");

  try {
    const res = await API.get("/businessProfile", {
      headers: { Authorization: token },
    });

    window.location.href = "/dashboard.html";
  } catch (err) {
    if (err.response && err.response.status === 404) {
      window.location.href = "/create-business.html";
    } else {
      console.error(err);
    }
    console.error(err);
  }
}
