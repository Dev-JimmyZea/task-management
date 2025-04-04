import TaskForm from "./TaskForm";
import { Task } from "../types/Task.ts";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
}

const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <button onClick={onClose} className="float-right text-gray-500">X</button>
                <h2 className="text-xl font-bold mb-4">{task ? "Editar Tarea" : "Crear Tarea"}</h2>
                <TaskForm task={task} onClose={onClose} />
            </div>
        </div>
    );
};


export default TaskModal;
