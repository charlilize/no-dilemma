import "./App.css";
import { Link } from "react-router-dom";
import cover from "../src/assets/cover.png";
// Icon by Freepik

function App() {
  return (
    <div className="w-full h-screen bg-gray-200 rounded-3xl flex justify-center items-center">
      <div className="flex items-center gap-10 w-9/12">
        <img src={cover} />
        <div className="flex flex-col gap-5">
          <h1 className="text-6xl font-bold">
            Struggling to Make a<span className="text-mesa"> Choice?</span>
          </h1>
          <p className="font-bold text-lg">
            Don't go about it alone - post your dilemma and create a poll to
            gather opinions from fellow members. It's all anonymous.
          </p>
          <Link className="flex justify-center" to="/forum">
            <button className="bg-mesa text-lg hover:bg-mesa-light text-white font-bold py-2 px-4 border-b-4 border-black rounded">
              Start Asking
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
