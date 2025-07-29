import {
  type ReactNode,
  createContext,
  useReducer,
  type Dispatch,
  useContext,
  useMemo,
} from "react";
import {
  activityReducer,
  initialState,
  type ActivityState,
  type ActivityActions,
} from "../reducers/activityReducer";
import { categories } from "../data/categories";
import type { Activity } from "../types";

// Tipo de props para el proveedor
type ActivityProviderProps = {
  children: ReactNode;
};

// Tipo para el contexto
type ActivityContextProps = {
  state: ActivityState;
  dispatch: Dispatch<ActivityActions>;
  caloriesConsumed : number
  caloriesBurned : number
  netCalories : number
   categoryName: (category: Activity["category"]) => string[]
   isEmptyActivities: boolean
};

// Crear el contexto con valor por defecto como undefined
export const ActivityContext = createContext<ActivityContextProps | undefined>(
  undefined
);

// Componente proveedor
export const ActivityProvider = ({ children }: ActivityProviderProps) => {
  const [state, dispatch] = useReducer(activityReducer, initialState);

   //Contadores
    const caloriesConsumed = useMemo(
      () =>
        state.activities.reduce(
          (total, activity) =>
            activity.category === 1 ? total + activity.calories : total,
          0
        ),
      [state.activities]
    );
    const caloriesBurned = useMemo(
      () =>
        state.activities.reduce(
          (total, activity) =>
            activity.category === 2 ? total + activity.calories : total,
          0
        ),
      [state.activities]
    );
    const netCalories = useMemo(() => caloriesConsumed - caloriesBurned, [state.activities])
const categoryName = useMemo(
    () => (category: Activity['category']) =>
      categories.map(cat => cat.id === category ? cat.name : ""), [state.activities]
    
  );

  const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities]);
  return (
    <ActivityContext.Provider value={{ 
        state, 
        dispatch,
        caloriesConsumed,
        caloriesBurned,
        netCalories,
        categoryName,
        isEmptyActivities
        }}>
      {children}
    </ActivityContext.Provider>
  );
};

// Hook personalizado para usar el contexto de manera segura
export const useActivityContext = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error(
      "useActivityContext debe usarse dentro de un ActivityProvider"
    );
  }
  return context;
};
