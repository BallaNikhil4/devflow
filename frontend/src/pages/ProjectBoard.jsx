import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProjectBoard() {

    const { projectId } = useParams();

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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
        <div style={{ padding: "20px" }}>

            <h1>Project Board</h1>

            <form onSubmit={createTask}>

                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br /><br />

                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Add Task
                </button>

            </form>

            <hr />

            <div
                style={{
                    display: "flex",
                    gap: "20px"
                }}
            >

                {/* TODO COLUMN */}

                <div
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        width: "300px",
                        minHeight: "400px"
                    }}
                >

                    <h2>TODO</h2>

                    {todoTasks.map((task) => (

                        <div
                            key={task.id}
                            style={{
                                border: "1px solid gray",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "5px"
                            }}
                        >

                            <h4>{task.title}</h4>

                            <p>{task.description}</p>

                        </div>
                    ))}

                </div>

                {/* IN_PROGRESS COLUMN */}

                <div
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        width: "300px",
                        minHeight: "400px"
                    }}
                >

                    <h2>IN_PROGRESS</h2>

                    {inProgressTasks.map((task) => (

                        <div
                            key={task.id}
                            style={{
                                border: "1px solid gray",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "5px"
                            }}
                        >

                            <h4>{task.title}</h4>

                            <p>{task.description}</p>

                        </div>
                    ))}

                </div>

                {/* DONE COLUMN */}

                <div
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        width: "300px",
                        minHeight: "400px"
                    }}
                >

                    <h2>DONE</h2>

                    {doneTasks.map((task) => (

                        <div
                            key={task.id}
                            style={{
                                border: "1px solid gray",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "5px"
                            }}
                        >

                            <h4>{task.title}</h4>

                            <p>{task.description}</p>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default ProjectBoard;