import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import TaskCard from "../components/TaskCard";
import Sidebar from "../components/Sidebar";

function ProjectBoard() {

    const { projectId } = useParams();

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");

    const [showTaskForm, setShowTaskForm] = useState(false);

    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("MEDIUM");
    const [editDueDate, setEditDueDate] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

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
                    priority,
                    dueDate,
                    project: {
                        id: projectId
                    }
                }
            );

            setTasks([...tasks, response.data]);

            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setDueDate("");
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

            fetchTasks();

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteTask(taskId) {
        try {
            await axios.delete(
                `http://localhost:8080/tasks/${taskId}`
            );

            fetchTasks();

        } catch (error) {
            console.log(error);
        }
    }

    function openEditModal(task) {
        setEditingTask(task);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditPriority(task.priority);
        setEditDueDate(task.dueDate || "");
        setShowEditModal(true);
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

        } catch (error) {
            console.log(error);
        }
    }

    async function onDragEnd(result) {

        if (!result.destination) return;

        const taskId = result.draggableId;
        const newStatus = result.destination.droppableId;

        await updateTaskStatus(taskId, newStatus);
    }

    const filteredTasks = tasks.filter((task) => {

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesPriority =
            priorityFilter === "ALL" ||
            task.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });

    const todoTasks = filteredTasks.filter(
        (task) => task.status === "TODO"
    );

    const inProgressTasks = filteredTasks.filter(
        (task) => task.status === "IN_PROGRESS"
    );

    const doneTasks = filteredTasks.filter(
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
                    <div className="flex flex-col md:flex-row items-center gap-4">

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 h-12 border border-gray-300 rounded-xl px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="border h-12 border-gray-300 rounded-xl px-4 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>

                        <button
                            onClick={() => setShowTaskForm(!showTaskForm)}
                            className="bg-blue-600 h-12 hover:bg-blue-700 transition text-white px-6 rounded-xl font-medium shadow-md cursor-pointer whitespace-nowrap"
                        >
                            + Add Task
                        </button>

                    </div>

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

                <DragDropContext onDragEnd={onDragEnd}>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* TODO */}

                        <Droppable droppableId="TODO">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-[#EBECF0] rounded-2xl p-5 min-h-[650px]"
                                >
                                    <h2 className="text-xl font-bold mb-6">TODO</h2>

                                    <div className="space-y-4 min-h-[200px]">

                                        {todoTasks.map((task, index) => (
                                            <Draggable
                                                key={task.id.toString()}
                                                draggableId={task.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TaskCard
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
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}

                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>

                        {/* IN PROGRESS */}

                        <Droppable droppableId="IN_PROGRESS">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-[#EBECF0] rounded-2xl p-5 min-h-[650px]"
                                >
                                    <h2 className="text-xl font-bold mb-6">IN PROGRESS</h2>

                                    <div className="space-y-4 min-h-[200px]">

                                        {inProgressTasks.map((task, index) => (
                                            <Draggable
                                                key={task.id.toString()}
                                                draggableId={task.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TaskCard
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
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}

                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>

                        {/* DONE */}

                        <Droppable droppableId="DONE">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-[#EBECF0] rounded-2xl p-5 min-h-[650px]"
                                >
                                    <h2 className="text-xl font-bold mb-6">DONE</h2>

                                    <div className="space-y-4 min-h-[200px]">

                                        {doneTasks.map((task, index) => (
                                            <Draggable
                                                key={task.id.toString()}
                                                draggableId={task.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TaskCard
                                                            task={task}
                                                            deleteAction={() =>
                                                                deleteTask(task.id)
                                                            }
                                                            editAction={() =>
                                                                openEditModal(task)
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}

                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>

                    </div>

                </DragDropContext>

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
                                        onChange={(e) =>
                                            setEditPriority(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-xl p-4 mb-4 cursor-pointer"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) =>
                                            setEditDueDate(e.target.value)
                                        }
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