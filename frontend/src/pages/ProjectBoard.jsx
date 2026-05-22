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
                    priority: "MEDIUM",
                    project: {
                        id: projectId
                    }
                }
            );

            setTasks([...tasks, response.data]);

            setTitle("");
            setDescription("");

            setShowTaskForm(false);

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

                {/* TOP BAR */}

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
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-medium shadow-md cursor-pointer"                    >
                        + Add Task
                    </button>

                </div>

                {/* TASK FORM */}

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
                                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <textarea
                                    placeholder="Task Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="flex gap-4">

                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-medium cursor-pointer"                                    >
                                        Create Task
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowTaskForm(false)}
                                        className="bg-gray-300 hover:bg-gray-400 transition text-gray-800 px-6 py-3 rounded-xl font-medium"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    )
                }

                {/* BOARD */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* TODO */}

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
                                />

                            ))}

                        </div>

                    </div>

                    {/* IN PROGRESS */}

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
                                />

                            ))}

                        </div>

                    </div>

                    {/* DONE */}

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
                                />

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProjectBoard;