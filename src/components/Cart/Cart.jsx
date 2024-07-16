import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

//Librerias extras
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import Cookies from 'js-cookie';

import { sendMessage } from '../../assets/sendMessageWsp';

//Context del carrito
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProd } from '../context/ProductContext';
import { useMp } from '../context/MpContext';

//Componente de pago
import PagoComponent from '../PagoComponent/PagoComponent';
import GetnetComponent from '../GetnetComponent/GetnetComponent';

import './Cart.css';

Modal.setAppElement('#root');

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { cid } = useParams(); //Id del carrito llegado por parámetro de la ruta
  const { cart, usuario } = useAuth();
  const { setProdsCookie } = useMp();
  const { getById } = useProd();

  const { getProductsCart, addProduct, removeProd, emptyCart, createTicket } = useCart(); //Funciones del contextodel carrito

  const [products, setProducts] = useState([]); // Estado de los productos dentro del carrito
  const [loading, setLoading] = useState(true); // Estado loading para permitir la carga de datos antes de renderizar contenido
  const [total, setTotal] = useState(0); // Estado del monto total de dinero a pagar
  const [cantProds, setCantProds] = useState(0); // Estado de la cantidad de productos totales a comprar
  const [end, setEnd] = useState(false); // Estado que determina el renderizado del componente de pago
  const [payStatus, setPayStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState({payment_method: ''});
  const [loader, setLoader] = useState(false);

  // const [mpPay, setMpPay] = useState(null);
  // const [cashPay, setCashPay] = useState(null);

  const whatsAppRedirect = async() => {
    setLoader(true);
    let quantity = 0;
    let amount = 0;
    // let userCookie;
    // if(usuario) userCookie = usuario;
    // if(!usuario) userCookie = user;
    products.forEach(p =>{
      quantity += Number(p.quantity);
      amount += (Number(p.quantity) * Number(p.unitPrice));
    });
    const objData = {products: products, quantity: quantity, amount: amount, payment_method: paymentMethod.payment_method, status: 'pending', userCookie: usuario};
    const resp = await createTicket(objData);
    if(resp.status === 'success'){
      setLoader(false);
      const nroTel = '543424777555';
      const msg = sendMessage(usuario, products, paymentMethod.payment_method);
      const msgCodificado = encodeURIComponent(msg);
      const url = `https://api.whatsapp.com/send?phone=${nroTel}&text=${msgCodificado}`;
      window.location.href = url;
    }
  }

  const endPurchaseWithCookie = () => {
    setProdsCookie(products);
    navigate('/endpurchase', { state: { prods: products, cid: cid } });
  }

  const increase = async (pid, id, color, size) => { // Función para incrementar la cantidad de un producto. Al estar dentro del componente "carrito" solo incrementa los productos que ya estén dentro del mismo. El límite del agregado depende del stock del producto.
    const cookieExist = Cookies.get('shop_cart');
    const body = { idProd: pid, quantity: 1, color: color, size: size }
    if (!cookieExist) {

      const resp = await addProduct(cid, body);
      if (resp.status === 'succes') {
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
    } else {
      const carrito = JSON.parse(cookieExist);
      const prodsUpdate = [...products];
      const prodExist = carrito.products.findIndex(p => p.product === pid && p.variant.color === color && p.variant.size === size);
      const prodUpdate = prodsUpdate.findIndex(p => p.product._id === pid && p.variant.color === color && p.variant.size === size);
      carrito.products[prodExist].quantity += 1;
      prodsUpdate[prodUpdate].quantity += 1;
      const newTotal = Number(total) + Number(prodsUpdate[prodUpdate].unitPrice);
      const newCantProds = Number(cantProds) + 1;
      setTotal(newTotal);
      setCantProds(newCantProds);
      Cookies.set('shop_cart', JSON.stringify(carrito), { expires: 7 });
    }
  }

  const decrease = async (pid, id, color, size) => { // Función para decrementar la cantidad de un producto. Al estar dentro
    const cookieExist = Cookies.get('shop_cart');
    if (!cookieExist) {
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
    } else {
      const carrito = JSON.parse(cookieExist);
      const prodsUpdate = [...products];
      const prodExist = carrito.products.findIndex(p => p.product === pid && p.variant.color === color && p.variant.size === size);
      const prodUpdate = prodsUpdate.findIndex(p => p.product._id === pid && p.variant.color === color && p.variant.size === size);
      carrito.products[prodExist].quantity -= 1;
      prodsUpdate[prodUpdate].quantity -= 1;
      const newTotal = Number(total) - Number(prodsUpdate[prodUpdate].unitPrice);
      const newCantProds = Number(cantProds) - 1;
      setTotal(newTotal);
      setCantProds(newCantProds);
      Cookies.set('shop_cart', JSON.stringify(carrito), { expires: 7 });
    }
  }

  const endPurchaseWithoutUser = () => {

  }

  const handleSelect = ({target: {name, value}})=>{
    setPaymentMethod({[name]: value});
  }


  const removeProductCart = async (pid, quantity, color, size, index, unitPrice) => {
    const cookieExist = Cookies.get('shop_cart');
    if (!cookieExist) {
      const resp = await removeProd(cid, pid, quantity, color, size);
      if (resp.status === 'succes') {
        toast.success(resp.message, { autoClose: 2000, closeButton: true, hideProgressBar: true });
        const newTotalProds = Number(cantProds) - Number(quantity);
        setCantProds(newTotalProds);
        const newTotal = Number(total) - (Number(quantity) * Number(unitPrice));
        const prods = [...products];
        prods.splice(index, 1);
        setTotal(newTotal)
        setProducts(prods);
      }
      if (resp.status === 'error') {
        toast.error(resp.error, { autoClose: 3000, closeButton: true, hideProgressBar: true, pauseOnHover: true });
      }
    } else {
      const carrito = JSON.parse(cookieExist);
      const prodsUpdate = [...products];
      const prodsFilter = carrito.products.filter(p => !(p.product === pid && p.variant.color === color && p.variant.size === size));

      const newTotal = Number(total) - (Number(quantity) * Number(unitPrice));
      const newTotalProds = Number(cantProds) - Number(quantity);
      const updtArray = prodsUpdate.filter(p => !(p.product._id === pid && p.variant.color === color && p.variant.size === size));

      setProducts(updtArray);
      setCantProds(newTotalProds);
      setTotal(newTotal);
      carrito.products = prodsFilter
      Cookies.set('shop_cart', JSON.stringify(carrito), { expires: 7 })
    }
  }

  const maxProds = (index, color, size) => {
    const findColor = products[index].product.variants.find(item => item.color === color);
    if (findColor) {
      const findSize = findColor.sizes.find(i => i.size === size);
      if (findSize) {
        return Number(findSize.stock);
      }
    }
  }

  const endPurchase = (arg) => { // Función para renderizar la vista del componente de pago.
    setEnd(arg);
  }

  const vaciarCarrito = async () => { // Función que vacía el carrito.
    const cookieExist = Cookies.get('shop_cart');
    if (!cookieExist) {
      const resp = await emptyCart(cid);
      if (resp.status === 'succes') {
        setProducts([]);
        toast.success(resp.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
      }
    } else {
      const carrito = JSON.parse(cookieExist);
      carrito.products = [];
      Cookies.set('shop_cart', JSON.stringify(carrito), { expires: 7 });
      setProducts([]);
      toast.success('Carrito vaciado !', { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
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
      const cookieExist = Cookies.get('shop_cart');
      if (!cookieExist) {
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
      } else {
        const carrito = JSON.parse(cookieExist);
        // console.log(carrito)
        let totalProds = 0;
        let amount = 0;
        if (carrito.products.length !== 0) {
          for (let index = 0; index < carrito.products.length; index++) {
            const element = carrito.products[index];
            const productoBdd = await getById(element.product);
            totalProds += element.quantity;
            amount += (element.quantity * element.unitPrice);
            if (productoBdd) element.product = productoBdd.payload;
          }
        }
        setTotal(amount);
        setCantProds(totalProds)
        setProducts(carrito.products);
        // console.log(carrito.products)
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
                          <button className='btn-remove-prod' onClick={() => removeProductCart(prod.product._id, prod.quantity, prod.variant.color, prod.variant.size, index, prod.unitPrice)} title='Quitar del carrito'>Eliminar</button>
                        </div>
                      </div>
                      <div className='div-quantity'> {/* div para manejar la cantidad de producto */}
                        <button className='btn-minus' onClick={() => decrease(prod.product._id, prod._id, prod.variant.color, prod.variant.size)} disabled={prod.quantity === 1 ? true : false}>
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span>{prod.quantity}</span>
                        <button onClick={() => increase(prod.product._id, prod._id, prod.variant.color, prod.variant.size)} className='btn-plus' disabled={prod.quantity === maxProds(index, prod.variant.color, prod.variant.size) ? true : false}>
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                      <div className='div-price-cart'>
                        <span>$ {prod.unitPrice * prod.quantity}</span>
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
                {end === 'mp' &&
                  <div className='div-pay-option'>
                    <button onClick={() => endPurchase(false)} className='btn-back-pay' title='Elegir otro medio de pago'>
                      <FontAwesomeIcon icon={faSquareMinus} color='red' />
                    </button>
                    <PagoComponent />
                  </div>
                }
                {end === 'cash' &&
                  <div className='div-pay-option'>
                    <button onClick={() => endPurchase(false)} className='btn-back-pay' title='Elegir otro medio de pago'>
                      <FontAwesomeIcon icon={faSquareMinus} color='red' />
                    </button>
                    <button className='btn-pay-cash' onClick={cashPay}>Generar orden de compra</button>
                  </div>
                }
                {end === 'getnet' &&
                  <div className='div-pay-option'>
                    <GetnetComponent items={products} idCart={cid} />
                  </div>
                }
                {usuario && !end ?
                  <div className='div-btns-pay'>
                    <div className='div-select'>
                      <select name="payment_method" onChange={handleSelect} value={paymentMethod.payment_method}>
                        <option value="">Selecciona un método de pago</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="getnet">Link de pago Getnet</option>
                        <option value="efectivo">Efectivo</option>
                      </select>
                    </div>
                    {/* <div className='div-option-payment'>
                      <button className='btn-option-pay' onClick={() => endPurchase('mp')}>Pagar con mercado pago</button>
                      <label >Pagar con Mercado Pago</label>
            <input type="checkbox" checked={payment} onChange={() => endPurchase('mp')} />
                    </div>
                    <div className='div-option-payment'>
                      <button className='btn-option-pay' onClick={() => endPurchase('cash')}>Pagar en el local</button>
                      <label >Pagar en el local</label>
            <input type="checkbox" checked={payment} onChange={() => endPurchase('cash')} />
                    </div> */}
                    {paymentMethod.payment_method?
                    <div className='div-option-payment'>
                      {/* <label >Pagar mediante whatsapp</label> */}
                      <button className='btn-option-pay' onClick={whatsAppRedirect}>Enviar pedido al Whats App</button>
                    </div>
                  :
                  <div className='div-option-payment'>
                  {/* <label >Pagar mediante whatsapp</label> */}
                  <button className='btn-option-pay-disabled' disabled={true} title='Selecciona un método de pago'>Enviar pedido al Whats App</button>
                </div>
                  }
                  </div> :
                  <div  className='div-option-payment'>
                    <button onClick={endPurchaseWithCookie} className='btn-option-pay'>Finalizar compra</button>
                    {/* <Link to={'/endpurchase'}>Finalizar compra</Link> */}
                  </div>
                }
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