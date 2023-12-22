import React, { useEffect, useState } from 'react';

import { useProd } from '../context/ProductContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './Home.css';

function Home() {

  const { getAllProds, getAll } = useProd();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState(false);
  const [back, setBack] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [pages, setPages] = useState(0);

  const handleNextPage = () => {
    setLoading(true);
    const newPage = Number(currentPage) + 1;
    setCurrentPage(newPage);
  }

  const handleBackPage = () => {
    setLoading(true);
    const newPage = Number(currentPage) - 1;
    setCurrentPage(newPage)
  }

  useEffect(() => {
    const fetchData = async () => {

        const response = await getAllProds(currentPage);
        if (response.status === 'succes') {
          setProducts(response.payload);
          // setPages(response.totalPages);
        if (response.hasNextPage) setNext(true);
        if (!response.hasNextPage) setNext(false);
        if (response.hasPrevPage) setBack(true);
        if (!response.hasPrevPage) setBack(false);
        setCurrentPage(Number(response.page));
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage])


  return (
    <>
      {loading ? <div>Cargando...</div>
        :
        products.length === 0 ?
          <div>
            <p className='no-prods'>No hay productos disponibles</p>
          </div>
          :
          <div>

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
            <div className='div-pages'>
              {back && <FontAwesomeIcon icon={faArrowLeft} onClick={handleBackPage} className='btn-back-page'/>}
              <span>{currentPage}</span>
              {next && <FontAwesomeIcon icon={faArrowRight} onClick={handleNextPage} className='btn-next-page'/>}
            </div>
          </div>
      }
    </>
  )
}

export default Home