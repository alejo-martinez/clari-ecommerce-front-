import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useProd } from '../context/ProductContext';

function ProductCategory() {
    const [prods, setProds] = useState([]);
    const [error, setError] = useState(null);

    const { subcategory } = useParams();
    const { getBySubCategory } = useProd();

    // console.log(prods);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await getBySubCategory(subcategory);
                if (resp.status === 'succes') {
                    setError(null);
                    setProds(resp.payload);
                }
                if (resp.status === 'error') {
                    setError(resp.error);
                    setProds([]);
                    console.log(resp.error);
                }
            } catch (error) {
                setError(error);
            }
        }

        fetchData();
    }, [subcategory])


    return (
        <div>
            {prods.length === 0 ?
                <div>
                    <p className='no-prods'>No hay productos disponibles</p>
                </div>
                :
                <div className='div-prods-general'>
                    {prods.map((prod, index) => {
                        return (
                            <div key={prod._id} className='div-prod'>
                                <h2>{prod.title}</h2>
                                <p>{prod.description}</p>
                                <span>Stock: {prod.stock}</span>
                                <span>Precio: ${prod.price}</span>
                            </div>
                        )
                    })}
                </div>
            }

        </div>
    )
}

export default ProductCategory;