import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, onSnapshot, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import TaskModal from "../components/Tasks/TaskModal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface Task {
    id: string;
    title: string;
    description: string;
}

const Tasks = () => {

    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);


    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksArray: Task[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];
            setTasks(tasksArray);
        });

        return () => unsubscribe();
    }, [user]);


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
                    <li key={task.id} className="border p-4 rounded shadow my-2 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <p className="text-gray-600">{task.description}</p>
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
