import { useState, useEffect } from "react";
import { addDoc, doc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Task } from "../types/Task.ts";

const TaskForm = ({ task, onClose }: { task?: Task | null; onClose: () => void }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
        } else {
            setTitle("");
            setDescription("");
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            if (task) {
                const taskRef = doc(db, "tasks", task.id);
                await updateDoc(taskRef, { title, description });

                toast.success("Tarea actualizada exitosamente");
            } else {
                await addDoc(collection(db, "tasks"), {
                    title,
                    description,
                    completed: false,
                    userId: user.uid,
                    createdAt: serverTimestamp(),
                });

                toast.success("Tarea creada exitosamente");
            }

            onClose();
        } catch (error) {
            console.error("Error al guardar la tarea:", error);
            toast.error("Hubo un error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
            />
            <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                {task ? "Actualizar Tarea" : "Crear Tarea"}
            </button>
        </form>
    );
};

export default TaskForm;
