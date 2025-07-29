import { categories } from "../data/categories";
import DatePicker from "react-datepicker";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import type { DraftExpense } from "../types";
import type { Value } from "react-calendar/dist/shared/types.js";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });

  const [error, setError] = useState("");
  const [previuosAmount, setPreviousAmount] = useState(0)
  const { dispatch, state, remainingBudget } = useBudget();

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(
        (currentExpense) => currentExpense.id === state.editingId
      )[0];
      setExpense(editingExpense);
    }
  }, [state.editingId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);

    setExpense({
      ...expense,
      [name]: isAmountField ? Number(value) : value,
    });
  };

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validar
    if (Object.values(expense).includes("")) {
      setError("Debes rellenear todos los campos");
      return;
    }

    // Validar que no me pase del límite
     if (expense.amount - previuosAmount> remainingBudget) {
      setError("¡Has superado el presupuesto!");
      return;
    }

    // Agregar o actualizar un gasto
    if (state.editingId) {
      dispatch({
        type: "update-expense",
        payload: { expense: { id: state.editingId, ...expense } },
      });
    } else {
      dispatch({ type: "add-expense", payload: { expense } });
    }

    // Reiniciar el state
    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    });
    setPreviousAmount(0)
  };

  return (
    <form className=" space-y-5" onSubmit={handleSubmit}>
      <legend className=" uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
      </legend>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-4xl">
          Nombre Gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        ></input>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-4xl">
          Cantidad:
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Añade la cantidad del gasto: ej. 300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        ></input>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-4xl">
          Categoría:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">-- Seleccione --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-4xl">
          Fecha Gasto:
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          selected={!Array.isArray(expense.date) ? expense.date : null}
          onChange={handleChangeDate}
        />
      </div>

      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'}
      ></input>
    </form>
  );
}
