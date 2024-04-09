import React from 'react';
import './task.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faSquareCheck, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import TaskForm from './TaskForm';

export interface Task {
    _id?: string;
    name: string;
    description: string;
    created: Date;
    completed?: boolean;
    completedAt?: Date;
}

interface TaskProps {
    onEditTask: (task: Task) => void;
    onDeleteTask?: (id: string) => void;
    task: Task;
}

export const TaskComponent: React.FC<TaskProps> = ({ task, onEditTask, onDeleteTask }) => {
    const [formVisible, setFormVisible] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);

    const closeForm = () => {
        setFormVisible(false);
    };

    const completeTask = () => {
        onEditTask({ ...task, completed: true, completedAt: new Date() });
    }

    const deleteTask = () => {
        if (onDeleteTask && task._id) {
            onDeleteTask(task._id);
        }
        setConfirm(false);
    }

    return (
        <>
            <div className={`task ${task.completed ? 'task__complete': ''}`}>
                <div className="task__header">
                    <h2>{task.name}</h2>
                    <div className="close-button" onClick={() => setConfirm(true) }>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </div>
                </div>
                <hr />
                <div className="task__body">
                    <p>{task.description}</p>
                    <div className="task__footer">
                        {task.completed && <p><FontAwesomeIcon icon={faSquareCheck} /> {new Date(task.completedAt!).toDateString()}</p>}
                        {!task.completed &&  <span className="task__complete" onClick={completeTask}>
                        <FontAwesomeIcon icon={faSquare} />
                    </span>}
                    </div>
                    {!task.completed && <span className="task__edit" onClick={() => setFormVisible(true)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </span>}
                </div>
            </div>
            {formVisible && <TaskForm onEditTask={onEditTask} closeForm={closeForm} task={task} />}
            {confirm && <div className="modal"><div className='task__delete'>
                <p>Are you sure you want to delete this task?</p>
                <div className="button__group">
                    <button onClick={() => setConfirm(false)}>Cancel</button>
                    <button className='button--danger' onClick={deleteTask}>Delete</button>
                </div>
            </div></div>}
        </>
    );
};