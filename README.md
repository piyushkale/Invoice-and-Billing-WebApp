# 🧾 Invoice Management System (SaaS Style)

A full-stack Invoice Management System built with **Node.js, Express, MongoDB, and Vanilla JS**, designed to help businesses create, manage, and share invoices seamlessly.

---

## 🚀 Features

### 🔐 Authentication
- User Signup & Login
- JWT-based authentication
- Protected routes

### 🏢 Business Profile
- Create and update business details
- Linked with user account

### 🧾 Invoice Management
- Create invoices with dynamic items
- Edit & delete invoices
- Auto calculation of total amount

### 📄 PDF Generation
- Generate professional invoice PDFs
- Download or preview in browser

### 🔗 Sharing
- Share invoice via link
- One-click **WhatsApp sharing**
- Copy-to-clipboard functionality

### 📊 Dashboard
- View all invoices
- Search invoices (by name)
- Total earnings (last 30 days)
- Total invoices count (last 30 days)

### 🔍 Search
- Real-time search (frontend + backend)
- Case-insensitive filtering

---

## 🛠 Tech Stack

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- PDFKit (for PDF generation)

### Frontend:
- HTML, Tailwind CSS
- Vanilla JavaScript
- Axios (API calls)

---


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/piyushkale/Invoice-and-Billing-WebApp
cd backend
npm install


Create .env file:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run the Server
npm start
