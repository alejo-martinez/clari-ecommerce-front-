import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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
                            <Link className='link-item-detail' to={`/itemdetail/${prod._id}`} key={`link${prod._id}`}>
                            <div key={prod._id} className='div-prod'>
                              <img src={prod.imageUrl} alt="prod" height={150} width={200} />
                              <div className='div-title-prod'>
                                <h2>{prod.title}</h2>
                              </div>
                              <p>{prod.description}</p>
                              <span>Stock: {prod.stock}</span>
                              <span>Precio: ${prod.price}</span>
                            </div>
                          </Link>
                        )
                    })}
                </div>
            }

        </div>
    )
}

export default ProductCategory;