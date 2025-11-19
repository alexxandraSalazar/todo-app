import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useAuth } from "../hooks/useAuth";

/**
 * Route Guard for Authenticated Routes.
 * 
 * Wraps private routes to ensure only authenticated users can access them.
 * It observes the MobX AuthStore; if the user logs out (or token expires),
 * this component immediately redirects them to the login page.
 * 
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 */
export const ProtectedRoute: React.FC = observer(() => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Renders child routes if authenticated
    return <Outlet />;
});