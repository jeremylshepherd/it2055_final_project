import React, { useEffect } from 'react';
import { Task } from './Task';
import './task-form.css';

interface TaskFormProps {
    onAddTask?: (task: Task) => void;
    onEditTask?: (task: Task) => void;
    closeForm: () => void;
    task?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, onEditTask, closeForm, task }) => {
    const nameRef = React.useRef<HTMLInputElement>(null);
    const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (task) {
            if (nameRef.current) {
                nameRef.current.value = task.name;
            }
            if (descriptionRef.current) {
                descriptionRef.current.value = task.description;
            }
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = nameRef.current?.value;
        const description = descriptionRef.current?.value;
        if (name && description) {
            if (onAddTask) {
                const created = new Date();
                onAddTask({ name, description, created });
            }
            if (task && onEditTask) {
                const created = task.created;
                const id = task._id;
                onEditTask({ _id: id, name, description, created });
                closeForm();
            }
            nameRef.current.value = '';
            descriptionRef.current.value = '';
        }
    };

    return (
        <div className="form__background">
            <div className="form__container">
                <div className="form__header">
                    <h3>Add New Task</h3>
                    <span onClick={() => closeForm()}>
                        <i className='fas fa-plus fa-2x'/>
                        </span>
                </div>
                <div className="form__body">
                    <form>
                        <label htmlFor="name" className="form__label">Name</label>
                        <input
                            name='name'
                            ref={nameRef}
                            type="text"
                            placeholder="Enter task name"
                        />
                        <label htmlFor="description" className="form__label">Description</label>
                        <textarea
                            name='description'
                            ref={descriptionRef}
                            placeholder="Enter task description"
                            rows={4}
                        />
                        <button type="submit"  onClick={handleSubmit}>Add Task</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskForm;