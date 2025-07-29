import Form from "./components/Form";
import { useEffect, useMemo } from "react";
import ActivityList from "./components/ActivityList";
import CalorieTracker from "./components/CalorieTracker";
import { useActivityContext } from "./context/ActivityContext";

function App() {
  const { state, dispatch } = useActivityContext();

  // Guardar en localStorage cada vez que cambian las actividades
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(state.activities));
  }, [state.activities]);

  // Solo se puede reiniciar si hay actividades
  const canRestartApp = useMemo(() => state.activities.length > 0, [state.activities]);

  return (
    <>
      <header className="bg-lime-600 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-center text-lg font-bold text-white uppercase">
            Contador de Calorías
          </h1>

          <button
            className="bg-gray-800 hover:bg-gray-900 p-2 font-bold uppercase text-white cursor-pointer rounded-lg text-sm disabled:opacity-50"
            disabled={!canRestartApp}
            onClick={() => dispatch({ type: "restart-app" })}
          >
            Reiniciar APP
          </button>
        </div>
      </header>

      <section className="bg-lime-500 py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <Form />
        </div>
      </section>

      <section className="bg-gray-800 py-10">
        <div className="max-w-4xl mx-auto">
          <CalorieTracker />
        </div>
      </section>

      <section className="p-10 mx-auto max-w-4xl">
        <ActivityList />
      </section>
    </>
  );
}

export default App;
