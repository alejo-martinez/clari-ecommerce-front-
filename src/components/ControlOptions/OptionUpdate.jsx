import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useProd } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProdEdit from '../ProdEdit/ProdEdit';

function OptionUpdate() {
    const {  setProducts, getAll } = useProd();

    const [editProd, setEditProd] = useState(false);
    const [pid, setPid] = useState('');
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleState = (id)=>{
        if(editProd){
            setEditProd(false);
            setPid('');
        }else{
            setPid(id);
            setEditProd(true);
        }
    }

    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const resp = await getAll();
                if(resp.status === 'succes'){
                    setProductos(resp.payload);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            {loading?
            <p>Cargando...</p>
            : 
            editProd ?
                <ProdEdit pid={pid} fnBack={handleState}/>
                :
                <div>
                    <h3 className='title-update-option'>Actualizar productos</h3>
                    <div className='div-prods-update'>
                        {productos.map((prod, index) => {
                            return (
                                <div key={prod._id} className='div-prod-update'>
                                    <div className='div-prod-prop'>
                                        <span className='span-prop'>{prod.title}</span>
                                    </div>

                                    <div className=''>
                                        <img className='img-update' src={prod.imagesUrl[0]} height={150} width={150} />
                                    </div>

                                    <div className='div-prod-prop'>
                                        <button onClick={()=> handleState(prod._id)} className='btn-edit-prod'>Editar producto</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            }

        </div>
    )
}

export default OptionUpdate;