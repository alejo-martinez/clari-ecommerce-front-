import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useCart } from '../context/CartContext';

import './Cart.css';

function Cart() {
  const { cid } = useParams();

  const { getProductsCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await getProductsCart(cid);
      if (resp.status === 'succes') {
        setProducts(resp.payload.products);
        setLoading(false);
      }
      if (resp.status === 'error') {
        console.log(resp.error);
      }
    }

    fetchData();
  }, [])


  return (
    <div>
      {loading ?
        <p>Cargando...</p>
        :
        products.length !== 0 ?
          products.map((prod, index) => {
            return (
              <div key={prod.product._id} className='div-prod-cart'>
                <span>{prod.product.title}</span>
                <img src={prod.product.imageUrl} alt="" width={150} height={150} />
                <span>Cantidad: {prod.quantity}</span>
                <span>Precio unitario: {prod.product.price}</span>
                <span>Precio total: {prod.product.price * prod.quantity}</span>
              </div>
            )
          })
          :
          <p>Todavia no agregaste ningún producto</p>

      }
    </div>
  )
}

export default Cart