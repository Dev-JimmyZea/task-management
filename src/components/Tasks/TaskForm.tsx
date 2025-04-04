import { useState, useEffect } from "react";
import {
    addDoc,
    doc,
    updateDoc,
    collection,
    serverTimestamp,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Task } from "../types/Task";
import { logTaskChange} from "../../helpers/logTaskChanges.tsx";

const TaskForm = ({ task, onClose }: { task?: Task | null; onClose: () => void }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sharedEmail, setSharedEmail] = useState("");

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setSharedEmail("");
        } else {
            setTitle("");
            setDescription("");
            setSharedEmail("");
        }
    }, [task]);

    const findUserByEmail = async (email: string) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].id;
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const sharedWith: string[] = task?.sharedWith || [];

            if (sharedEmail.trim()) {
                const sharedUid = await findUserByEmail(sharedEmail.trim());

                if (sharedWith.includes(sharedUid as string)) {
                    toast.error("Ya se encuentra agregado");
                    return;
                }

                if (!sharedUid) {
                    toast.error("No se encontró un usuario con ese correo");
                    return;
                }

                if (sharedUid === user.uid) {
                    toast.error("No puedes compartir una tarea contigo mismo");
                    return;
                }

                sharedWith.push(sharedUid);
            }

            if (task) {
                const taskRef = doc(db, "tasks", task.id);
                await updateDoc(taskRef, {
                    title,
                    description,
                    sharedWith,
                    updatedAt: serverTimestamp(),
                    lastEditedBy: user.uid,
                });
                await logTaskChange(task.id, user.uid, "updated");
                toast.success("Tarea actualizada exitosamente");
            } else {
                const newTaskRef = await addDoc(collection(db, "tasks"), {
                    title,
                    description,
                    completed: false,
                    userId: user.uid,
                    sharedWith,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    lastEditedBy: user.uid,
                });

                const taskId = newTaskRef.id;

                await logTaskChange(taskId, user.uid, "created");

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
            <input
                type="email"
                placeholder="Compartir con (email)"
                value={sharedEmail}
                onChange={(e) => setSharedEmail(e.target.value)}
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
