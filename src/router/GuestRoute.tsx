import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useAuth } from "../hooks/useAuth";

/**
 * Inverse Route Guard for Public Routes.
 * 
 * Prevents authenticated users from accessing "Guest-only" pages like Login or Register.
 * If a user is already logged in and tries to access '/login', they are 
 * automatically redirected to the dashboard for better UX.
 */
export const GuestRoute: React.FC = observer(() => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
});