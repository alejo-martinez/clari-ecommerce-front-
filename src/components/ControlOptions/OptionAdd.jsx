import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

import { useProd } from '../context/ProductContext';

import './ControlOptions.css';

function OptionAdd() {


    const [producto, setProducto] = useState({ title: '', description: '', files: [], variants: [], category: '' });
    const [error, setError] = useState(null);


    const { createProd } = useProd();

    const fileRef = useRef(null);

    const resetFile = () => {
        if (fileRef.current) fileRef.current.value = '';
    }

    const handleChange = ({ target: { value } }) => {
        setProducto({ ...producto, 'category': value });
    }

    const handleChangeProd = ({ target: { name, value } }) => {
        setProducto({ ...producto, [name]: value });
    }

    const handleImg = (e) => {
        const filesArray = Array.from(e.target.files); 
        setProducto({ ...producto, files: filesArray });
    }

    const handleSubmit = async () => {
        try {
            const resp = await createProd(producto);
            if (resp.status === 'succes') {
                toast.success(resp.message, { position: "top-right", autoClose: 2000, hideProgressBar: true, closeOnClick: false, closeButton: false });
                setProducto({ title: '', description: '', files: [], variants: [], category: '' });
                resetFile();
            }
            if (resp.status === 'error') setError(resp.error);
        } catch (error) {
            setError(error);
        }
    }

    const handleVariant = (e, i) => {
        const { name, value } = e.target;
        const variants = [...producto.variants];
        variants[i][name] = value;
        setProducto({ ...producto, variants: JSON.parse(JSON.stringify(variants)) }); 
    }
    
    const handleSize = (e, i, index) => {
        const { name, value } = e.target;
        const variants = [...producto.variants];
        const sizes = [...variants[index].sizes];
        sizes[i][name] = value;
        variants[index].sizes = sizes;
        setProducto({ ...producto, variants: JSON.parse(JSON.stringify(variants)) }); 
    }

    const addSize = (index) => {
        const prod = { ...producto };
        prod.variants[index].sizes.push({ size: '', stock: '', price: '' });
        setProducto(prod);
    }


    const addVariant = () => {
        const prod = { ...producto }
        prod.variants.push({ color: "", sizes: [] })
        setProducto(prod);
    }
   

    return (
        <div className='body-add'>
            <h3>Crear producto</h3>
            <div className="divForm">
                <form encType="multipart/form-data">
                    <div className='div-input-form'>

                        <label>Título</label>
                        <input type="text" name='title' value={producto.title} onChange={handleChangeProd} />
                    </div>
                    <div className='div-input-form'>
                        <label>Descripcion</label>
                        <input type="text" name='description' value={producto.description} onChange={handleChangeProd} />
                    </div>
                    <div className='div-input-form'>
                        <label>Imágenes</label>
                        <input type="file" name='files' ref={fileRef} onChange={handleImg} multiple />
                    </div>
                    <div className='div-input-form'>
                        <label>Categoría</label>
                        <select name="category" onChange={handleChange} value={producto.category}>
                            <option value="velas">Velas</option>
                            <option value="mantas">Mantas</option>
                            <option value="flores">Flores</option>
                            <option value="articulos">Artículos</option>
                        </select>
                    </div>
                    <div className='div-input-form'>
                        <button type='button' onClick={addVariant}>Agregar talle</button>
                        {producto.variants.map((el, index) => {
                            return (
                                <div key={`el${index}`}>
                                    <label>Color</label>
                                    <input type="text" name='color' onChange={(e) => handleVariant(e, index)} />
                                    <button type='button' onClick={() => addSize(index)}>+ talle</button>
                                    {el.sizes.map((size, i) => {
                                        return (
                                            <div key={`sizeNro${i}`}>
                                                <div>
                                                    <label>Talle</label>
                                                    <input type="text" name='size' onChange={(e) => handleSize(e, i, index)} />
                                                </div>
                                                <div>
                                                    <label>Stock</label>
                                                    <input type="number" name='stock' onChange={(e) => handleSize(e, i, index)} />
                                                </div>
                                                <div>
                                                    <label>Precio</label>
                                                    <input type="number" name='price' onChange={(e) => handleSize(e, i, index)} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </form>
                <button className='btn-create' onClick={handleSubmit}>Crear producto</button>

                <p className='error'>{error && `${error}`}</p>
            </div>
        </div>
    )
}

export default OptionAdd;