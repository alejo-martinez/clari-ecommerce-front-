import React, { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useProd } from '../context/ProductContext';
import { Link } from 'react-router-dom';

import './Home.css';

function Home() {

  const { getAllProds } = useProd();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllProds();
      if (response.status === 'succes') {
        setLoading(false);
        setProducts(response.payload);
      }
      if (response.status === 'error') {
        setLoading(false);
        setError(response.error);
      }
    }
    if (products.length === 0) fetchData();
  }, [])


  return (
    <>
      {loading ? <div>Cargando...</div>
        :
        products.length === 0 ?
          <div>
            <p className='no-prods'>No hay productos disponibles</p>
          </div>
          :
          <div className='div-prods-general'>

            {products.map((prod, index) => {
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
    </>
  )
}

export default Home