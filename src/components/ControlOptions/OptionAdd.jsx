import React, { useState } from 'react';
import {toast} from 'react-toastify';

import { useProd } from '../context/ProductContext';

import './ControlOptions.css';

function OptionAdd() {

    const [category, setCategory] = useState('');
    const [producto, setProducto] = useState({ title: '', description: '', price: '', file:null, category: '', subCategory: '' });
    const [error, setError] = useState(null);

    const {createProd} = useProd();

    const handleChange = ({ target: { value } }) => {
        setCategory(value);
        setProducto({ ...producto, 'category': value });
    }

    const handleChangeProd = ({ target: { name, value } }) => {
        setProducto({ ...producto, [name]: value });
    }

    const handleImg = (e)=>{
        setProducto({...producto, ['file']: e.target.files[0]})
    }

    const handleSubmit = async()=>{
        try {
            const resp = await createProd(producto);
            if(resp.status === 'succes'){
                toast.success(resp.message,{position:"top-right", autoClose:2000, hideProgressBar:true, closeOnClick:false, closeButton:false})
            }
            if(resp.status === 'error') setError(resp.error);
        } catch (error) {
            setError(error);
        }
    }

    return (
        <div className='divForm'>
            <h3>Crear producto</h3>
                <form encType="multipart/form-data">
            <div className='div-input-form'>
                    
                
                <label>Título</label>
                <input type="text" name='title' onChange={handleChangeProd} />
            </div>
            <div className='div-input-form'>
                <label>Descripcion</label>
                <input type="text" name='description' onChange={handleChangeProd} />
            </div>
            <div className='div-input-form'>
                <label>Precio</label>
                <input type="number" name='price' onChange={handleChangeProd} />
            </div>
            <div className='div-input-form'>
                <label>Imagen</label>
                <input type="file" name='file' onChange={handleImg} />
            </div>
            <div className='div-input-form'>
                <label>Stock</label>
                <input type="number" name='stock' onChange={handleChangeProd} />
            </div>
            <div className='div-input-form'>
                <label>Categoría</label>
                <select name="category" onChange={handleChange}>
                    <option value="velas">Velas</option>
                    <option value="mantas">Mantas</option>
                    <option value="flores">Flores</option>
                    <option value="articulos">Artículos</option>
                </select>
            </div>
            <div className='div-input-form'>
                <label>Subcategoría</label>
                {category === 'velas' ?
                    <select name="subCategory" onChange={handleChangeProd} >
                        <option value="decorativas">Decorativas</option>
                        <option value="eventos">Para eventos</option>
                        <option value="aromaticas">Aromáticas</option>
                        <option value="molde">De molde</option>
                    </select>
                    :
                    category === 'mantas' ?
                        <select name="subCategory" onChange={handleChangeProd}>
                            <option value="sillones">Para sillones</option>
                            <option value="mesa">Caminos de mesa</option>
                            <option value="individual">Manteles individuales</option>
                        </select>
                        :
                        category === 'flores' ?
                            <select name="subCategory" onChange={handleChangeProd}>
                                <option value="secas">Secas</option>
                                <option value="textiles">Textiles</option>
                            </select>
                            :
                            category === 'articulos' ?
                                <select name="subCategory" onChange={handleChangeProd}>
                                    <option value="hornillos">Fogoneros</option>
                                    <option value="fuentes">Fuentes para jardines</option>
                                    <option value="figuras">Figuras de india</option>
                                </select>
                                :
                                ''
                }
            </div>
                </form>
                <button className='btn-create' onClick={handleSubmit}>Crear producto</button>

                <p className='error'>{error && `${error}`}</p>
        </div>
    )
}

export default OptionAdd;