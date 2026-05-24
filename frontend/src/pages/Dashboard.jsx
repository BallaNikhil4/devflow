import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {

    const [projects, setProjects] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [showMenuId, setShowMenuId] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);

    const [editingProject, setEditingProject] = useState(null);

    const [editName, setEditName] = useState("");

    const [editDescription, setEditDescription] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {

        try {

            const response = await axios.get(
                "http://localhost:8080/projects"
            );

            setProjects(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    async function createProject(e) {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/projects",
                {
                    name,
                    description
                }
            );

            setProjects([...projects, response.data]);

            setName("");
            setDescription("");

            setShowForm(false);

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteProject(projectId) {

        try {

            await axios.delete(
                `http://localhost:8080/projects/${projectId}`
            );

            fetchProjects();

        } catch (error) {
            console.log(error);
        }
    }

    function openEditModal(project) {

        setEditingProject(project);

        setEditName(project.name);

        setEditDescription(project.description);

        setShowEditModal(true);
    }

    async function updateProject(e) {

        e.preventDefault();

        try {

            await axios.put(
                `http://localhost:8080/projects/${editingProject.id}`,
                {
                    name: editName,
                    description: editDescription
                }
            );

            fetchProjects();

            setShowEditModal(false);

        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div className="flex min-h-screen bg-[#F4F5F7]">

            <Sidebar />

            <div className="flex-1 p-8 overflow-auto">

                {/* TOP BAR */}

                <div className="flex justify-between items-center mb-10">

                    <div>

                        <h1 className="text-4xl font-bold text-gray-800">
                            Projects Workspace
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Organize and manage your development workflow
                        </p>

                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-medium shadow-md cursor-pointer"
                    >
                        + Create Project
                    </button>

                </div>

                {/* CREATE FORM */}

                {
                    showForm && (

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">

                            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
                                New Project
                            </h2>

                            <form onSubmit={createProject}>

                                <input
                                    type="text"
                                    placeholder="Project Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <textarea
                                    placeholder="Project Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="flex gap-4">

                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-medium cursor-pointer"                                    >
                                        Create
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="bg-gray-300 hover:bg-gray-400 transition text-gray-800 px-6 py-3 rounded-xl font-medium cursor-pointer"                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    )
                }

                {/* PROJECTS */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {projects.map((project) => (

                        <div
                            key={project.id}
                            onClick={() =>
                                navigate(`/project/${project.id}`)
                            }
                            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
                        >

                            <div className="flex justify-between items-start mb-4">

                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                                    {project.name.charAt(0)}
                                </div>

                                <div className="relative">

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenuId(
                                                showMenuId === project.id ? null : project.id
                                            );
                                        }}
                                        className="text-2xl font-bold leading-none px-2 text-gray-600 hover:text-gray-900 cursor-pointer"
                                    >
                                        ⋮
                                    </button>

                                    {
                                        showMenuId === project.id && (

                                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditModal(project);
                                                        setShowMenuId(null);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteProject(project.id);
                                                        setShowMenuId(null);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        )
                                    }

                                </div>

                            </div>

                            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                                {project.name}
                            </h3>

                            <p className="text-gray-500 mb-6">
                                {project.description}
                            </p>

                            <div className="flex justify-between items-center">

                                <span className="text-sm text-gray-400">
                                    Active Project
                                </span>

                                <button className="text-blue-600 font-medium hover:underline">
                                    Open Board →
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
            {
                showEditModal && (

                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                        <div className="bg-white p-8 rounded-2xl w-[500px] shadow-xl">

                            <h2 className="text-2xl font-bold mb-6">
                                Edit Project
                            </h2>

                            <form onSubmit={updateProject}>

                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
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

                                <div className="flex gap-4">

                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-medium cursor-pointer"
                                    >
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEditModal(false)
                                        }
                                        className="bg-gray-300 hover:bg-gray-400 transition text-gray-800 px-6 py-3 rounded-xl font-medium cursor-pointer"
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
    );
}

export default Dashboard;