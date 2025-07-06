export default function Guitar({ guitar, cart, addToCart }) {
  const { id, name, image, description, price } = guitar;

  return (
    <div className="col-md-6 col-lg-4 my-4 row align-items-center">
      <div className="col-4">
        <img
          className="img-fluid"
          src={`./public/img/${image}.jpg`}
          alt={`imagen guitarra ${name}`}
        />
      </div>
      <div className="col-8">
        <h3 className="text-black fs-4 fw-bold text-uppercase">{name}</h3>
        <p>{description}</p>
        <p className="fw-black text-primary fs-3">${price}</p>
        <button
          type="button"
          className="btn btn-dark w-100"
          onClick={
            () => addToCart(guitar)// Toma una copia de lo que hay en el carrito y añade el nuevo elemento
          } // Importante colocar un arrow function para que la función no se ejecute por defecto
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}
