import React from "react";
import { AppRouter } from "./router/AppRoute";
import { Toaster } from "@/components/ui/sonner"; 

/**
 * Application Root Component.
 * 
 * Serves as the entry point for the React component tree.
 * It is responsible for:
 * 1. Initializing Global Layouts or Providers (like Toaster).
 * 2. Rendering the Router system.
 */
const App: React.FC = () => {
  return (
    <>
      <AppRouter />
      {/* Global Notification Provider configured for Rich Colors and Top-Center position */}
      <Toaster richColors position="top-center" closeButton /> 
    </>
  );
};

export default App;