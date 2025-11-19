import type { Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Pencil,
    Trash2,
    CheckCircle2,
    Circle,
    Calendar
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
    task: Task;
    onToggleStatus: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    isProcessing: boolean;
}

export const TaskCard = ({
    task,
    onToggleStatus,
    onEdit,
    onDelete,
    isProcessing
}: TaskCardProps) => {

    const isCompleted = task.status === 'completed';

    return (
        <Card className={`transition-all duration-200 hover:shadow-md border-l-4 ${isCompleted ? 'border-l-green-500 bg-slate-50/50' : 'border-l-blue-500 bg-white'
            }`}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className={`text-base font-semibold leading-none ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}>
                        {task.title}
                    </CardTitle>
                    <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <Badge variant={isCompleted ? "secondary" : "outline"} className={isCompleted ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                    {isCompleted ? "Completada" : "Pendiente"}
                </Badge>
            </CardHeader>

            <CardContent>
                <p className={`text-sm mb-6 min-h-[2.5rem] ${isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                    {task.description || "Sin descripción"}
                </p>

                <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 ${isCompleted ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"}`}
                        onClick={() => onToggleStatus(task.id)}
                        disabled={isProcessing}
                    >
                        {isCompleted ? (
                            <><CheckCircle2 className="mr-2 h-4 w-4" /> Reactivar</>
                        ) : (
                            <><Circle className="mr-2 h-4 w-4" /> Completar</>
                        )}
                    </Button>

                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(task)}
                            disabled={isProcessing || isCompleted}
                            className="h-8 w-8 text-slate-500 hover:text-blue-600"
                        >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isProcessing}
                                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente la tarea
                                        <span className="font-semibold text-slate-900"> "{task.title}" </span>
                                        de nuestros servidores.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(task.id)}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    >
                                        Eliminar Tarea
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};