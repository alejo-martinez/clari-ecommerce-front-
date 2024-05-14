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
import GetnetComponent from '../GetnetComponent/GetnetComponent';

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


  const increase = async (pid, id, color, size) => { // Función para incrementar la cantidad de un producto. Al estar dentro 
    const body = { idProd: pid, quantity: 1, color: color, size: size } // del componente "carrito" solo incrementa los productos que ya estén 
    const resp = await addProduct(cid, body); // dentro del mismo. El límite del agregado depende del stock del 
    if (resp.status === 'succes') { // producto.
      let newArray = [...products];
      let newTotal = total;
      let newTotalProds = cantProds;
      let prod = products.find(prod => prod._id === id);
      prod.quantity += 1;
      newArray.map(producto => producto._id === id ? prod : producto);
      newTotal += prod.unitPrice;
      newTotalProds += 1;
      setTotal(newTotal);
      setCantProds(newTotalProds);
      setProducts(newArray);
    }
  }

  const decrease = async (pid, id, color, size) => { // Función para decrementar la cantidad de un producto. Al estar dentro
    const resp = await removeProd(cid, pid, 1, color, size); // del componente "carrito" solo decrementa los productos que ya
    if (resp.status === 'succes') { // estén dentro del mismo. El límite de decremento es cuando existe una 
      let newArray = [...products]; // cantidad de 1 (uno) producto dentro del carrito.
      let newTotal = total;
      let newTotalProds = Number(cantProds);
      let prod = products.find(prod => prod._id === id);
      prod.quantity -= 1;
      newArray.map(producto => producto._id === id ? prod : producto);
      newTotal -= prod.unitPrice;
      newTotalProds -= 1;
      setTotal(newTotal);
      setCantProds(newTotalProds);
      setProducts(newArray);
    }
  }

  const removeProductCart = async (pid, quantity, color, size, index) => {
    const resp = await removeProd(cid, pid, quantity, color, size);
    if (resp.status === 'succes') {
      toast.success(resp.message, { autoClose: 2000, closeButton: true, hideProgressBar: true });
      const prods = [...products];
      prods.splice(index, 1);
      setProducts(prods);
    }
    if (resp.status === 'error') {
      toast.error(resp.error, { autoClose: 3000, closeButton: true, hideProgressBar: true, pauseOnHover: true });
    }
  }

  const maxProds = (index, color, size)=>{
    const findColor = products[index].product.variants.find(item=> item.color === color);
    if(findColor){
      const findSize = findColor.sizes.find(i => i.size === size);
      if(findSize){
        console.log()
        return Number(findSize.stock);
      }
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
            // const variant = element.product.variants.find(item => item.color === element.color);
            // const size = variant.sizes.find(item => item.size === element.size);
            amount += (element.quantity * element.unitPrice);
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
    if (status && status === 'success') setPayStatus('success');
    if (status && status === 'failed') setPayStatus('failed');


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
                <p>{(payStatus === 'approved' || payStatus === 'success') ? 'Gracias por comprar en nuestra tienda ! Se envió un recibo de la compra al email registrado. Haga click en cualquier lado para salir' : payStatus === 'pending' ? 'Su pago se encuentra pendiente, cuando se acredite será notificado/a vía email con el email registrado. Haga click en cualquier lado para salir' : (payStatus === 'rejected' || payStatus === 'failed') ? 'Su compra fue rechazada, pruebe con otro medio de pago. Haga click en cualquier lado para salir' : ''}</p>
              </Modal>}
            <div className='body-cart'> {/* Div donde se muestran los productos y la info de pago. */}
              <div className='div-cart'> {/* div con los productos agregados al carrito */}
                {products.map((prod, index) => {
                  return (
                    <div key={`prod.product._id${index}`} className='div-prod-cart'> {/* div de cada producto */}
                      <img src={prod.product.imagesUrl[0]} alt="" width={65} height={65} className='img-cart' />
                      <div className='div-info-prod'>
                        <span className='prod-title'><Link to={`/itemdetail/${prod.product._id}`}>{prod.product.title}</Link></span>
                        <span>Color: {prod.variant.color}, talle: {prod.variant.size}</span>
                        <div className='div-btn-remove'>
                          <button className='btn-remove-prod' onClick={() => removeProductCart(prod.product._id, prod.quantity, prod.variant.color, prod.variant.size, index)} title='Quitar del carrito'>Eliminar</button>
                        </div>
                      </div>
                        <div className='div-quantity'> {/* div para manejar la cantidad de producto */}
                          <button className='btn-minus' onClick={() => decrease(prod.product._id, prod._id, prod.variant.color, prod.variant.size)}  disabled={prod.quantity === 1 ? true: false}>
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span>{prod.quantity}</span>
                          <button onClick={() => increase(prod.product._id, prod._id, prod.variant.color, prod.variant.size)} className='btn-plus' disabled={prod.quantity === maxProds(index, prod.variant.color, prod.variant.size)? true : false}>
                          <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      <div className='div-price-cart'>
                        <span>$ {prod.unitPrice * prod.quantity }</span>
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
                    end === 'getnet' ?
                      <div className='div-pay-option'>
                        <GetnetComponent items={products} idCart={cid} />
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
                        <div className='div-checkbox'>
                          <label>Pagar con GetNet</label>
                          <input type="checkbox" checked={end} onChange={() => endPurchase('getnet')} />
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