function TaskCard({ task, buttonText, buttonAction }) {

    return (

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">

            <div className="flex justify-between items-start mb-3">

                <h3 className="text-lg font-semibold text-gray-800">
                    {task.title}
                </h3>

                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                    MEDIUM
                </span>

            </div>

            <p className="text-gray-600 mb-5">
                {task.description}
            </p>

            {
                buttonText ? (

                    <button
                        onClick={buttonAction}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium cursor-pointer"                    >
                        {buttonText}
                    </button>

                ) : (

                    <div className="text-green-600 font-medium">
                        Completed ✅
                    </div>

                )
            }

        </div>
    );
}

export default TaskCard;