export interface Task {
    name: string;
    description: string;
    created: Date;
    completed?: boolean;
    completedAt?: Date;
}