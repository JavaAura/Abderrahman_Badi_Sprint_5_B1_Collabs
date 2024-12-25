export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: Date;
    priority: 'high' | 'medium' | 'low';
    status: 'completed' | 'in-progress' | 'to-do';
    categoryId: string;
}