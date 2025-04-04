import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
    collection,
    query,
    onSnapshot,
    where,
    deleteDoc,
    doc,
    getDocs,
} from "firebase/firestore";
import TaskModal from "../components/Tasks/TaskModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Task } from "../components/types/Task.ts";
import {updateViewedTask} from "../helpers/viewedTasks.tsx";
import TaskHistoryModal from "../components/Tasks/TaskHistoryModal.tsx";

const Tasks = () => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [userMap, setUserMap] = useState<Record<string, string>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [historyTaskId, setHistoryTaskId] = useState<string | null>(null);

    const [dismissedVersions, setDismissedVersions] = useState<Record<string, boolean>>({});

    const DISMISSED_KEY = `dismissedTaskVersions_${user?.uid || "guest"}`;

    useEffect(() => {
        if (!user) return;

        try {
            const saved = localStorage.getItem(DISMISSED_KEY);
            if (saved) {
                setDismissedVersions(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Error loading dismissed task versions:", e);
        }
    }, [user, DISMISSED_KEY]);

    useEffect(() => {
        if (Object.keys(dismissedVersions).length > 0) {
            localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissedVersions));
        }
    }, [dismissedVersions, DISMISSED_KEY]);

    const dismissTaskVersion = (taskId: string, timestamp: number) => {
        const versionKey = `${taskId}_${timestamp}`;
        setDismissedVersions(prev => ({
            ...prev,
            [versionKey]: true
        }));
    };

    useEffect(() => {
        if (!user) return;

        const tasksRef = collection(db, "tasks");
        const ownQuery = query(tasksRef, where("userId", "==", user.uid));
        const sharedQuery = query(tasksRef, where("sharedWith", "array-contains", user.uid));

        const unsubOwn = onSnapshot(ownQuery, (ownSnap) => {
            handleSnapshotUpdate(ownSnap);
        });

        const unsubShared = onSnapshot(sharedQuery, (sharedSnap) => {
            handleSnapshotUpdate(sharedSnap);
        });

        const handleSnapshotUpdate = async (querySnapshot: any) => {
            const fetchedTasks = querySnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];

            for (const task of fetchedTasks) {
                const updatedAt = (task as any).updatedAt?.toMillis?.() || Date.now();
                const versionKey = `${task.id}_${updatedAt}`;

                if (dismissedVersions[versionKey]) continue;

                if ((task as any).lastEditedBy === user.uid) continue;

                const notificationId = `${task.id}_${updatedAt}`;

                if (!toast.isActive(notificationId)) {
                    toast.info(
                        `Tarea actualizada: ${task.title}`,
                        {
                            toastId: notificationId,
                            autoClose: false,
                            closeOnClick: false,
                            draggable: false,
                            closeButton: true,
                            onClose: () => {
                                dismissTaskVersion(task.id, updatedAt);
                            },
                        }
                    );
                }
            }

            setTasks((prevTasks) => {
                const all = [
                    ...prevTasks.filter((p) => !fetchedTasks.find((f) => f.id === p.id)),
                    ...fetchedTasks,
                ];
                return all.sort((a, b) => {
                    const aTime = (a as any).createdAt?.toMillis?.() || 0;
                    const bTime = (b as any).createdAt?.toMillis?.() || 0;
                    return bTime - aTime;
                });
            });
        };

        return () => {
            unsubOwn();
            unsubShared();
        };
    }, [user, dismissedVersions]);

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

    const handleEdit = async (task: Task) => {
        setCurrentTask(task);
        setIsModalOpen(true);

        const updatedAt = (task as any).updatedAt?.toMillis?.() || 0;
        await updateViewedTask(user!.uid, task.id, updatedAt);
    };

    const handleDelete = async (taskId: string) => {
        try {
            await deleteDoc(doc(db, "tasks", taskId));
            toast.success("Tarea eliminada correctamente");

            const newDismissed = {...dismissedVersions};
            Object.keys(newDismissed).forEach(key => {
                if (key.startsWith(`${taskId}_`)) {
                    delete newDismissed[key];
                }
            });
            setDismissedVersions(newDismissed);
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
                            <button
                                onClick={() => setHistoryTaskId(task.id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Historial
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {historyTaskId && (
                <TaskHistoryModal
                    taskId={historyTaskId}
                    onClose={() => setHistoryTaskId(null)}
                />
            )}
        </div>
    );
};

export default Tasks;
