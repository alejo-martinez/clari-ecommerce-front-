import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useCart } from '../context/CartContext';
import { useProd } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

import './ItemDetail.css';

function ItemDetail() {
    const { addProduct } = useCart();
    const { getById } = useProd();
    const { usuario } = useAuth();

    const { pid } = useParams();

    const [loading, setLoading] = useState(true);
    const [prod, setProd] = useState(null);
    const [error, setError] = useState(null);
    const [addProd, setAddProd] = useState({ idProd: '', quantity: 0 });
console.log(addProd);
    const navigation = useNavigate();

    const handleAddProd = ({ target: { value } }) => {
        if (addProd.idProd === '') {
            setAddProd({ idProd: prod._id, quantity: value });
        } else {
            setAddProd({ ...addProd, quantity: value });
        }
    }

    const handleAdd = async () => {
        if (!usuario) navigation('/login')
        else {
            const resp = await addProduct(usuario.cart, addProd.idProd, addProd.quantity);
            if (resp.status === 'succes') {
                setAddProd({ idProd: '', quantity: 0 });
                toast.success(resp.payload, { position: "top-right", autoClose: 2000, hideProgressBar: true, closeOnClick: false, closeButton: false });
                if (error) setError(null);
            }
            if (resp.status === 'error') {
                setError(resp.error);
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const resp = await getById(pid);
            if (resp.status === 'succes') {
                setProd(resp.payload);
                setLoading(false);
            }
            if (resp.status === 'error') {
                console.log(resp.error);
                setProd(null);
                setLoading(false);
            }
        };

        fetchData();
    }, [])

    return (
        <div className='body-item'>
            {loading ?
                <p>Cargando...</p>
                :
                prod ?
                    <div className='div-item-detail'>
                        <div className='div-img'>
                            <img src={prod.imageUrl} alt="" />
                        </div>
                        <div className='div-info'>
                            <div className='div-info-props'>
                                <div className='item-prop'>
                                    <h3>{prod.title}</h3>
                                    <span className='span-price'>${prod.price}</span>
                                </div>
                                <div className='item-prop'>
                                    <span className='span-stock'>Stock: {prod.stock}</span>
                                    <label>Cantidad:</label>
                                    <input type="number" onChange={handleAddProd} />
                                </div>
                            </div>
                            <div className='div-btn-add-prod'>
                                <button className='btn-add-prod' onClick={handleAdd}>Agregar al carrito</button>
                                <span className='error-add'>{error && `${error}`}</span>
                            </div>
                        </div>
                    </div>
                    :
                    <p>No existe el producto</p>
            }
        </div>
    )
}

export default ItemDetail