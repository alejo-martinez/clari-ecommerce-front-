import React,{useState, useEffect} from 'react';
import { useProd } from '../context/ProductContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';

function OptionDelete() {
    const {deleteProduct, getAll} = useProd();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    

    const handleRemove = async(id)=>{
        try {
            const resp = await deleteProduct(id);
            if(resp.status === 'succes'){
                toast.success(resp.message,{position:"top-right", autoClose:2000, hideProgressBar:true, closeOnClick:false, closeButton:false})
                setProducts((prevProds)=> prevProds.filter((prod) => prod._id !== id));
            }
            if(resp.status === 'error'){
                toast.error(resp.error, {position: "top-center", autoClose: 5000, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: true});
            }
        } catch (error) {
            setError(error);
        }
    }

    useEffect(()=>{
        const fetchData = async()=>{
            const resp = await getAll();
            if(resp.status === 'succes'){
                setProducts(resp.payload);
                setLoading(false);
            }
        }

        fetchData()
    }, [])

  return (
    <div>
        {loading?
        <p>Cargando...</p>
        :
            <div>

        <h3 className='title-delete'>Borrar productos</h3>
        <div>
            <table className='table-delete'>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Imagen</th>
                    </tr>
                </thead>
                <tbody>

            {products.map((prod, index)=>{
                return(
                <tr key={prod._id}>
                    <td>{prod._id}</td>
                    <td>{prod.title}</td>
                    <td><img src={prod.imagesUrl[0]} alt="" width={75} height={75}/></td>
                    <td><button className='btn-delete' onClick={()=> handleRemove(prod._id)}><FontAwesomeIcon icon={faTrashCan} /></button></td>
                </tr>
                    )
                })}
                </tbody>
                </table>
        </div>
                </div>
}
    </div>
  )
}

export default OptionDelete;