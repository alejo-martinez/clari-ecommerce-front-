import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

import { useProd } from '../context/ProductContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

import './ControlOptions.css';

function OptionAdd() {
    const MySwal = withReactContent(Swal)

    const [producto, setProducto] = useState({ title: '', description: '', files: [], variants: [], category: '' });
    const [error, setError] = useState(null);
    const [sizeAdd, setSizeAdd] = useState({ size: '', stock: '', price: '' })

    const { createProd } = useProd();

    const fileRef = useRef(null);

    const resetFile = () => {
        if (fileRef.current) fileRef.current.value = '';
    }

    const showAlert = (i) => {
        MySwal.fire({
            title: 'Agregar talle',
            html: `<div class="div-sizes-add">
            <div class="div-size-value">
            <label>Talle</label>
            <input id="swal-input1" type="text" name="size" placeholder="Talle" />
          </div>
          <div class="div-size-value">
            <label>Stock</label>
            <input id="swal-input2" type="number" name="stock" placeholder="Stock" />
          </div>
          <div class="div-size-value">
            <label>Precio</label>
            <input id="swal-input3" type="number" name="price" placeholder="Precio" />
          </div>
          </div>`,
            focusConfirm: false,
            preConfirm: () => {
                const size = document.getElementById('swal-input1').value;
                const stock = document.getElementById('swal-input2').value;
                const price = document.getElementById('swal-input3').value;

                if (!size || !stock || !price) {
                    Swal.showValidationMessage(`Por favor ingrese todos los datos`);
                    return false;
                }

                return { size, stock, price };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { size, stock, price } = result.value;
                const obj = {...producto};
                obj.variants[i].sizes.push({size: size.toUpperCase(), stock: stock, price: price});
                setProducto(obj);
            }
        });
    };


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
        // const prod = { ...producto };
        // prod.variants[index].sizes.push({ size: '', stock: '', price: '' });
        // setProducto(prod);
        showAlert(index)
    }


    const addVariant = () => {
        const prod = { ...producto }
        prod.variants.push({ color: "", sizes: [] })
        setProducto(prod);
    }

    const deleteVariant = (i) => {
        const prod = { ...producto };
        prod.variants.splice(i, 1);
        setProducto(prod);
    }

    const deleteSize = (i, index) => {
        const prod = { ...producto };
        prod.variants[index].sizes.splice(i, 1);
        setProducto(prod)
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
                </form>
                <div className='div-input-form-variant'>
                    <button type='button' onClick={addVariant} className='btn-add-variant'>Agregar variante</button>
                    {producto.variants.map((el, index) => {
                        return (
                            <div key={`el${index}`} className='div-input-color'>
                                <button className='btn-delete-variant' onClick={() => deleteVariant(index)}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                                <div className='container-color'>
                                    <div className='div-form-color'>
                                        <label>Color</label>
                                        <input type="text" name='color' value={el.color} onChange={(e) => handleVariant(e, index)} />
                                    </div>
                                    <button type='button' onClick={() => addSize(index)} className='btn-add-size'>+ talle</button>
                                </div>
                                {el.sizes.length > 0 && <h5>Talles agregados:</h5>}
                                {el.sizes.map((size, i) => {
                                    return (
                                        <div key={`sizeNro${i}`} className='div-input-size'>
                                            <span>Talle: {size.size}</span>
                                            <span>Stock: {size.stock}</span>
                                            <span>Precio: ${size.price}</span>
                                            <button className='btn-delete-variant' onClick={() => deleteSize(i, index)}>
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            {/* <div className='div-size-value'>
                                            <label>Talle</label>
                                            <input type="text" name='size' value={size.size} onChange={(e) => handleSize(e, i, index)} />
                                        </div>
                                        <div className='div-size-value'>
                                            <label>Stock</label>
                                            <input type="number" name='stock' onChange={(e) => handleSize(e, i, index)} />
                                        </div>
                                        <div className='div-size-value'>
                                            <label>Precio</label>
                                            <input type="number" name='price' onChange={(e) => handleSize(e, i, index)} />
                                        </div> */}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <button className='btn-create' onClick={handleSubmit}>Crear producto</button>

                <p className='error'>{error && `${error}`}</p>
            </div>
        </div>
    )
}

export default OptionAdd;