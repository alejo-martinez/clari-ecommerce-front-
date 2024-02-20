import React, { useEffect, useState } from "react";
import './ControlOptions.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useCart } from "../context/CartContext";

const OptionTickets = () => {

    const { getAllTickets } = useCart();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term.trim() === '') {
            setSearchTerm('');
            setSearchResults([]);
            return;
        }
        const filteredResults = tickets.filter((ticket) =>
            ticket._id.toLowerCase().includes(term)
        );

        setSearchResults(filteredResults);
        setShowResults(true);
    };


    const handleClean = () => {
        setSearchResults([]);
    }


    useEffect(() => {
        const fetchData = async () => {
            const resp = await getAllTickets();
            if (resp.status === 'succes') {
                setTickets(resp.payload);
                setLoading(false);
            }
            if (resp.status === 'error') {
                setError(error);
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    return (
        <>
            {loading ? <p>Cargando...</p>
                :
                tickets.length === 0 ? <p>No existen órdenes disponibles.</p>
                    :
                    <div className="all-tickets">
                        <h3 className="title-tickets">Órdenes de compra</h3>
                        <div className='search-bar-container'>
                            <div className="body-searchbar">
                                <div className='div-search'>
                                    <input type="text" placeholder="Buscar productos..." value={searchTerm} onChange={handleSearch} />
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </div>
                                {showResults && (
                                    <div className='div-results'>
                                        <ul className={searchResults.length === 0 ? '' : 'ul-results'}>
                                            {searchResults.map((ticket, index) => (
                                                <li key={ticket._id} onClick={handleClean}>
                                                    <Link to={`/ticketdetail/${ticket._id}`} className='prod-result'>{ticket._id}</Link>
                                                </li>

                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

export default OptionTickets;