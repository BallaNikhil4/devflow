import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const location = useLocation();

    return (

        <div className="w-72 bg-[#172B4D] text-white flex flex-col p-6">

            {/* LOGO */}

            <h1
                className="text-3xl font-bold mb-10 cursor-pointer"
                onClick={() => navigate("/")}
            >
                DevFlow
            </h1>

            {/* MENU */}

            <div className="mb-10">

                <h2 className="text-sm uppercase text-gray-300 mb-4 tracking-wider">
                    Workspace
                </h2>

                <div className="space-y-3">

                    {/* PROJECTS */}

                    <div
                        onClick={() => navigate("/")}
                        className={`p-3 rounded-lg cursor-pointer transition
                            
                            ${location.pathname === "/"
                                ? "bg-blue-600"
                                : "bg-[#344563] hover:bg-[#42526E]"
                            }
                        `}
                    >
                        Projects
                    </div>

                    {/* BOARDS */}

                    <div
                        onClick={() => navigate("/")}
                        className={`p-3 rounded-lg cursor-pointer transition
                            
                            ${location.pathname.includes("/project/")
                                ? "bg-blue-600"
                                : "bg-[#344563] hover:bg-[#42526E]"
                            }
                        `}
                    >
                        Boards
                    </div>

                    {/* TASKS */}

                    <div
                        className="bg-[#344563] p-3 rounded-lg cursor-pointer hover:bg-[#42526E] transition"
                    >
                        Tasks
                    </div>

                </div>

            </div>

            {/* FOOTER */}

            <div className="mt-auto text-sm text-gray-400">
                DevFlow Workspace
            </div>

        </div>
    );
}

export default Sidebar;