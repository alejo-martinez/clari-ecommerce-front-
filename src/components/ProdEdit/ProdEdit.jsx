import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPen, faCaretLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useProd } from '../context/ProductContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import './ProdEdit.css';

function ProdEdit(prop) {
    const { getById, updateProd, updateImage } = useProd();
    const { pid, fnBack } = prop;

    const [edit, setEdit] = useState('');
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [valueProd, setValueProd] = useState({ field: '', value: '' });

    const handleUpdate = async () => {
        const resp = await updateProd(pid, valueProd);
        if (resp.status === 'succes') {
            setProducto({ ...producto, [valueProd.field]: valueProd.value });
            toast.success(resp.message, { position: "top-right", autoClose: 2000, hideProgressBar: true, closeOnClick: false, closeButton: false });
            setValueProd({ field: '', value: '' });
            setEdit('');
        }
        if (resp.status === 'error') {
            toast.error(resp.error, { position: "top-right", autoClose: 5000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true });
        }
    }

    const handleImageUpdate = async()=>{
        const resp = await updateImage(pid, valueProd.value);
        if (resp.status === 'succes') {
            setProducto({ ...producto, [valueProd.field]: valueProd.value });
            toast.success(resp.message, { position: "top-right", autoClose: 2000, hideProgressBar: true, closeOnClick: false, closeButton: false });
            setValueProd({ field: '', value: '' });
            setEdit('');
        }
        if (resp.status === 'error') {
            toast.error(resp.error, { position: "top-right", autoClose: 5000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true });
        }
    }

    const handleChange = ({ target: { name, value } }) => {
        setValueProd({ ...valueProd, 'value': value, 'field': name });
    }

    const handleImg = (e) => {
        setValueProd({ valueProd, ['value']: e.target.files[0] })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await getById(pid);
                if (resp.status === 'succes') {
                    setLoading(false);
                    setProducto(resp.payload);
                }
                if (resp.status === 'error') console.log(resp.error);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [])


    return (
        <div>
            {loading ?
                <p>Cargando...</p>
                :
                <div>
                    <h3 className='title-prod'>Editar producto</h3>
                    <div className='div-prod-edit'>

                        <div className='div-prop'>
                            <div>
                                <span className='span-prop'>Título: </span>
                            </div>
                            {
                                edit === `title${producto._id}` ?
                                    <div className='div-input-update'>
                                        <input type="text" name='title' onChange={handleChange} />
                                        <div className='btns-update'>
                                            <FontAwesomeIcon onClick={() => setEdit('')} icon={faXmark} className='btn-cancel' />
                                            <FontAwesomeIcon onClick={() => handleUpdate()} icon={faCheck} className='btn-update' />
                                        </div>
                                    </div>
                                    :
                                    <div className='div-span-value'>
                                        <span >{producto.title}</span>
                                        <div>
                                            <FontAwesomeIcon className='btn-edit' title='actualizar título' onClick={() => setEdit(`title${producto._id}`)} icon={faCaretLeft} />
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className="div-prop">
                            <span className='span-prop'>Imagen: </span>

                            {
                                edit === `img${producto._id}` ?
                                    <div className='div-input-update'>
                                        <input type="file" name='file' onChange={handleImg}/>
                                        <div className='btns-update'>
                                            <FontAwesomeIcon onClick={() => setEdit('')} icon={faXmark} className='btn-cancel' />
                                            <FontAwesomeIcon onClick={() => handleImageUpdate()} icon={faCheck} className='btn-update' />
                                        </div>
                                    </div>
                                    :
                                    <div className='div-prop-img'>
                                        <img className='img-update' src={producto.imageUrl} height={100} width={100} />
                                        <FontAwesomeIcon onClick={() => setEdit(`img${producto._id}`)} className='btn-edit' title='actualizar imagen' icon={faCaretLeft} />
                                    </div>
                            }
                        </div>
                        <div className='div-prop'>
                            <span className='span-prop'>Descripcion: </span>
                            {
                                edit === `description${producto._id}` ?
                                    <div className='div-input-update'>
                                        <input type="text" onChange={handleChange} name='description' />
                                        <div className='btns-update'>
                                            <FontAwesomeIcon onClick={() => setEdit('')} icon={faXmark} className='btn-cancel' />
                                            <FontAwesomeIcon onClick={() => handleUpdate()} icon={faCheck} className='btn-update' />
                                        </div>
                                    </div>
                                    :
                                    <div className='div-span-value'>
                                        <span >{producto.description}</span>
                                        <div>
                                            <FontAwesomeIcon onClick={() => setEdit(`description${producto._id}`)} className='btn-edit' title='actualizar descripción' icon={faCaretLeft} />
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className='div-prop'>
                            <span className='span-prop'>Precio: </span>
                            {
                                edit === `price${producto._id}` ?
                                    <div className='div-input-update'>
                                        <input type="number" onChange={handleChange} name='price' />
                                        <div className='btns-update'>
                                            <FontAwesomeIcon onClick={() => setEdit('')} icon={faXmark} className='btn-cancel' />
                                            <FontAwesomeIcon onClick={() => handleUpdate()} icon={faCheck} className='btn-update' />
                                        </div>
                                    </div>
                                    :
                                    <div className='div-span-value'>
                                        <span >{producto.price}</span>
                                        <div>
                                            <FontAwesomeIcon onClick={() => setEdit(`price${producto._id}`)} className='btn-edit' title='actualizar precio' icon={faCaretLeft} />
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className='div-prop'>
                            <span className='span-prop'>Stock: </span>
                            {
                                edit === `stock${producto._id}` ?
                                    <div className='div-input-update'>
                                        <input type="number" onChange={handleChange} name='stock' />
                                        <div className='btns-update'>
                                            <FontAwesomeIcon onClick={() => setEdit('')} icon={faXmark} className='btn-cancel' />
                                            <FontAwesomeIcon onClick={() => handleUpdate()} icon={faCheck} className='btn-update' />
                                        </div>
                                    </div>
                                    :
                                    <div className='div-span-value'>
                                        <span >{producto.stock}</span>
                                        <div>
                                            <FontAwesomeIcon onClick={() => setEdit(`stock${producto._id}`)} className='btn-edit' title='actualizar stock' icon={faCaretLeft} />
                                        </div>
                                    </div>
                            }
                        </div>

                        <div className='div-prop'>
                            <span className='span-prop'>Categoría: </span>
                            {
                                edit === `category${producto._id}` ?
                                    <div className='div-input-update'>
                                        <select name="category" onChange={handleChange}>
                                            <option value="velas">Velas</option>
                                            <option value="mantas">Mantas</option>
                                            <option value="flores">Flores</option>
                                            <option value="articulos">Artículos</option>
                                        </select>
                                        <div className='btns-update'>
                                            <FontAwesomeIcon onClick={() => setEdit('')} icon={faXmark} className='btn-cancel' />
                                            <FontAwesomeIcon onClick={() => handleUpdate()} icon={faCheck} className='btn-update' />
                                        </div>
                                    </div>
                                    :
                                    <div className='div-span-value'>
                                        <span >{producto.category}</span>
                                        <div>
                                            <FontAwesomeIcon onClick={() => setEdit(`category${producto._id}`)} className='btn-edit' title='actualizar categoría' icon={faCaretLeft} />
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className='div-prop'>
                            <span className='span-prop'>Subcategoría: </span>
                            {
                                edit === `subcategory${producto._id}` ?
                                    <div className='div-input-update'>
                                        <select name="subCategory" onChange={handleChange} >
                                            <option value="decorativas">Decorativas</option>
                                            <option value="eventos">Para eventos</option>
                                            <option value="aromaticas">Aromáticas</option>
                                            <option value="molde">De molde</option>
                                            <option value="sillones">Para sillones</option>
                                            <option value="mesa">Caminos de mesa</option>
                                            <option value="individual">Manteles individuales</option>
                                            <option value="secas">Secas</option>
                                            <option value="textiles">Textiles</option>
                                            <option value="hornillos">Fogoneros</option>
                                            <option value="fuentes">Fuentes para jardines</option>
                                            <option value="figuras">Figuras de india</option>
                                        </select>
                                        <div className='btns-update'>
                                            <FontAwesomeIcon onClick={() => setEdit('')} icon={faXmark} className='btn-cancel' />
                                            <FontAwesomeIcon onClick={() => handleUpdate()} icon={faCheck} className='btn-update' />
                                        </div>
                                    </div>
                                    :
                                    <div className='div-span-value'>
                                        <span >{producto.subCategory}</span>
                                        <div>
                                            <FontAwesomeIcon onClick={() => setEdit(`subcategory${producto._id}`)} className='btn-edit' title='actualizar subcategoría' icon={faCaretLeft} />
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                    <div className='div-btn-back'>
                        <button onClick={() => fnBack()} className='btn-back'>Volver</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default ProdEdit;