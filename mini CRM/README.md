# Mini CRM (Client Lead Management System)

A simple yet functional Client Lead Management System tailored for agencies, freelancers, and startups. This system captures leads from a website contact form, stores them in a database, and provides a secure admin dashboard to manage and track lead statuses.

## 🚀 Features
- **Public Contact Form**: A beautiful, glassmorphism-styled landing page form to capture lead details.
- **Secure Admin Portal**: Protected login to access the admin dashboard (Demo credentials provided).
- **Lead Dashboard**: View key analytics (Total, New, Contacted, Converted leads) and a tabular list of recent leads.
- **Status Management**: Instantly update lead statuses (New → Contacted → Converted).
- **Search & Filter**: Quickly find leads by name/email or filter by current status.
- **Modern UI**: Designed with pure CSS focusing on a dark-mode premium aesthetic, gradients, and micro-animations.

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), React Router v6, Axios, Lucide React (Icons), Vanilla CSS
- **Backend**: Node.js, Express.js, Cors, Dotenv
- **Database**: MongoDB (via Mongoose)

## 📁 Project Structure
```
mini CRM/
├── frontend/             # React Frontend Application
│   ├── src/
│   │   ├── pages/        # ContactForm, Login, AdminDashboard components
│   │   ├── App.jsx       # Routing
│   │   └── index.css     # Global Styles (Pure CSS, Design System)
│   └── package.json
├── server.js             # Express Backend Server (API & DB Logic)
├── .env                  # Environment Variables (MongoDB URI, Port)
└── package.json          # Backend Dependencies
```

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, OR a MongoDB Atlas URI string

### 1. Backend Setup
1. Navigate to the project root:
   ```bash
   cd "mini CRM"
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running on your system (default `mongodb://127.0.0.1:27017/minicrm`). You can edit the `.env` file to change the Connection URI.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(Server runs on port 5000)*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd "mini CRM/frontend"
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```
   *(Frontend runs on port 5173 - accessible via the link provided in the terminal)*

## 🔑 Usage
1. Open the frontend URL in your browser (e.g., `http://localhost:5173`).
2. You will land on the **Public Contact Form**. Fill it out to submit a new lead.
3. Click on the "Admin Portal" link at the bottom of the form.
4. Log in using the demo credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
5. You are now in the **Admin Dashboard**. From here you can view your leads, update their statuses, and track analytics!

## 📸 Screenshots
The system includes:
- A responsive, animated landing page capturing user details.
- An interactive dashboard with real-time stat visualization.
- Status update dropdowns for instant lead progression.

---
*Built to help freelancers, startups, and agencies manage real-world clients.*
