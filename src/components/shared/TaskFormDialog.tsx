import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface TaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (title: string, description: string) => Promise<void>;
    initialData?: { title: string; description: string };
    isLoading: boolean;
    title: string;
}

export const TaskFormDialog = ({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    isLoading,
    title,
}: TaskFormDialogProps) => {
    const [formData, setFormData] = useState({ title: "", description: "" });

    useEffect(() => {
        if (open) {
            setFormData({
                title: initialData?.title || "",
                description: initialData?.description || "",
            });
        } else {
            if (!initialData) setFormData({ title: "", description: "" });
        }
    }, [open, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        await onSubmit(formData.title, formData.description);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Modifica los detalles de tu tarea existente."
                            : "Agrega una nueva tarea a tu lista."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Comprar café"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="desc">Descripción</Label>
                        <Textarea
                            id="desc"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalles opcionales..."
                            className="resize-none"
                            disabled={isLoading}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Guardar Cambios" : "Crear Tarea"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};