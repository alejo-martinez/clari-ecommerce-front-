import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useCart } from '../context/CartContext';
import { useProd } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

import './ItemDetail.css';

function ItemDetail() {
    const { addProduct } = useCart();
    const { getById } = useProd();
    const { usuario, setPrevLocation } = useAuth();

    const { pid } = useParams();

    const [loading, setLoading] = useState(true);
    const [prod, setProd] = useState(null);
    const [error, setError] = useState(null);
    const [addProd, setAddProd] = useState({ idProd: '', quantity: 0 });
    const [loadAdd, setLoadAdd] = useState(false);

    const navigation = useNavigate();
    const location = useLocation();

    const handleAddProd = ({ target: { value } }) => {
        if (addProd.idProd === '') {
            setAddProd({ idProd: prod._id, quantity: parseFloat(value) });
        } else {
            setAddProd({ ...addProd, quantity: parseFloat(value) });
        }
    }

    const handleAdd = async () => {
        if (!usuario){
            setPrevLocation(location.pathname);
            navigation('/login');
        } 
        else {
            setLoadAdd('loading');
            setAddProd({...addProd, quantity: parseFloat(addProd.quantity)});
            const resp = await addProduct(usuario.cart, addProd.idProd, addProd.quantity);
            console.log(resp);
            if (resp.status === 'succes') {
                if (error) setError(null);
                setAddProd({ idProd: '', quantity: 0 });
                setLoadAdd('succes');
                setTimeout(()=>{
                    setLoadAdd(false);
                }, 3000);
            }
            if (resp.status === 'error') {
                if(resp.error == 'Missing data'){
                    setError('Especifica una cantidad');
                    setLoadAdd(false);
                } 
                else{
                    setError(resp.error);
                    setLoadAdd(false);
                }
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
                            <img src={prod.imageUrl} alt="" width={500} height={500}/>
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
                            <div className='div-response'>
                                <span className='span-response'>
                                {loadAdd === 'succes'? 'Agregado al carrito!' : loadAdd === 'loading'? 'Cargando...' : ''}
                                </span>
                            </div>
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