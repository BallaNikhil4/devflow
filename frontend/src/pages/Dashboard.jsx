import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const [projects, setProjects] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const response = await axios.get("http://localhost:8080/projects");
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

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>

            <h1>DevFlow</h1>

            <form onSubmit={createProject}>

                <input
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <br /><br />

                <textarea
                    placeholder="Project Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Create Project
                </button>

            </form>

            <hr />

            {projects.map((project) => (
                <div
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        marginBottom: "10px",
                        cursor: "pointer"
                    }}
                >
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                </div>
            ))}

        </div>
    );
}

export default Dashboard;