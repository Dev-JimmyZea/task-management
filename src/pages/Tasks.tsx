import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
    collection,
    query,
    onSnapshot,
    where,
    orderBy,
    deleteDoc,
    doc,
    getDocs
} from "firebase/firestore";
import TaskModal from "../components/Tasks/TaskModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Task } from "../components/types/Task.ts";

const Tasks = () => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [userMap, setUserMap] = useState<Record<string, string>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    useEffect(() => {
        if (!user) return;

        const ownTasksQuery = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const sharedTasksQuery = query(
            collection(db, "tasks"),
            where("sharedWith", "array-contains", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribeOwn = onSnapshot(ownTasksQuery, (querySnapshot) => {
            const own = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];

            setTasks((prev) => {
                const shared = prev.filter((t) => t.userId !== user.uid);
                return [...own, ...shared];
            });
        });

        const unsubscribeShared = onSnapshot(sharedTasksQuery, (querySnapshot) => {
            const shared = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];

            setTasks((prev) => {
                const own = prev.filter((t) => t.userId === user.uid);
                return [...own, ...shared];
            });
        });

        return () => {
            unsubscribeOwn();
            unsubscribeShared();
        };
    }, [user]);

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"));
            const map: Record<string, string> = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.uid && data.email) {
                    map[data.uid] = data.email;
                }
            });
            setUserMap(map);
        };

        fetchUsers();
    }, []);

    const handleEdit = (task: Task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleDelete = async (taskId: string) => {
        try {
            await deleteDoc(doc(db, "tasks", taskId));
            toast.success("Tarea eliminada correctamente");
        } catch (error) {
            console.error("Error eliminando tarea:", error);
            toast.error("Hubo un error al eliminar la tarea");
        }
    };

    const getDisplayEmail = (uid: string): string => {
        if (!user) return userMap[uid] || "Unknown";
        if (uid === user.uid) return "me";
        return userMap[uid] || "Unknown";
    };

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-center mb-4">Your Tasks</h2>

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Add Task
            </button>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentTask(null);
                }}
                task={currentTask}
            />

            <ul className="mt-4">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className="border p-4 rounded shadow my-2 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <p className="text-gray-600">{task.description}</p>

                            <p className="text-sm text-gray-500 mt-1">
                                Created by: <span className="font-medium">{getDisplayEmail(task.userId)}</span>
                            </p>

                            {task.sharedWith?.length > 0 && (
                                <p className="text-sm text-blue-600 mt-1">
                                    Shared with:{" "}
                                    {task.sharedWith
                                        .map((uid) => getDisplayEmail(uid))
                                        .filter((email) => email !== "me")
                                        .concat(
                                            task.sharedWith.includes(user?.uid ?? "")
                                                ? ["me"]
                                                : []
                                        )
                                        .join(", ")}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(task)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;
