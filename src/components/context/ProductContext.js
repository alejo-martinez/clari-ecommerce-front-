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
    const [next, setNext] = useState(false);
    const [back, setBack] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    const getAll = async()=>{
        const response = await fetch(`${apiUrl}/product/`, {
            method:'GET',
            credentials:'include'
        });
        const json = await response.json();
        return json;
    }

    const getAllProds = async (page) => {
        const response = await fetch(`${apiUrl}/product/prods?page=${page}`, {
            method: 'GET',
            credentials: 'include'
        });
        const json = await response.json();
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

    
    formData.append('title', prod.title);
    formData.append('description', prod.description);
    formData.append('category', prod.category);

    
    for (let i = 0; i < prod.files.length; i++) {
        formData.append('files', prod.files[i]);
    }

   
    prod.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][color]`, variant.color);
        variant.sizes.forEach((size, sizeIndex) => {
            formData.append(`variants[${index}][sizes][${sizeIndex}][size]`, size.size);
            formData.append(`variants[${index}][sizes][${sizeIndex}][stock]`, size.stock);
            formData.append(`variants[${index}][sizes][${sizeIndex}][price]`, size.price);
        });
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

    const updateImage = async(id, file)=>{
        const formData = new FormData();
        formData.append('file', file)
        
        const response = await fetch(`${apiUrl}/product/image/${id}`,{
            method:'PUT',
            credentials:'include',
            body:formData
        });
        const json = await response.json();
        return json;
    }

    const deleteProduct = async(id)=>{
        const response = await fetch(`${apiUrl}/product/${id}`,{
            method:'DELETE',
            credentials:'include',
        });
        const json = await response.json();
        return json;
    }

    // const handleNextPage = () => {
    //     setLoading(true);
    //     const newPage = Number(currentPage) + 1;
    //     setCurrentPage(newPage);
    //   }
    
    //   const handleBackPage = () => {
    //     setLoading(true);
    //     const newPage = Number(currentPage) - 1;
    //     setCurrentPage(newPage)
    //   }

    const colorCodes = {azul: '#0000ff', rojo: '#ff0000'};

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
          const response = await getAllProds(currentPage);
    
          if (response.status === 'succes') {
            setProducts(response.payload.docs);

            if (response.payload.hasNextPage) setNext(true);
            if (!response.payload.hasNextPage) setNext(false);
            if (response.payload.hasPrevPage) setBack(true);
            if (!response.payload.hasPrevPage) setBack(false);
    
            setCurrentPage(Number(response.payload.page));
            setLoading(false);
        }
    }
    
    fetchData();
      }, [currentPage])
    
    return (
        <productContext.Provider value={{ getAllProds, createProd, getBySubCategory, deleteProduct, products, setProducts, getById, updateProd, getAll, updateImage, setBack, setCurrentPage, setNext, currentPage, back, next, colorCodes }}>
            {loading? <p>Cargando...</p> : children}
        </productContext.Provider>
    )
}

export { productContext, useProd, ProdProvider };