import Entrance from "./components/entrance/Entrance";
import Station from "./components/station/Station";

function App() {
  return (
    <main className="grid h-screen grid-cols-4 bg-gray-300">
      <Entrance />
      <Station />
    </main>
  );
}

export default App;
