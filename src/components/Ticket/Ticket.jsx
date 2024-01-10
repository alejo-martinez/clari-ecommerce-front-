import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import './Ticket.css';

function Ticket() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async()=>{
            try {
                const status = searchParams.get('status');
                const paymentId = searchParams.get('payment_id');
                if(status === 'approved'){
                    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`,{
                        method: "GET",
                        headers:{
                            Authorization:`Bearer ${process.env.REACT_APP_PUBLIC_KEY_MP}`
                        }
                    });
                    const json = await response.json();
                    setPayment(json);
                    setLoading(false);
                }

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();

    }, [])
    
  return (
    <div>
        {loading? <p>Cargando...</p>
         :
            <div>
                <h3>Su orden de compra</h3>
                <span>Pago realizado con: {payment.payment_type_id}</span>
                <span>Productos: {payment.description}</span>
                <span>Total pagado: {payment.transaction_amount}</span>
            </div>
        }
    </div>
  )
}

export default Ticket