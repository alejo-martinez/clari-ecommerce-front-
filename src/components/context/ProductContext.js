import { useState, useContext, useEffect, createContext } from "react";

const productContext = createContext();

const apiUrl = process.env.REACT_APP_API_URL;

const useProd = () => {
    const context = useContext(productContext);
    if (!context) throw new Error('No prod provider');
    return context;
}

const ProdProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const getAllProds = async () => {
        const response = await fetch(`${apiUrl}/product`, {
            method: 'GET',
            credentials: 'include'
        });
        const json = await response.json();
        // setProducts(json.payload);
        return json;
    }

    const getById = async(pid)=>{
        const response = await fetch(`${apiUrl}/product/${pid}`,{
            method:'GET',
            credentials:'include'
        })
        const json = await response.json();
        return json;
    }

    const createProd = async (prod) => {
        const formData = new FormData();

        const fields = ['title', 'description', 'price', 'file', 'stock', 'category', 'subCategory'];

        fields.forEach((field) => {
            formData.append(field, prod[field]);
        });

        const response = await fetch(`${apiUrl}/product/`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const json = await response.json();
        return json;
    };

    const getBySubCategory = async (subcategory) => {
        const response = await fetch(`${apiUrl}/product/subcategory/${subcategory}`, {
            method: 'GET',
            credentials: 'include'
        });
        const json = await response.json();
        return json;
    }

    const updateProd = async(id, valueProd)=>{
        const response = await fetch(`${apiUrl}/product/${id}`,{
            method:'PUT',
            credentials:'include',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({field: valueProd.field, value: valueProd.value})
        });
        const json = await response.json();
        return json;
    }

    const deleteProduct = async(id)=>{
        const response = await fetch(`${apiUrl}/product/${id}`,{
            method:'DELETE',
            credentials:'include'
        });
        const json = await response.json();
        return json;
    }

    useEffect(() => {
      const fetchData = async()=>{
        try {
            const resp = await getAllProds();
            if(resp.status === 'succes') {
                setProducts(resp.payload);
                setLoading(false)
            }
            if(resp.status === 'error'){
                console.log(resp.error);
            }
        } catch (error) {
            console.log(error);
        }
      }
      if(loading || products.length === 0) fetchData();
      
    
    }, [loading])
    
    return (
        <productContext.Provider value={{ getAllProds, createProd, getBySubCategory, deleteProduct, products, setProducts, getById, updateProd }}>
            {children}
        </productContext.Provider>
    )
}

export { productContext, useProd, ProdProvider };