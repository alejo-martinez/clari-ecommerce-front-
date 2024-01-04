import React, { useEffect, useState } from 'react';

//Librerias extras
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

//Context del carrito
import { useCart } from '../context/CartContext';

//Componente de pago
import PagoComponent from '../PagoComponent/PagoComponent';

import './Cart.css';

function Cart() {
  const { cid } = useParams(); //Id del carrito llegado por parámetro de la ruta

  const { getProductsCart, addProduct, removeProd, emptyCart } = useCart(); //Funciones del contextodel carrito

  const [products, setProducts] = useState([]); // Estado de los productos dentro del carrito
  const [loading, setLoading] = useState(true); // Estado loading para permitir la carga de datos antes de renderizar contenido
  const [total, setTotal] = useState(0); // Estado del monto total de dinero a pagar
  const [cantProds, setCantProds] = useState(0); // Estado de la cantidad de productos totales a comprar
  const [end, setEnd] = useState(false); // Estado que determina el renderizado del componente de pago

  const increase = async (pid, id) => { // Función para incrementar la cantidad de un producto. Al estar dentro 
    const body = { idProd: pid, quantity: 1 } // del componente "carrito" solo incrementa los productos que ya estén 
    const resp = await addProduct(cid, body); // dentro del mismo. El límite del agregado depende del stock del 
    if (resp.status === 'succes') { // producto.
      let newArray = [...products];
      let newTotal = total;
      let newTotalProds = cantProds;
      let prod = products.find(prod => prod._id === id);
      prod.quantity += 1;
      newArray.map(producto => producto._id === id ? prod : producto);
      newTotal += prod.product.price;
      newTotalProds += 1;
      setTotal(newTotal);
      setCantProds(newTotalProds);
      setProducts(newArray);
    }
  }

  const decrease = async (pid, id) => { // Función para decrementar la cantidad de un producto. Al estar dentro
    const resp = await removeProd(cid, pid, 1); // del componente "carrito" solo decrementa los productos que ya
    if (resp.status === 'succes') { // estén dentro del mismo. El límite de decremento es cuando existe una 
      let newArray = [...products]; // cantidad de 1 (uno) producto dentro del carrito.
      let newTotal = total;
      let newTotalProds = cantProds;
      let prod = products.find(prod => prod._id === id);
      prod.quantity -= 1;
      newArray.map(producto => producto._id === id ? prod : producto);
      newTotal -= prod.product.price;
      newTotalProds -= 1;
      setTotal(newTotal);
      setCantProds(newTotalProds);
      setProducts(newArray);
    }
  }

  const endPurchase = () => { // Función para renderizar la vista del componente de pago.
    setEnd(true);
  }

  const vaciarCarrito = async () => { // Función que vacía el carrito.
    const resp = await emptyCart(cid);
    if (resp.status === 'succes') {
      setProducts([]);
      toast.success(resp.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
    }
  }

  useEffect(() => { // useEffect para renderizar los componentes del carrito del usuario logueado y determinar
    const fetchData = async () => { // el precio y la cantidad total de productos.
      const resp = await getProductsCart(cid);
      if (resp.status === 'succes') {
        const prods = resp.payload.products;
        let amount = 0;
        let totalProds = 0;
        if (prods.length !== 0) {
          for (let index = 0; index < prods.length; index++) {
            const element = prods[index];
            totalProds += element.quantity;
            amount += (element.quantity * element.product.price);
          }
        }
        setTotal(amount);
        setCantProds(totalProds);
        setProducts(resp.payload.products);
        setLoading(false);
      }
      if (resp.status === 'error') {
        console.log(resp.error);
      }
    }

    fetchData(); // Llamado a la función del useEffect.
  }, [])


  return (
    <div>
      {loading ?
        <p>Cargando...</p>
        :
        products.length !== 0 ?
          <div className='body-cart'> {/* Div donde se muestran los productos y la info de pago. */}
            <div className='div-cart'> {/* div con los productos agregados al carrito */}
              {products.map((prod, index) => {
                return (
                  <div key={prod.product._id} className='div-prod-cart'> {/* div de cada producto */}
                    <img src={prod.product.imageUrl} alt="" width={65} height={65} />
                    <span className='prod-title'><Link to={`/itemdetail/${prod.product._id}`}>{prod.product.title}</Link></span>
                    <div className='div-quantity'> {/* div para manejar la cantidad de producto */}
                      <span>Cantidad: </span>
                      <div className='input-quantity'>
                        {prod.quantity === 1 ? /* si hay un solo producto no muestra el boton de decremento*/
                          ''
                          :
                          <button className='btn-minus' onClick={() => decrease(prod.product._id, prod._id)}>
                            <FontAwesomeIcon icon={faMinus} /> {/* boton de decremento */}
                          </button>
                        }
                        <span>{prod.quantity}</span> {/* cantidad de producto */}
                        {
                          prod.quantity === prod.product.stock ? /* Si la cantidad es la misma que el stock no renderiza el botón de aumento */
                            ''
                            :
                            <button onClick={() => increase(prod.product._id, prod._id)} className='btn-plus' >
                              <FontAwesomeIcon icon={faPlus} /> {/* Botón de aumento */}
                            </button>
                        }
                      </div>
                    </div>
                    <span>Precio unitario: ${prod.product.price}</span>
                    <span>Precio total: ${prod.product.price * prod.quantity}</span>
                  </div>
                )
              })}
            </div>
            <div className='div-resume'> {/* Div con el resumen de la compra */}
              <h4>Resumen de compra</h4>
              <div className='div-total'>
                <span>Productos: {cantProds}</span>
                <span className='span-total'>Total: ${total}</span>
              </div>
              {end ?
                <div>
                  <PagoComponent />
                  <div>
                    <button>Pago con efectivo</button>
                  </div>
                </div>
                :
                <button className='btn-endpurchase' onClick={endPurchase}>Finalizar compra</button>}
            </div>
          </div>
          :
          <p className='no-prods'>Todavia no agregaste ningún producto</p> /* Si no hay productos en el carrito renderiza el texto */

      }
      {products.length !== 0 && <div className='div-emptyCart'> {/* Si hay productos renderiza el boton para vaciar el carrito */}
        <button className='btn-emptyCart' onClick={vaciarCarrito}>Vaciar carrito</button> {/* Botón para vaciar el carrito */}
      </div>}

    </div>
  )
}

export default Cart;