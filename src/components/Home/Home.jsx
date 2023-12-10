import React, { useEffect, useState } from 'react';

import { useProd } from '../context/ProductContext';
import { Link, useParams } from 'react-router-dom';

import './Home.css';

function Home() {

  const { getAllProds, getAll } = useProd();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState(false);
  const [back, setBack] = useState(false);
  const [totalPages, setTotalPages] = useState(0); 

  const { page } = useParams();

  const renderPages = ()=>{
    for (let index = 1; index = totalPages; index++) {
      return(
        <Link key={`link${index}`}>{index}</Link>
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (page) {
        const response = await getAllProds(page);
        if(response.status === 'succes'){
          setLoading(response.payload);
          if(response.hasNextPage) setNext(true);
          if(response.hasPreviusPage) setBack(true);
          setTotalPages(response.totalPages);
        }
      }
      else {

        const response = await getAll();
        console.log(response);
        if (response.status === 'succes') {
          setLoading(false);
          setProducts(response.payload);
        }
        if (response.status === 'error') {
          setLoading(false);
          setError(response.error);
        }
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
            <div>
              Paginas: 
              {renderPages()}
            </div>
          </div>

      }
    </>
  )
}

export default Home