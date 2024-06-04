import React, {useState, useEffect} from 'react';
import { useGetnet } from '../context/GetnetContext';

function GetnetComponent({items, idCart}) {

    const {getToken, generatePayment} = useGetnet();

    const [loading, setLoading] = useState(true);
    const [jwtToken, setJwtToken] = useState('');
    const [order, setOrder] = useState(null);
    const [itemsCart, setItemsCart] = useState([]);

    const fetchToken = async()=>{
      const data = await getToken();
      if(data.status === 'success'){
        setJwtToken(data.payload.access_token);
        setLoading(false);
      }
    }

    const initPayment = async()=>{
      await generatePayment(jwtToken, itemsCart, idCart);
    }

    const parseItems = (prods) =>{
      const parsedItems = prods.map((prod, index)=>{
        return{
          'id': `${prod.product._id}`,
          'name': `${prod.product.title}`,
          'unitPrice':{ 'currency': '032', 'amount': Number(prod.unitPrice)},
          'quantity': Number(prod.quantity)
        }
      })
      setItemsCart(parsedItems);
    }

    useEffect(() => {
      parseItems(items);
      fetchToken();
    }, [])
    


  return (
    <>
        {loading? <p>Cargando...</p> : <button onClick={initPayment}>Realizar pago</button>}
    </>
  )
}

export default GetnetComponent;