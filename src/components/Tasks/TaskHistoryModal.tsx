import { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface TaskHistoryModalProps {
    taskId: string;
    onClose: () => void;
}

interface HistoryEntry {
    id: string;
    userId: string;
    action: string;
    timestamp: Date;
}

const TaskHistoryModal = ({ taskId, onClose }: TaskHistoryModalProps) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [userMap, setUserMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchHistory = async () => {
            const historyRef = collection(db, `tasks/${taskId}/history`);
            const q = query(historyRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);

            const fetchedHistory: { [p: string]: any; id: string; timestamp: any }[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
            }));

            setHistory(fetchedHistory as HistoryEntry[]);
        };

        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const map: Record<string, string> = {};
            usersSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.uid && data.email) {
                    map[data.uid] = data.email;
                }
            });
            setUserMap(map);
        };

        fetchHistory();
        fetchUsers();
    }, [taskId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Historial de Cambios</h2>
                <ul className="max-h-64 overflow-y-auto">
                    {history.length > 0 ? (
                        history.map((entry) => (
                            <li key={entry.id} className="border-b py-2">
                                <p className="text-sm">
                                    <span className="font-medium">{userMap[entry.userId] || "Desconocido"}</span>{" "}
                                    {entry.action} la tarea el{" "}
                                    {entry.timestamp.toLocaleString()}
                                </p>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay historial disponible.</p>
                    )}
                </ul>
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default TaskHistoryModal;
