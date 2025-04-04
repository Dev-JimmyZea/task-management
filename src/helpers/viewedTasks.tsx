import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase"

export const getViewedTasks = async (uid: string) => {
    const ref = doc(db, "viewedTasks", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().tasks || {} : {};
};

export const updateViewedTask = async (uid: string, taskId: string, timestamp: any) => {
    const ref = doc(db, "viewedTasks", uid);
    const prevData = await getViewedTasks(uid);

    await setDoc(ref, {
        tasks: {
            ...prevData,
            [taskId]: timestamp,
        },
    });
};