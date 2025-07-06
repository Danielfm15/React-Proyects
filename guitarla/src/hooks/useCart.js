import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
const useCart = () => {
    const initialCart = () => {
        const localStorageCart = localStorage.getItem ('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
    
      const [data] = useState(db);
      const [cart, setCart] = useState(initialCart)
    
      const maxItems = 5
      const minItems = 1
    
      useEffect (() => {
       localStorage.setItem('cart', JSON.stringify(cart)) 
      }, [cart])
    
      function addToCart(item){
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExists >=0) { // existe en el carrito
          const updatedCart = [...cart]
          updatedCart[itemExists].quantity++
          setCart(updatedCart)
        }else { // No existe en el carrito
          item.quantity = 1
          setCart([...cart, item])
        }
        saveLocalStorage()  
      }
    
      function removeFromCart(id){
        setCart(prevCart => prevCart.filter(guitar => guitar.id != id))
      }
    
      function increaseQuantity(id){
        const updatedCart = cart.map(item =>{
          if (item.id === id && item.quantity < maxItems
    
          ){
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
        function decreaseQuantity(id){
        const updatedCart = cart.map(item =>{
          if (item.id === id && item.quantity > minItems
    
          ){
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function clearCart(e){
        setCart([])
      }
      
      function saveLocalStorage(){
        localStorage.setItem ('cart', JSON.stringify(cart))
      }

        // State derivado
  const itsEmpty = useMemo(() => cart.length === 0, [cart]); // Hook que evita operaciones si no se han producido cambios en las depencias
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );
    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity, 
        decreaseQuantity,
        clearCart,
        itsEmpty,
        cartTotal
    }
}

export default useCart