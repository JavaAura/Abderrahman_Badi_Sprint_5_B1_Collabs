export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: Date;
    priority: 'high' | 'medium' | 'low';
    status: 'completed' | 'in-progress' | 'not-started';
    categoryId: string;
}