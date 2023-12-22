import React, { useState, useEffect } from 'react';

import { useProd } from '../context/ProductContext';

import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import './SearchBar.css';

function SearchBar() {
    const { getAll } = useProd();

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term.trim() === '') {
            setSearchTerm('');
            setSearchResults([]);
            return;
        }
        const filteredResults = products.filter((product) =>
            product.title.toLowerCase().includes(term)
        );

        setSearchResults(filteredResults);
        setShowResults(true);
    };

    const handleBlur = () => {
        setShowResults(false);
    }

    const handleClean = () => {
        setSearchResults([]);
    }


    useEffect(() => {
        const fetchData = async () => {
            const response = await getAll();
            if (response.status === 'succes') {
                setProducts(response.payload);
                setLoading(false);
            }
            if (response.status === 'error') {
                setLoading(false);
            }
        }

        fetchData();
    }, [])




    return (
        <>
            {loading ? 'Cargando...'
                :
                <div className='search-bar-container'>
                    <div>

                        <div className='div-search'>
                            <input type="text" placeholder="Buscar productos..." value={searchTerm} onChange={handleSearch} />
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        {showResults && (
                            <div className='div-results'>
                                <ul className={searchResults.length === 0 ? '' : 'ul-results'}>
                                    {searchResults.map((prod, index) => (
                                        <li key={prod._id} onClick={handleClean}>
                                            <Link to={`/itemdetail/${prod._id}`} className='prod-result'>{prod.title}</Link>
                                        </li>

                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    )
}

export default SearchBar;