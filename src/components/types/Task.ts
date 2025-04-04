export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    sharedWith: string[];
    createdAt?: any;
    updatedAt?: any;
    lastEditedBy?: string;
}