import { useState } from "react";

function TaskCard({
    task,
    buttonText,
    buttonAction,
    deleteAction,
    editAction
}) {

    const [showMenu, setShowMenu] = useState(false);

    return (

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition relative">

            {/* TOP */}

            <div className="flex justify-between items-start mb-3">

                <h3 className="text-lg font-semibold text-gray-800">
                    {task.title}
                </h3>

                <div className="relative">

                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none px-2 cursor-pointer"
                    >
                        ⋮
                    </button>

                    {
                        showMenu && (

                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">

                                <button
                                    onClick={() => {
                                        editAction();
                                        setShowMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        deleteAction();
                                        setShowMenu(false);
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

            {/* DESCRIPTION */}

            <p className="text-gray-600 mb-5">
                {task.description}
            </p>

            {/* PRIORITY */}

            <div className="mb-5 flex items-center justify-between">

                <span
                    className={`text-xs px-2 py-1 rounded-full font-medium
            ${task.priority === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }
        `}
                >
                    {task.priority}
                </span>

                {
                    task.dueDate && (
                        <span className="text-sm text-gray-500">
                            📅 Due: {task.dueDate}
                        </span>
                    )
                }

            </div>

            {/* ACTION BUTTON */}

            {
                buttonText ? (

                    <button
                        onClick={buttonAction}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium cursor-pointer"
                    >
                        {buttonText}
                    </button>

                ) : (

                    <button
                        disabled
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-medium"
                    >
                        Completed ✅
                    </button>

                )
            }

        </div>
    );
}

export default TaskCard;