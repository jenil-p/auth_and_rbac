# Entries management 📝

this application has JWT auth and RBAC with user and admin roles (later can be scalled)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT Authentication

- Backend Design structure **Simple** **MVC** for now. Later we can improve this as give in this readme file (at the end of this file)

---

## 📂 Project Structure

```text
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
| 
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   ├── server.js
│   ├── package.json
│   └── .env.example
|
└── README.md

```
## 🔐 Environment Variables
This project uses environment variables for configuration. We have included .env.example files in the directories.

### Steps
- Create a **.env** file in both the frontend and backend directories.
- Copy contents from the respective **.env.example** files.
- Fill in your own credentials (DB URL, Secret Keys, etc.).

## Clone this repo in local and...

## Backend Setup
Open a terminal and navigate to the backend folder:

```text
cd backend
npm install
npm run dev
```
The Backend server will start on: http://localhost:5000 (or your configured port).

## Frontend Setup
Open a new terminal tab/window and navigate to the frontend folder:

```text
cd frontend
npm install
npm run dev
```
The Frontend will start on: http://localhost:3000 (default next port).

## Features
- User Authentication: Secure JWT-based login and signup.
- Create , Read , Update, Delete entries
- Private Feed 

- Admin
- CRUD on all entries
- can manage users

## Scripts

### Frontend:
```text
npm run dev - Start development server
```

### Backend:
```text
npm run dev - Start development server (nodemon)
```

# Short scalability note

- we can improve its current schema by normalizing it (till BCNF) to get highest scalability without losing the consistency.
- Later we can make two different applications (one for user and one for admin if they are going to be increasing in numbers) so that trafic will be devided (given that admins also increases say per 100 user an admin)
- we can do partition of database with suitable stratagy (horizintal or Vertical)
