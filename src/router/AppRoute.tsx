import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { TasksPage } from "../pages/dashboard/TasksPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";

/**
 * Central Routing Configuration.
 * Orchestrates the navigation flow of the application.
 * 
 * Strategy:
 * - **Guest Routes**: Wrapped in `GuestRoute` (e.g., Login). Accessible only when NOT logged in.
 * - **Protected Routes**: Wrapped in `ProtectedRoute` (e.g., Dashboard). Accessible only when logged in.
 * - **Catch-all**: Redirects unknown paths to the Dashboard (which then handles auth checks).
 */
export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes (Guest Only) */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                {/* Private Routes (Auth Required) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<TasksPage />} />
                    {/* Future routes like /profile or /settings would go here */}
                </Route>

                {/* Fallback Route: Handles 404s by redirecting to the main entry point */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};