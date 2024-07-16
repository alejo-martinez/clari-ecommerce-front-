import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePen, faTrashCan, faArrowLeft, faBan } from '@fortawesome/free-solid-svg-icons';


import './TicketDetail.css';
import { toast } from "react-toastify";

const TicketDetail = () => {

    const { approveTicket, deleteTicket } = useCart();

    const { tid } = useParams();
    const { getTicketById } = useCart();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);


    const navigation = useNavigate();

    const approvePay = async (id) => {
        const resp = await approveTicket(id);
        if (resp.status === 'succes') {
            setTicket({ ...ticket, status: 'Pagado' })
            toast.success(resp.message, { hideProgressBar: true, autoClose: 3000, closeButton: true })
        }
        if (resp.status === 'error') {
            toast.error(resp.error, { hideProgressBar: true, autoClose: false, closeButton: true });
        }
    }

    const deleteOrder = async (id) => {
        const resp = await deleteTicket(id);
        if (resp.status === 'succes') {
            toast.success(resp.message, { hideProgressBar: true, autoClose: 2000, closeButton: true });
            setTimeout(() => navigation('/controlpanel'), 2500)
        }
        if (resp.status === 'error') {
            toast.error(resp.error, { hideProgressBar: true, autoClose: false, closeButton: true, position: 'top-center' })
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const resp = await getTicketById(tid);
            if (resp.status === 'succes') {
                setTicket(resp.payload);

                setLoading(false);
            }
            if (resp.status === 'error') {
                console.log(resp.error);
                setLoading(false)
            }
        }

        fetchData();
    }, []);

    return (
        <>
            {loading ? <p>Cargando...</p>
                :
                <div>
                    <div>
                        <Link to={'/controlpanel?option=ventas'}>
                            <FontAwesomeIcon icon={faArrowLeft} size='2x' className='iconBack' />
                        </Link>
                    </div>
                    {ticket ?
                        <div className="ticket">
                            <h3>Orden de compra de {ticket.owner.name} {ticket.owner.second_name && ` ${ticket.owner.second_name}`} {ticket.owner.last_name}</h3>
                            <div className="ticket-info-user">
                                <span className="pay-id">ID de la compra: {ticket._id}</span>
                                <h4 className="title-prods">Productos:</h4>
                                {ticket.products.map(prod => (
                                    <div key={prod._id} className="div-each-item">
                                        <span>Producto: {prod.product.title}</span>
                                        <span>Cantidad: {prod.quantity > 1 ? `${prod.quantity} unidades` : `${prod.quantity} unidad`}</span>
                                        <span>Precio unitario: ${prod.unitPrice}</span>
                                        <span className="ticket-field-important">Precio x{prod.quantity > 1 ? `${prod.quantity} unidades` : `${prod.quantity} unidad`}: ${prod.unitPrice * prod.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="div-info-pago">
                                <span>Email de contacto: {ticket.owner.email}</span>
                                <span>Método de pago: {ticket.payment_method}</span>
                                <span>Cantidad de productos comprados: {ticket.quantity}</span>
                                <span className="ticket-field-important">Monto total: ${ticket.amount}</span>
                                <span className="ticket-field-important">Estado de la compra: {ticket.status}</span>
                            </div>
                            {ticket.status === 'pending' ?
                                <div className="div-btns-ticket">
                                    <button className="btn-ticket payed" onClick={() => approvePay(ticket._id)}>Marcar como pagado</button>
                                    <button className="btn-ticket canceled" onClick={() => deleteOrder(ticket._id)}>Cancelar Orden</button>
                                </div>
                                : ''}
                        </div>
                        :
                        <p>No se encontró la orden</p>
                    }
                </div>
            }
        </>
    )
};

export default TicketDetail;