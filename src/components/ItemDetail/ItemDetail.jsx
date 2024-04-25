import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';

import Arrow from '../CustomArrows/Arrow';

import { useCart } from '../context/CartContext';
import { useProd } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

import './ItemDetail.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ItemDetail() {
    const { addProduct } = useCart();
    const { getById, colorCodes } = useProd();
    const { usuario, setPrevLocation } = useAuth();

    const { pid } = useParams();

    const [loading, setLoading] = useState(true);
    const [prod, setProd] = useState(null);
    const [error, setError] = useState(null);
    const[variant, setVariant] = useState(null);
    // const [variants, setVariants] = useState(null)
    const [size, setSize] = useState(null);
    // const [sizes, setSizes] = useState(null);

    const [quantity, setQuantity] = useState(0);

    const navigation = useNavigate();
    const location = useLocation();

    const handleQuantity = (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, '');
        setQuantity(inputValue === '' ? 0 : parseInt(inputValue, 10));
    }

    const handleIncrement = () => {
        setQuantity(prevValue => (prevValue === prod.stock ? prevValue : prevValue + 1));
    };

    const handleDecrement = () => {
        setQuantity(prevValue => (prevValue > 0 ? prevValue - 1 : 0));
    };

    const handleAdd = async () => {
        if (!usuario) {
            setPrevLocation(location.pathname);
            navigation('/login');
        }
        else {
            const obj = { idProd: prod._id, quantity: quantity }
            const resp = await addProduct(usuario.cart, obj);

            if (resp.status === 'succes') {
                if (error) setError(null);
                toast.success('Agregado al carrito!', { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false });
                setQuantity(0);
            }
            if (resp.status === 'error') {
                if (resp.error === 'Missing data') {
                    setError('Especifica una cantidad');
                }
                else {
                    setError(resp.error);
                }
            }
        }
    }

    const setearVariant = (i) =>{
        setVariant(prod.variants[i]);
        setSize(prod.variants[i].sizes[0]);
    }

    const setearSize = (i) =>{
        setSize(variant.sizes[i]);
    }

    useEffect(() => {
        const fetchData = async () => {
            const resp = await getById(pid);
            if (resp.status === 'succes') {
                setProd(resp.payload);
                setVariant(resp.payload.variants[0]);
                setSize(resp.payload.variants[0].sizes[0]);
                setLoading(false);

            }
            if (resp.status === 'error') {
                console.log(resp.error);
                setProd(null);
                setLoading(false);
            }
        };

        fetchData();
    }, [pid])


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: 'slider-img',
        nextArrow: <Arrow />,
        prevArrow: <Arrow />
    }

    return (
        <div className='body-item'>
            {loading ?
                <p>Cargando...</p>
                :
                prod ?
                    <div className='div-item-detail'>
                        <div className='img-container'>
                            <Slider {...settings}>
                                {prod.imagesUrl.map((img, i) => {
                                    return (
                                        <div key={`img${i}`} className='div-img-home'>
                                            <img src={img} height={500} width={400} alt="Imagen de producto" />
                                        </div>
                                    )
                                })}
                            </Slider>
                        </div>
                        <div className='item-detail'>

                            <div className='div-info'>
                                <h3>{prod.title}</h3>
                                <p>{prod.description}</p>
                            </div>
                            <div className='container-colors'>
                                <h5>Colores disponibles:</h5>
                                <div className='div-colors'>

                                {prod.variants.map((variant, index) => {
                                    return (
                                        <div key={`color${index}`}>
                                            <button style={{background: colorCodes[variant.color]}} onClick={()=> setearVariant(index)}>{variant.color}</button>
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                            <div className='div-sizes'>
                                <h5>Talles disponibles:</h5>
                                <div>
                                    {variant.sizes.map((size, i)=>{
                                        return(

                                            <div key={`size${i}`}>
                                            <button onClick={()=> setearSize(i)}>{size.size}</button>
                                        </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='div-numbers'>
                                <div className='div-numbers-props'>
                                    <div className='item-prop'>
                                        <span className='span-price'>${size.price}</span>
                                    </div>
                                    {size.stock !== 0 ?
                                        <div className='item-prop'>
                                            <span className='span-stock'>Stock: {size.stock}</span>
                                            {(usuario && usuario.rol === 'client') || !usuario ?
                                                <div className='item-prop'>
                                                    <label>Cantidad:</label>
                                                    <div className='div-input-add'>
                                                        <FontAwesomeIcon icon={faMinus} className='btn-handle-quantity' onClick={handleDecrement} />
                                                        <input type="text" onChange={handleQuantity} value={quantity} className='input-quantity-add' />
                                                        <FontAwesomeIcon icon={faPlus} className='btn-handle-quantity' onClick={handleIncrement} />
                                                    </div>
                                                </div>
                                                :
                                                ''
                                            }
                                        </div>
                                        :
                                        <span>Sin stock</span>
                                    }
                                </div>
                                <div className='div-btn-add-prod'>
                                    {(usuario && usuario.rol === 'client') || !usuario ?
                                        <button className='btn-add-prod' onClick={handleAdd}>Agregar al carrito</button>
                                        :
                                        ''
                                    }
                                    <div className='div-error-add'>
                                        <span className='error-add'>{error && `${error}`}</span>
                                    </div>
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