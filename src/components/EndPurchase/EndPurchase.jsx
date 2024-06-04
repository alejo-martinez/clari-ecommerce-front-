import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import PagoComponent from '../PagoComponent/PagoComponent';
import GetnetComponent from '../GetnetComponent/GetnetComponent';

import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faSquareMinus } from '@fortawesome/free-solid-svg-icons';

import { sendMessage } from '../../assets/sendMessageWsp';

import { useAuth } from '../context/AuthContext';
import { useMp } from '../context/MpContext';
import { useCart } from '../context/CartContext';

import './EndPurchase.css'

function EndPurchase() {

  const location = useLocation();
  // const {cart} = useAuth();
  const {createTicket} = useCart();
  const { setUserCookie } = useMp()

  

  const [user, setUser] = useState({ name: '', surname: '', email: '' });
  const [end, setEnd] = useState(null);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState({paymentMethod: ''});

  const { prods, cid } = location.state;

  // console.log(prods)
  const endPurchase = (arg) => { // Función para renderizar la vista del componente de pago.
    setPayment(arg);
  }
  const selectAnotherPayment = (arg) => { // Función para renderizar la vista del componente de pago.
    setPayment('')
    setEnd(arg);
  }

  const handleChange = ({ target: { name, value } }) => {
    if (error !== '') setError('');
    setUser({ ...user, [name]: value });
  }

  const handleSelect = ({target: {name, value}}) =>{
    console.log({name: name, value: value})
    setPaymentMethod({[name]: value});
  }

  const selectPayment = () => {
    if(user.name.trim() !== '' && user.surname.trim() !== '' && user.email.trim() !== ''){
      setUserCookie({ name: user.name, surname: user.surname, email: user.email, cart: { products: prods, _id: cid } })
      setEnd('select')
    } else{
      toast.error('Debes completar todos los datos')
    }
  }
  const whatsAppRedirect = async() => {
    let quantity = 0;
    let amount = 0;
    // let userCookie;
    // if(usuario) userCookie = usuario;
    // if(!usuario) userCookie = user;
    prods.forEach(p =>{
      quantity += Number(p.quantity);
      amount += (Number(p.quantity) * Number(p.unitPrice));
    });
    const objData = {products: prods, quantity: quantity, amount: amount, payment_method: paymentMethod.paymentMethod, status: 'pending', userCookie: user};
    const resp = await createTicket(objData);
    if(resp.status === 'success'){

      const nroTel = '543424777555';
      const msg = sendMessage(user, prods, paymentMethod.paymentMethod);
      const msgCodificado = encodeURIComponent(msg);
      const url = `https://api.whatsapp.com/send?phone=${nroTel}&text=${msgCodificado}`;
      window.location.href = url;
    }
  }
  // const cashPay = async () => {
  //   const ticket = { products: products, quantity: cantProds, amount: total, paymentMethod: 'cash', status: 'Pendiente de pago' };
  //   const resp = await createTicket(ticket);
  //   if (resp.status === 'succes') {
  //     toast.success(`${resp.message}`, { position: "top-center", autoClose: false, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
  //   }
  //   if (resp.status === 'error') {
  //     toast.error('Error al generar la orden de compra, intenta nuevamente', { position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false });
  //   }
  // }

  useEffect(() => {


  }, [])


  return (
    <div>
      {!end &&
        <div className='div-end-purchase'>
          <h3>Completa tus datos</h3>
          <div className='div-form-end'>

            <div className='div-input'>
              <label>Nombre</label>
              <input type="text" name='name' onChange={handleChange} />
            </div>
            <div className='div-input'>
              <label>Apellido</label>
              <input type="text" name='surname' onChange={handleChange} />
            </div>
            <div className='div-input'>
              <label>Email</label>
              <input type="text" name='email' onChange={handleChange} />
            </div>
            <div className='div-select'>
              <select name='paymentMethod' value={paymentMethod.paymentMethod} onChange={handleSelect}>
                <option value="">Elegir medio de pago</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Getnet">Link de pago Getnet</option>
                <option value="Efectivo">Efectivo</option>
              </select>
            </div>
            <div className='div-btn-end'>
              <button onClick={selectPayment} className='btn-login'>Elegir el medio de pago</button>
            </div>
          </div>
        </div>
      }
      {(end === 'select' && !payment) &&
        <div className='div-select-payment'>
          <h3>Selecciona el método de pago</h3>
          {/* <div className='div-option-payment'>
            <button className='btn-option-pay' onClick={() => endPurchase('mp')}>Pagar con mercado pago</button> */}
            {/* <label >Pagar con Mercado Pago</label>
            <input type="checkbox" checked={payment} onChange={() => endPurchase('mp')} /> */}
          {/* </div> */}
          {/* <div className='div-option-payment'>
            <button className='btn-option-pay' onClick={() => endPurchase('cash')}>Pagar en el local</button> */}
            {/* <label >Pagar en el local</label>
            <input type="checkbox" checked={payment} onChange={() => endPurchase('cash')} /> */}
          {/* </div> */}
          <div className='div-option-payment'>
            {/* <label >Pagar mediante whatsapp</label> */}
            <button className='btn-option-pay' onClick={whatsAppRedirect}>Enviar pedido al Whats App</button>
          </div>
          {/* <div className='div-option-payment'>
            <button className='btn-option-pay' onClick={() => endPurchase('mp')}>Pagar con mercado pago</button>
            <label>Pagar con GetNet</label>
            <input type="checkbox" checked={payment} onChange={() => endPurchase('getnet')} />
          </div> */}
        </div>
      }
      <div>
        <div className='div-btns-pay'>
          {payment === 'mp' &&
            <div className='div-pay-option'>
              <button onClick={() => selectAnotherPayment('select')} className='btn-back-pay' title='Elegir otro medio de pago'>
                <FontAwesomeIcon icon={faSquareMinus} color='red' />
              </button>
              <PagoComponent />
            </div>

          }
          {payment === 'cash' &&
            <div className='div-pay-option'>
              <button onClick={() => selectAnotherPayment('select')} className='btn-back-pay' title='Elegir otro medio de pago'>
                <FontAwesomeIcon icon={faSquareMinus} color='red' />
              </button>
              {/* <button className='btn-pay-cash' onClick={cashPay}>Generar orden de compra</button> */}
            </div>

          }
          {
            payment === 'getnet' &&
            <div className='div-pay-option'>
              {/* <GetnetComponent items={prods} idCart={cid} /> */}
            </div>


          }
        </div>
      </div>

    </div>
  )
}

export default EndPurchase