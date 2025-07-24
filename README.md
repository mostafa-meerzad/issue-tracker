# 🐞 Issue Tracker App

A full-featured **Issue Tracking System** built with **Next.js 14**, **TypeScript**, **Prisma**, and **MySQL**. Designed for developers and teams to manage bugs, tasks, and feature requests with ease — complete with filtering, role-based assignment, validation, and interactive charts.

> 🔧 Built by following [Mosh Hamedani’s Next.js Mastery Course](https://codewithmosh.com/)
> 📌 UI can be improved with polish (planned in future updates 😉)

---

## 🚀 Live Demo

[🔗 View Live App](https://issue-tracker-two-smoky.vercel.app/)

---

## 📸 Preview

![Home page](./issue-tracker.png)

---

## 🛠️ Tech Stack

- ⚙️ **Next.js 14 (App Router)**
- 📦 **TypeScript**
- 🧠 **Prisma ORM** + **MySQL**
- 💅 **Tailwind CSS** + **Radix UI**
- 🧪 **Zod** for validation
- 📝 **React Hook Form**
- 🔔 **React Hot Toast** for notifications
- 📊 **Chart.js** for data visualization

---

## ✨ Features

- 🐛 Create, view, update, and delete issues
- 👥 Assign issues to registered users
- 📊 Graphs and statistics for issue tracking
- ✅ Server-side validation with **Zod**
- ⚡ Smooth forms with **React Hook Form**
- 🔐 Auth setup ready for role-based control _(extendable)_
- 🍞 Instant feedback with **Hot Toast**
- 🔍 Filtering and sorting on issues
- 📱 Fully responsive

---

---

## 📦 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/mostafa-meerzad/issue-tracker
cd issue-tracker
npm install
```

### 2. Set Up the Database

Make sure you have a MySQL server running.

```bash
npx prisma migrate dev --name init
```

Create a .env file and configure your DB connection:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/issue_tracker"

```

### 3. Run the Development Server

```bash
npm run dev
```

## 🧠 Learning Purpose

This project was developed by following Mosh Hamedani’s full-stack Next.js course to master advanced web app architecture, full CRUD flows, and real-world best practices.

## 🧪 Future Improvements

🎨 Improve UI with animations and design polish

🧑‍🤝‍🧑 Role-based access control

🔍 Full-text search and advanced filters

📧 Email notifications
