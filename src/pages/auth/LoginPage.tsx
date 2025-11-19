import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * Authentication Entry Page (Smart Component).
 * 
 * Handles the user interaction for the Login process.
 * It validates local form state before dispatching the login action
 * to the AuthStore via `useAuth`.
 */
export const LoginPage: React.FC = observer(() => {
    const { login, isLoading } = useAuth();

    const [form, setForm] = useState({
        email: "demo@gmail.com",
        password: "123456"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast.warning("Datos incompletos", {
                description: "Por favor ingresa email y contraseña."
            });
            return;
        }

        // Using toast.promise to handle the 3 states of the async action (Loading, Success, Error)
        toast.promise(login({ email: form.email, password: form.password }), {
            loading: 'Iniciando sesión...',
            success: () => {
                return `¡Bienvenido de nuevo!`;
            },
            error: (err) => {
                return err instanceof Error ? err.message : 'Error de autenticación';
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
                    <p className="text-gray-500">Inicia sesión en tu To-Do App</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        name="email"
                        label="Correo Electrónico"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />

                    <Input
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Ingresar
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400 bg-gray-50 p-2 rounded">
                    <p className="font-semibold">Credenciales:</p>
                    <p>demo@gmail.com / 123456</p>
                </div>
            </div>
        </div>
    );
});