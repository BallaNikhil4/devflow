import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import Sidebar from "../components/Sidebar";

function ProjectBoard() {

    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [priority, setPriority] = useState("MEDIUM");
    const [editPriority, setEditPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [editDueDate, setEditDueDate] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const response = await axios.get(
                `http://localhost:8080/tasks/project/${projectId}`
            );

            setTasks(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    async function createTask(e) {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/tasks",
                {
                    title,
                    description,
                    status: "TODO",
                    priority: priority,
                    dueDate,
                    project: {
                        id: projectId
                    }
                }
            );
            setTasks([...tasks, response.data]);
            setTitle("");
            setDescription("");
            setShowTaskForm(false);
            setPriority("MEDIUM");
            setDueDate("");
        } catch (error) {
            console.log(error);
        }
    }

    async function updateTaskStatus(taskId, status) {

        try {

            await axios.put(
                `http://localhost:8080/tasks/${taskId}/status/${status}`
            );

            await fetchTasks();

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteTask(taskId) {

        try {

            await axios.delete(
                `http://localhost:8080/tasks/${taskId}`
            );

            await fetchTasks();

        } catch (error) {
            console.log(error);
        }
    }

    function openEditModal(task) {

        setEditingTask(task);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditPriority(task.priority);
        setShowEditModal(true);
        setEditDueDate(task.dueDate || "");

    }

    async function updateTask(e) {
        e.preventDefault();

        try {

            await axios.put(
                `http://localhost:8080/tasks/${editingTask.id}`,
                {
                    title: editTitle,
                    description: editDescription,
                    priority: editPriority,
                    dueDate: editDueDate
                }
            );

            await fetchTasks();

            setShowEditModal(false);
            setEditingTask(null);
            setEditPriority("MEDIUM");

        } catch (error) {
            console.log(error);
        }
    }

    const todoTasks = tasks.filter(
        (task) => task.status === "TODO"
    );

    const inProgressTasks = tasks.filter(
        (task) => task.status === "IN_PROGRESS"
    );

    const doneTasks = tasks.filter(
        (task) => task.status === "DONE"
    );

    return (

        <div className="flex min-h-screen bg-[#F4F5F7]">

            <Sidebar />

            <div className="flex-1 p-8 overflow-auto">

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold text-gray-800">
                            Project Board
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Track and manage development tasks
                        </p>

                    </div>

                    <button
                        onClick={() => setShowTaskForm(!showTaskForm)}
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-medium shadow-md cursor-pointer"
                    >
                        + Add Task
                    </button>

                </div>

                {
                    showTaskForm && (

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

                            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
                                New Task
                            </h2>

                            <form onSubmit={createTask}>

                                <input
                                    type="text"
                                    placeholder="Task Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 mb-4"
                                />

                                <textarea
                                    placeholder="Task Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 mb-4"
                                />

                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 cursor-pointer"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>

                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 cursor-pointer"
                                />

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer"
                                    >
                                        Create Task
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowTaskForm(false)}
                                        className="bg-gray-300 px-6 py-3 rounded-xl cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>
                    )
                }

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="bg-[#EBECF0] rounded-2xl p-5 min-h-[650px]">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-xl font-bold text-gray-800">
                                TODO
                            </h2>

                            <span className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full">
                                {todoTasks.length}
                            </span>

                        </div>

                        <div className="space-y-4">

                            {todoTasks.map((task) => (

                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    buttonText="Move to In Progress"
                                    buttonAction={() =>
                                        updateTaskStatus(task.id, "IN_PROGRESS")
                                    }
                                    deleteAction={() =>
                                        deleteTask(task.id)
                                    }
                                    editAction={() =>
                                        openEditModal(task)
                                    }
                                />

                            ))}

                        </div>

                    </div>

                    <div className="bg-[#EBECF0] rounded-2xl p-5 min-h-[650px]">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-xl font-bold text-gray-800">
                                IN PROGRESS
                            </h2>

                            <span className="bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full">
                                {inProgressTasks.length}
                            </span>

                        </div>

                        <div className="space-y-4">

                            {inProgressTasks.map((task) => (

                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    buttonText="Move to Done"
                                    buttonAction={() =>
                                        updateTaskStatus(task.id, "DONE")
                                    }
                                    deleteAction={() =>
                                        deleteTask(task.id)
                                    }
                                    editAction={() =>
                                        openEditModal(task)
                                    }
                                />

                            ))}

                        </div>

                    </div>

                    <div className="bg-[#EBECF0] rounded-2xl p-5 min-h-[650px]">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-xl font-bold text-gray-800">
                                DONE
                            </h2>

                            <span className="bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full">
                                {doneTasks.length}
                            </span>

                        </div>

                        <div className="space-y-4">

                            {doneTasks.map((task) => (

                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    deleteAction={() =>
                                        deleteTask(task.id)
                                    }
                                    editAction={() =>
                                        openEditModal(task)
                                    }
                                />

                            ))}

                        </div>

                    </div>

                </div>

                {
                    showEditModal && (

                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                            <div className="bg-white p-8 rounded-2xl w-[500px] shadow-xl">

                                <h2 className="text-2xl font-bold mb-6">
                                    Edit Task
                                </h2>

                                <form onSubmit={updateTask}>

                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-xl p-4 mb-4"
                                    />

                                    <textarea
                                        value={editDescription}
                                        onChange={(e) =>
                                            setEditDescription(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-xl p-4 mb-4"
                                    />

                                    <select
                                        value={editPriority}
                                        onChange={(e) => setEditPriority(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl p-4 mb-4 cursor-pointer"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl p-4 mb-4 cursor-pointer"
                                    />
                                    <div className="flex gap-4">

                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer"
                                        >
                                            Save Changes
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setEditingTask(null);
                                            }}
                                            className="bg-gray-300 px-6 py-3 rounded-xl cursor-pointer"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );
}

export default ProjectBoard;