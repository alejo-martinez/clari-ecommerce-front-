import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

import PagoComponent from '../PagoComponent/PagoComponent';

import './Cart.css';

function Cart() {
  const { cid } = useParams();

  const { getProductsCart, addProduct, removeProd, emptyCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [cantProds, setCantProds] = useState(0);
  const [end, setEnd] = useState(false);

  const increase = async (pid, id) => {
    const resp = await addProduct(cid, pid, 1);
    if (resp.status === 'succes') {
      let newArray = [...products];
      let newTotal = total;
      let newTotalProds = cantProds;
      let prod = products.find(prod => prod._id === id);
      console.log(prod);
      prod.quantity += 1;
      newArray.map(producto => producto._id === id ? prod : producto);
      newTotal += prod.product.price;
      newTotalProds += 1;
      setTotal(newTotal);
      setCantProds(newTotalProds);
      setProducts(newArray);
    }
  }

  const decrease = async (pid, id) => {
    const resp = await removeProd(cid, pid, 1);
    if (resp.status === 'succes') {
      let newArray = [...products];
      let newTotal = total;
      let newTotalProds = cantProds;
      let prod = products.find(prod => prod._id === id);
      prod.quantity -= 1;
      newArray.map(producto => producto._id === id ? prod : producto);
      newTotal -= prod.product.price;
      newTotalProds -= 1;
      setTotal(newTotal);
      setCantProds(newTotalProds);
      setProducts(newArray);
    }
  }

  const endPurchase = () => {
    setEnd(true);
  }

  const vaciarCarrito = async () => {
    const resp = await emptyCart(cid);
    if (resp.status === 'succes') {
      setProducts([]);
      toast.success(resp.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const resp = await getProductsCart(cid);
      if (resp.status === 'succes') {
        const prods = resp.payload.products;
        let amount = 0;
        let totalProds = 0;
        if (prods.length !== 0) {
          for (let index = 0; index < prods.length; index++) {
            const element = prods[index];
            totalProds += element.quantity;
            amount += (element.quantity * element.product.price);
          }
        }
        setTotal(amount);
        setCantProds(totalProds);
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
          <div className='body-cart'>
            <div className='div-cart'>
              {products.map((prod, index) => {
                return (
                  <div key={prod.product._id} className='div-prod-cart'>
                    <img src={prod.product.imageUrl} alt="" width={65} height={65} />
                    <span className='prod-title'>{prod.product.title}</span>
                    <div className='div-quantity'>
                      <span>Cantidad: </span>
                      <div className='input-quantity'>
                        {prod.quantity === 1 ?
                          ''
                          :
                          <button className='btn-minus' onClick={() => decrease(prod.product._id, prod._id)}>
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                        }
                        <span>{prod.quantity}</span>
                        {
                          prod.quantity === prod.product.stock ?
                            ''
                            :
                            <button onClick={() => increase(prod.product._id, prod._id)} className='btn-plus' >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                        }
                      </div>
                    </div>
                    <span>Precio unitario: ${prod.product.price}</span>
                    <span>Precio total: ${prod.product.price * prod.quantity}</span>
                  </div>
                )
              })}
            </div>
            <div className='div-resume'>
              <h4>Resumen de compra</h4>
              <div className='div-total'>
                <span>Productos: {cantProds}</span>
                <span className='span-total'>Total: ${total}</span>
              </div>
              {end ? <PagoComponent /> : <button className='btn-endpurchase' onClick={endPurchase}>Finalizar compra</button>}
            </div>
          </div>
          :
          <p className='no-prods'>Todavia no agregaste ningún producto</p>

      }
      {products.length !== 0 && <div className='div-emptyCart'>
        <button className='btn-emptyCart' onClick={vaciarCarrito}>Vaciar carrito</button>
      </div>}

    </div>
  )
}

export default Cart