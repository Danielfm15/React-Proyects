import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  useEffect
} from "react";
import { v4 as uuidv4 } from "uuid";
import { categories } from "../data/categories";
import type { Activity } from "../types";
import type { ActivityActions, ActivityState } from "../reducers/activityReducer";

// 👉 Constante para los valores iniciales del formulario
const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: "",
  calories: 0,
};

type FormProps = {
  dispatch: Dispatch<ActivityActions>,
  state : ActivityState
};

export default function Form({ dispatch, state }: FormProps) {
  const [activity, setActivity] = useState<Activity>(initialState);
  const [inputCalories, setInputCalories] = useState("");

 useEffect(() => {
  if (state.activeId) {
    const selecActivity = state.activities.find(
      (stateActivity) => stateActivity.id === state.activeId
    );
    if (selecActivity) {
      setActivity(selecActivity);
      setInputCalories(selecActivity.calories.toString());
    }
  }
}, [state.activeId]);


  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;

    if (id === "calories") {
      setInputCalories(value);
      const numericValue = Number(value);
      setActivity({
        ...activity,
        calories: isNaN(numericValue) ? 0 : numericValue,
      });
      return;
    }

    if (id === "category") {
      setActivity({
        ...activity,
        category: Number(value),
      });
      return;
    }

    setActivity({
      ...activity,
      [id]: value,
    });
  };

  const isValidActivity = () => {
    const { name, calories } = activity;
    return name.trim() !== "" && calories > 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidActivity()) return;

    console.log("Actividad guardada:", activity);

    dispatch({ type: "save-activity", payload: { newActivity: activity } });

    // Limpiar el formulario usando initialState
    setActivity({
      ...initialState,
      id: uuidv4(),
    });
    setInputCalories("");
  };

  return (
    <form
      className="space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="category" className="font-bold">
          Categoría:
        </label>
        <select
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          id="category"
          value={activity.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className="font-bold">
          Actividad:
        </label>
        <input
          id="name"
          type="text"
          className="border border-slate-300 rounded-lg"
          placeholder="Ej. comida, zumo de naranja, ensalada, ejercicio, pesas, bicicleta"
          value={activity.name}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className="font-bold">
          Calorías:
        </label>
        <input
          id="calories"
          type="number"
          min="0"
          className="border border-slate-300 rounded-lg"
          placeholder="200"
          value={inputCalories}
          onChange={handleChange}
        />
      </div>

      <input
        type="submit"
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
        value={activity.category === 1 ? "Guardar comida" : "Guardar ejercicio"}
        disabled={!isValidActivity()}
      />
    </form>
  );
}
