import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"

const NotFound = () => {

    return (
        <div className="w-full bg-gray-200 h-screen rounded-3xl flex flex-col items-center justify-center overflow-y-auto gap-5 p-4">
            <p className="text-3xl font-extrabold">Uh oh! Page not found...</p>
                <Link to="/forum">
            <div className="flex items-center gap-4 justify-center">
                    <FontAwesomeIcon className="text-3xl" icon={faSquareCaretLeft} />
                    <p>Go Back to Main Page</p>
            </div>
                </Link>
        </div>

    )
};

export default NotFound;
