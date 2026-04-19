# 🚀 AI Text Enhancer, Image & Video Generator

A full-stack AI-powered web application built using the **MERN stack** that enhances handwritten text, generates AI images & videos, and improves image quality — all in one platform.

---

## 🌟 Features

### ✍️ AI Handwritten Text Enhancer

* Converts and enhances handwritten or rough text into clean, readable format
* Improves clarity and formatting using AI

### 🖼️ AI Image Generator

* Generate high-quality images from text prompts
* Supports creative and realistic outputs

### 🎥 AI Video Generator

* Create videos based on prompts or generated content
* Smooth rendering and dynamic output

### 🧠 Image Enhancer

* Improve image quality, sharpness, and resolution
* AI-based enhancement for better visual output

---

## 🔐 Authentication System

* Secure **JWT-based authentication**
* Dynamic token handling across frontend & backend
* Login & Signup system with validation
* Protected routes for authorized users

---

## 🧱 Tech Stack

### Frontend

* React.js
* Framer Motion (animations)
* Lucide React (icons)
* Modern responsive UI

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* MongoDB (Atlas)

### Other Tools

* JWT (Authentication)
* Nodemon (Development)
* Environment variables for security

---

## 🎨 UI/UX Highlights

* Smooth animations using **Framer Motion**
* Clean and modern design
* Responsive layout (mobile + desktop)
* Interactive UI with **Lucide icons**

---

## 📁 Project Structure

```
root/
│
├── frontend/        # React frontend
├── backend/         # Node + Express backend
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

> ⚠️ Never commit `.env` to GitHub

---

## 🚀 Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Install dependencies

#### Backend

```
cd backend
npm install
```

#### Frontend

```
cd frontend
npm install
```

---

### 3. Run the project

#### Start backend

```
cd backend
npm run dev
```

#### Start frontend

```
cd frontend
npm run dev
```

---

## 🔒 Security Notes

* JWT tokens are used for authentication
* Sensitive data stored in environment variables
* MongoDB credentials must be protected

---

## 📸 Future Improvements

* AI chat integration
* User dashboard with history
* File upload support
* Better video rendering pipeline
* Deployment (Docker + CI/CD)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 💡 Author

Built with ❤️ using MERN Stack and AI integrations.

---
