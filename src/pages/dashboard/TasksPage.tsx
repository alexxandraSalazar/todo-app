import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { TaskFormDialog } from "@/components/shared/TaskFormDialog";
import { TaskCard } from "@/components/shared/TaskCard";
import { Plus, LogOut } from "lucide-react";
import type { Task } from "@/types";
import { toast } from "sonner";

/**
 * Main Dashboard Container (Smart Component).
 * 
 * Responsibilities:
 * 1. **State Connection**: Consumes `useTasks` and `useAuth` to get global data.
 * 2. **Orchestration**: Handles business logic flows (Create, Edit, Delete) and maps them to UI actions.
 * 3. **Feedback Management**: Triggers toast notifications for side effects (Success/Error).
 * 4. **Local UI State**: Manages modal visibility (`isCreateOpen`) and selection state (`editingTask`).
 * 
 * Wrapped in `observer` to automatically re-render when MobX observables change.
 */
export const TasksPage: React.FC = observer(() => {
    // Global State Facades
    const { tasks, isLoading, addTask, updateTask, deleteTask, stats } = useTasks();
    const { logout, user } = useAuth();

    // Local UI State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleLogout = () => {
        logout();
        toast.info("Sesión cerrada");
    };

    /**
     * Handles the creation flow including UI feedback.
     */
    const handleCreate = async (title: string, description: string) => {
        const promise = addTask(title, description);

        toast.promise(promise, {
            loading: 'Creando tarea...',
            success: '¡Tarea creada correctamente!',
            error: 'Error al crear la tarea'
        });

        await promise; 
    };

    const handleEdit = async (title: string, description: string) => {
        if (!editingTask) return;

        const promise = updateTask(editingTask.id, { title, description });

        toast.promise(promise, {
            loading: 'Actualizando...',
            success: 'Tarea actualizada',
            error: 'Error al actualizar'
        });

        await promise;
        setEditingTask(null);
    };

    const handleDelete = async (id: string) => {
        const promise = deleteTask(id);
        toast.promise(promise, {
            loading: 'Eliminando...',
            success: 'Tarea eliminada',
            error: 'No se pudo eliminar'
        });
    };

    const handleToggleStatus = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';

            try {
                await updateTask(id, { status: newStatus });
                if (newStatus === 'completed') {
                    toast.success("¡Tarea completada!", { description: "Buen trabajo" });
                } else {
                    toast.info("Tarea reactivada");
                }
            } catch (error) {
                toast.error("Error de conexión");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                        <p className="text-slate-500">Hola, {user?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex gap-4 text-sm text-slate-500 mr-4 border-r pr-4">
                            <span>Pendientes: <strong className="text-orange-600">{stats.pending}</strong></span>
                            <span>Completadas: <strong className="text-green-600">{stats.completed}</strong></span>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Salir
                        </Button>
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
                        </Button>
                    </div>
                </header>

                <main>
                    {isLoading && tasks.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                            <h3 className="text-lg font-semibold">Todo limpio</h3>
                            <p className="text-muted-foreground mb-4">No hay tareas pendientes.</p>
                            <Button onClick={() => setIsCreateOpen(true)}>Crear primera tarea</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggleStatus={handleToggleStatus}
                                    onEdit={(t) => setEditingTask(t)}
                                    onDelete={handleDelete}
                                    isProcessing={isLoading}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <TaskFormDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSubmit={handleCreate}
                isLoading={isLoading}
                title="Crear Nueva Tarea"
            />

            <TaskFormDialog
                open={!!editingTask}
                onOpenChange={(open) => !open && setEditingTask(null)}
                onSubmit={handleEdit}
                initialData={editingTask ? { title: editingTask.title, description: editingTask.description } : undefined}
                isLoading={isLoading}
                title="Editar Tarea"
            />
        </div>
    );
});