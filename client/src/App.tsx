import './App.css';
import { useQuery } from 'react-query';
import { Task, TaskComponent } from './components/Task/Task';
import TaskForm from './components/Task/TaskForm';
import { useEffect, useState } from 'react';

const URL = 'http://localhost:5050/api/tasks';

function App() {
  const [formVisible, setFormVisible] = useState(false);
  const [all, setAll] = useState(false);
  const [recent, setRecent] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [queryParams, setQueryParams] = useState<string | null>(null);
  const { isLoading, error, data, refetch } = useQuery('tasksData', () =>
    fetch(`${URL}${queryParams !== null ? `/${queryParams}`: ''}`).then((res) =>
      res.json()
    ),
    { refetchInterval: 30000}
  );

  useEffect(() => {
    refetch();
  }, [queryParams, refetch]);

  const closeForm = () => {
    setFormVisible(false);
  }

  const onAddTask = async (task: Task) => {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    if (response.ok) {
      closeForm();
      refetch();
    }
  }

  const onEditTask = async (task: Task) => {
    const { _id, ...rest } = task;
    const response = await fetch(`${URL}/${_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rest)
    });
    if (response.ok) {
      closeForm();
      refetch();
    }
  }

  const onDeleteTask = async (id: string) => {
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      refetch();
    }
  }

  const checkAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAll(e.target.checked);
    setRecent(false);
    setCompleted(false);
    setQueryParams(null);
  }
  const checkRecent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecent(e.target.checked);
    setAll(false);
    setCompleted(false);
    setQueryParams('recent');
  }
  const checkCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompleted(e.target.checked);
    setRecent(false);
    setAll(false);
    setQueryParams('completed');
  }

  return (
    <>
        <nav className="nav">
          <h1>Final Project | Tasks</h1>
          <span className="options">
            <label htmlFor="all">All</label>
            <input type="checkbox" name="all" id="all" checked={all} onChange={checkAll}/>
            <label htmlFor="recent">Recent</label>
            <input type="checkbox" name="recent" id="recent" checked={recent} onChange={checkRecent}/>
            <label htmlFor="completed">Completed</label>
            <input type="checkbox" name="completed" id="completed" checked={completed} onChange={checkCompleted}/>
          </span>
        </nav>
        <main>
          {isLoading && <p className='banner banner--loading'>Loading...</p>}
          {(error as Error) && <p className='banner banner--error'>Error: {(error as Error).message}</p>}
          <div className="task-list">
            {data?.length >= 1 && data.map((task: Task) => <TaskComponent key={task.name} task={task} onEditTask={onEditTask} onDeleteTask={onDeleteTask} />)}
            {data?.length < 1 && <p className='banner'>No tasks found</p>}
          </div>
          <span onClick={() => setFormVisible(true)} className='add-task'><i className='fas fa-plus fa-2x'></i></span>
          {formVisible && <TaskForm onAddTask={onAddTask} closeForm={closeForm} />}
        </main>
    </>
  )
}

export default App;
