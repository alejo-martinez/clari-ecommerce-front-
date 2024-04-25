import React from 'react';

import { useProd } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


import './Home.css';


function Home() {

  const { setCurrentPage, currentPage, back, next, products } = useProd();


  const handleNextPage = () => {
    const newPage = Number(currentPage) + 1;
    setCurrentPage(newPage);
  }

  const handleBackPage = () => {
    const newPage = Number(currentPage) - 1;
    setCurrentPage(newPage)
  }




  return (
    <>
      <div>
        <div className='div-pages'>
          {back && <FontAwesomeIcon icon={faChevronLeft} onClick={handleBackPage} className='btn-back-page btn-page' />}
          <span>{currentPage}</span>
          {next && <FontAwesomeIcon icon={faChevronRight} onClick={handleNextPage} className='btn-next-page btn-page' />}
        </div>

        <div className='div-prods-general'>

          {products.map((prod, index) => {
            if (prod.totalStock <= 0) return;
            else {
              return (
                <Link className='link-item-detail' to={`/itemdetail/${prod._id}`} key={`link${prod._id}`}>
                  <div key={prod._id} className='div-prod'>
                    <div className='div-img-home'>
                          <img src={prod.imagesUrl[0]} alt="prod" height={150} width={200} />
                        </div>
                    <div className='div-title-prod'>
                      <h2>{prod.title}</h2>
                    </div>
                    <p>{prod.description}</p>
                    <span>Stock: {prod.totalStock}</span>
                    <span>Precio: ${prod.variants[0].sizes[0].price}</span>
                  </div>
                </Link>
              )
            }
          })}
        </div>
      </div>

    </>
  )
}

export default Home;