# To-Do App (React + MobX + TypeScript)

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)

![MobX](https://img.shields.io/badge/State-MobX-orange?style=flat-square&logo=mobx)

![Router](https://img.shields.io/badge/Routing-React_Router_v6-CA4245?style=flat-square&logo=react-router)

![Tailwind](https://img.shields.io/badge/UI-TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss)

![Testing](https://img.shields.io/badge/Testing-Jest-red?style=flat-square&logo=jest)

---


> **🚀 Ver Demo en Vivo:** [https://todo-app-two-virid-22.vercel.app/](https://todo-app-two-virid-22.vercel.app/)


A robust, scalable Frontend application implementing a complete **To-Do Management System**. 
This project demonstrates advanced frontend architecture patterns, strict TypeScript typing, global state management with MobX, and a simulated Backend environment with artificial latency.

---

## ✨ Key Features

- **Simulated Authentication:** Login system with credential validation and protected routes using **React Router v6**.
- **Optimistic UI Updates:** Immediate visual feedback for CRUD operations with automatic rollback on failure.
- **Modern UI/UX:** Responsive design built with **Shadcn/ui** and TailwindCSS.
- **Service Layer Architecture:** Complete decoupling between the UI components and the Data Layer.
- **Local Persistence:** Data is persisted in `localStorage` to mimic a database, surviving page reloads.
- **Unit Testing:** Critical business logic (Stores) tested with **Jest**.
- **Real-time Feedback:** Toast notifications (Sonner) and Loading states for all async actions.

---

## 🛠️ Tech Stack

- **Core:** React 18, TypeScript, Vite.
- **State Management:** MobX (Observables, Actions, Computed).
- **Routing:** React Router Dom v6 (Protected & Guest Routes, Outlets).
- **Styling:** TailwindCSS, Shadcn/ui, Lucide React (Icons).
- **HTTP Simulation:** Custom Mock Adapter (simulating Axios with latency).
- **Testing:** Jest, React Testing Library.
- **Utils:** UUID, CLSX, Tailwind-Merge.

---

## 🏗️ Architecture & Design Patterns

This project follows **Domain-Driven Design (DDD)** principles and **Clean Architecture** concepts:

1.  **Smart vs. Dumb Components:**
    - **Pages (Smart):** Handle logic, connect to Hooks/Stores, and manage local UI state.
    - **Components (Dumb):** Pure presentational components that receive data via props.
2.  **Service Layer Pattern:** All data access logic resides in `src/services`. The UI never communicates directly with the API logic.
3.  **Facade Pattern (Hooks):** Custom hooks (`useTasks`, `useAuth`) act as a simplified interface for MobX stores, keeping components clean.
4.  **Singleton Pattern:** Stores (`AuthStore`, `TaskStore`) are singletons injected via React Context.

---

## 📂 Folder Structure

```text
src/
├── components/        # Shared UI Components (Buttons, Modals, Cards)
│   ├── ui/            # Shadcn atomic components
│   └── shared/        # Domain-specific dumb components (TaskCard)
├── hooks/             # Custom Facade Hooks (useAuth, useTasks)
├── pages/             # Smart Components / Route Views
│   ├── auth/          # Login Page
│   └── dashboard/     # Main Task Dashboard
├── router/            # Route Guards (Protected/Guest) and mapping
├── services/          # Data Layer
│   ├── api/           # Service adapters (authService, taskService)
│   └── mock/          # Mock Engine (Latency & LocalStorage logic)
├── stores/            # MobX Business Logic & State
├── types/             # Global TypeScript definitions (DTOs, Interfaces)
└── lib/               # Utilities (cn, formatters)

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   https://github.com/alexxandraSalazar/todo-app.git
    cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
Copy the template file to create your local environment variables.
   ```bash
   cp .env.template .env
   ```

4. **Run the application**
Copy the template file to create your local environment variables.
   ```bash
   npm run dev
   ```

5. **Access the App**
Open your browser at http://localhost:5173


---

## 🔑 Demo Credentials
Since the backend is simulated, use these hardcoded credentials to access the dashboard:

| Email           | Password |
|-----------------|----------|
| demo@gmail.com  | 123456   |

> **Note:** Validation logic is located in `src/services/mock/mockApi.ts`

## Authors

- [💛 Alexandra R. Salazar](https://github.com/alexxandraSalazar)

