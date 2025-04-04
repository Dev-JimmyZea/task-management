import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const logTaskChange = async (taskId: string, userId: string, action: string) => {
    const historyRef = collection(db, `tasks/${taskId}/history`);
    await addDoc(historyRef, {
        userId,
        action,
        timestamp: serverTimestamp()
    });
};
