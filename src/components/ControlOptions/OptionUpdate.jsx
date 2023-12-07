import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useProd } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProdEdit from '../ProdEdit/ProdEdit';

function OptionUpdate() {
    const { products, setProducts } = useProd();

    const [editProd, setEditProd] = useState(false);
    const [pid, setPid] = useState('');

    const handleState = (id)=>{
        if(editProd){
            setEditProd(false);
            setPid('');
        }else{
            setPid(id);
            setEditProd(true);
        }
    }

    return (
        <div>
            {editProd ?
                <ProdEdit pid={pid} fnBack={handleState}/>
                :
                <div>
                    <h3 className='title-update-option'>Actualizar productos</h3>
                    <div className='div-prods-update'>
                        {products.map((prod, index) => {
                            return (
                                <div key={prod._id} className='div-prod-update'>
                                    <div className='div-prod-prop'>
                                        <span className='span-prop'>{prod.title}</span>
                                    </div>

                                    <div className=''>
                                        <img className='img-update' src={prod.imageUrl} height={150} width={150} />
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