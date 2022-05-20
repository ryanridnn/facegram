import Routers from "./routes/index";
import PulseLoader from "react-spinners/PulseLoader";

// listener hooks
import { useAuthStateListener } from "./services/store/actions/userActions";

//style
import "./styles/tailwind.css";
import "./App.css";

function App() {
  const loading = useAuthStateListener();

  return loading ? (
    <div className="w-screen h-screen flex justify-center items-center">
      <PulseLoader color={"#555"} />
    </div>
  ) : (
    <Routers />
  );
}

export default App;
