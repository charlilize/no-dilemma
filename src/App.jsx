import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="w-full h-screen bg-gray-200 rounded-3xl flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-7xl">Struggling to Make a Choice?</h1>
        <p>
          Don't go about it alone - post your dilemma and create a poll to
          gather opinions from fellow members. It's all anonymous.
        </p>
        <Link to="/forum">
          <button className="bg-mesa hover:bg-mesa-light text-white font-bold py-2 px-4 border-b-4 border-black rounded">
            Start Asking
          </button>
        </Link>
      </div>
    </div>
  );
}

export default App;
