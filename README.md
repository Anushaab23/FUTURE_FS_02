Mini CRM (Client Lead Management System)
A simple yet functional Client Lead Management System tailored for agencies, freelancers, and startups. This system captures leads from a website contact form, stores them in a database, and provides a secure admin dashboard to manage and track lead statuses.

🚀 Features
Public Contact Form: A beautiful, glassmorphism-styled landing page form to capture lead details.
Secure Admin Portal: Protected login to access the admin dashboard (Demo credentials provided).
Lead Dashboard: View key analytics (Total, New, Contacted, Converted leads) and a tabular list of recent leads.
Status Management: Instantly update lead statuses (New → Contacted → Converted).
Search & Filter: Quickly find leads by name/email or filter by current status.
Modern UI: Designed with pure CSS focusing on a dark-mode premium aesthetic, gradients, and micro-animations.
🛠️ Tech Stack
Frontend: React.js (Vite), React Router v6, Axios, Lucide React (Icons), Vanilla CSS
Backend: Node.js, Express.js, Cors, Dotenv
Database: MongoDB (via Mongoose)
📁 Project Structure
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
⚙️ Setup & Installation
Prerequisites
Node.js installed
MongoDB installed and running locally, OR a MongoDB Atlas URI string
1. Backend Setup
Navigate to the project root:
cd "mini CRM"
Install backend dependencies:
npm install
Make sure MongoDB is running on your system (default mongodb://127.0.0.1:27017/minicrm). You can edit the .env file to change the Connection URI.
Start the backend server:
npm run dev
(Server runs on port 5000)
2. Frontend Setup
Open a new terminal and navigate to the frontend folder:
cd "mini CRM/frontend"
Install frontend dependencies:
npm install
Start the React app:
npm run dev
(Frontend runs on port 5173 - accessible via the link provided in the terminal)
🔑 Usage
Open the frontend URL in your browser (e.g., http://localhost:5173).
You will land on the Public Contact Form. Fill it out to submit a new lead.
Click on the "Admin Portal" link at the bottom of the form.
Log in using the demo credentials:
Username: admin
Password: admin123
You are now in the Admin Dashboard. From here you can view your leads, update their statuses, and track analytics!
📸 Screenshots
The system includes:

A responsive, animated landing page capturing user details.
An interactive dashboard with real-time stat visualization.
Status update dropdowns for instant lead progression.
Built to help freelancers, startups, and agencies manage real-world clients
