import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

//Librerias extras
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

//Context del carrito
import { useCart } from '../context/CartContext';

//Componente de pago
import PagoComponent from '../PagoComponent/PagoComponent';

import './Cart.css';

Modal.setAppElement('#root');

function Cart() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { cid } = useParams(); //Id del carrito llegado por parámetro de la ruta

  const { getProductsCart, addProduct, removeProd, emptyCart, createTicket } = useCart(); //Funciones del contextodel carrito

  const [products, setProducts] = useState([]); // Estado de los productos dentro del carrito
  const [loading, setLoading] = useState(true); // Estado loading para permitir la carga de datos antes de renderizar contenido
  const [total, setTotal] = useState(0); // Estado del monto total de dinero a pagar
  const [cantProds, setCantProds] = useState(0); // Estado de la cantidad de productos totales a comprar
  const [end, setEnd] = useState(false); // Estado que determina el renderizado del componente de pago
  const [payStatus, setPayStatus] = useState(null);
  // const [mpPay, setMpPay] = useState(null);
  // const [cashPay, setCashPay] = useState(null);


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

  const removeProductCart = async (pid, quantity) => {
    const resp = await removeProd(cid, pid, quantity);
    if (resp.status === 'succes') {
      toast.success(resp.message, { autoClose: 2000, closeButton: true, hideProgressBar: true });
      const prods = [...products];
      const prodsFilter = prods.filter(prod => prod.product._id !== pid)
      setProducts(prodsFilter);
    }
    if (resp.status === 'error') {
      toast.error(resp.error, { autoClose: 3000, closeButton: true, hideProgressBar: true, pauseOnHover: true });
    }
  }

  const endPurchase = (arg) => { // Función para renderizar la vista del componente de pago.
    setEnd(arg);
  }

  const vaciarCarrito = async () => { // Función que vacía el carrito.
    const resp = await emptyCart(cid);
    if (resp.status === 'succes') {
      setProducts([]);
      toast.success(resp.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
    }
  }

  const closeModal = () => {
    setPayStatus(null);
  }

  const cashPay = async () => {
    const ticket = { products: products, quantity: cantProds, amount: total, paymentMethod: 'cash', status: 'Pendiente de pago' };
    const resp = await createTicket(ticket);
    if (resp.status === 'succes') {
      toast.success(`${resp.message}`, { position: "top-center", autoClose: false, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
    }
    if (resp.status === 'error') {
      toast.error('Error al generar la orden de compra, intenta nuevamente', { position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false });
    }
  }

  useEffect(() => { // useEffect para renderizar los componentes del carrito del usuario logueado y determinar el precio y la cantidad total de productos. Si hay parámetros de pago

    const fetchData = async () => {
      const resp = await getProductsCart(cid);
      if (resp.status === 'succes') {
        
        const prods = resp.payload.products;
        let amount = 0;
        let totalProds = 0;
        if (prods.length !== 0) {
          for (let index = 0; index < prods.length; index++) {
            const element = prods[index];
            totalProds += element.quantity;
            const variant = element.product.variants.find(item => item.color === element.color);
            const size = variant.sizes.find(item => item.size === element.size);
            amount += (element.quantity * size.price);
          }
        }
        setTotal(amount);
        setCantProds(totalProds);
        setProducts(resp.payload.products);

      }
      if (resp.status === 'error') {
        console.log(resp.error);
      }
    }
    const status = searchParams.get('status');
    if (status && status === 'in_process') setPayStatus('pending');
    if (status && status === 'approved') setPayStatus('approved');
    if (status && status === 'rejected') setPayStatus('rejected');


    fetchData(); // Llamado a la función del useEffect.
    setLoading(false);
  }, [])


  return (
    <div>
      {loading ?
        <p>Cargando...</p>
        :
        products.length !== 0 ?
          <>
            {payStatus &&
              <Modal isOpen={payStatus} onRequestClose={closeModal} style={{
                content: {
                  width: 'fit-content',
                  height: 'fit-content',
                  margin: 'auto',
                },
              }}>
                <h4 style={{ textAlign: 'center', marginBottom: '7px' }}>{payStatus === 'approved' ? 'Compra realizada con éxito' : payStatus === 'pending' ? 'Compra pendiente' : payStatus === 'rejected' ? 'Su compra fue rechazada' : ''}</h4>
                <p>{payStatus === 'approved' ? 'Gracias por comprar en nuestra tienda ! Se envió un recibo de la compra al email registrado. Haga click en cualquier lado para salir' : payStatus === 'pending' ? 'Su pago se encuentra pendiente, cuando se acredite será notificado/a vía email con el email registrado. Haga click en cualquier lado para salir' : payStatus === 'rejected' ? 'Su compra fue rechazada, pruebe con otro medio de pago. Haga click en cualquier lado para salir' : ''}</p>
              </Modal>}
            <div className='body-cart'> {/* Div donde se muestran los productos y la info de pago. */}
              <div className='div-cart'> {/* div con los productos agregados al carrito */}
                {products.map((prod, index) => {
                  return (
                    <div key={prod.product._id} className='div-prod-cart'> {/* div de cada producto */}
                      <img src={prod.product.imageUrl} alt="" width={65} height={65} className='img-cart' />
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
                      <div className='div-price-cart'>
                        <span>Precio unitario: ${prod.price}</span>
                        <span>Precio total: ${prod.price * prod.quantity}</span>
                      </div>
                      <div className='div-btn-remove'>
                        <button className='btn-remove-prod' onClick={() => removeProductCart(prod.product._id, prod.quantity)} title='Quitar del carrito'>
                          <FontAwesomeIcon icon={faSquareMinus} color='red' />
                        </button>
                      </div>
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
                {end === 'mp' ?
                  <div className='div-pay-option'>
                    <button onClick={() => endPurchase(false)} className='btn-back-pay' title='Elegir otro medio de pago'>
                      <FontAwesomeIcon icon={faSquareMinus} color='red' />
                    </button>
                    <PagoComponent />
                  </div>
                  :
                  end === 'cash' ?
                    <div className='div-pay-option'>
                      <button onClick={() => endPurchase(false)} className='btn-back-pay' title='Elegir otro medio de pago'>
                        <FontAwesomeIcon icon={faSquareMinus} color='red' />
                      </button>
                      <button className='btn-pay-cash' onClick={cashPay}>Generar orden de compra</button>
                    </div>
                    :
                    <div className='div-btns-pay'>
                      <div className='div-checkbox'>
                        <label >Pagar con Mercado Pago</label>
                        <input type="checkbox" checked={end} onChange={() => endPurchase('mp')} />
                      </div>
                      <div className='div-checkbox'>
                        <label >Pagar en el local</label>
                        <input type="checkbox" checked={end} onChange={() => endPurchase('cash')} />
                      </div>
                    </div>}
              </div>
            </div>
          </>
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