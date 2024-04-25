import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePen, faTrashCan, faArrowLeft, faBan } from '@fortawesome/free-solid-svg-icons';
import { useLocation, Link } from 'react-router-dom';

import OptionAdd from '../ControlOptions/OptionAdd';
import OptionDelete from '../ControlOptions/OptionDelete';
import OptionUpdate from '../ControlOptions/OptionUpdate';

import './ControlPanel.css';
import OptionTickets from '../ControlOptions/OptionTickets';

function ControlPanel() {
    const location = useLocation();

    const [option, setOption] = useState(null);

    useEffect(() =>{
        const queryParams = new URLSearchParams(location.search);
        const optionParam = queryParams.get('option');
        if(optionParam) setOption(optionParam);
        else setOption('main');
    }, [location.search]);



    return (
        <>
            <div>
                {(!option || option === 'main') ?
                    <div className='div-controlPanel'>
                        <h2>Panel de control</h2>
                        <div className='div-options'>
                            <Link to={'/controlpanel?option=create'} className='btn-option'>Crear productos</Link>
                            <Link to={'/controlpanel?option=update'} className='btn-option'>Actualizar productos</Link>
                            <Link to={'/controlpanel?option=delete'} className='btn-option'>Eliminar productos</Link>
                            <Link to={'/controlpanel?option=ventas'} className='btn-option'>Ver ventas</Link>
                            
                        </div>
                    </div>
                    :
                    <div className='div-controlPanelOption'>
                        <div>
                            <Link to={'/controlpanel?option=main'}>
                            <FontAwesomeIcon icon={faArrowLeft} size='2x' className='iconBack' />
                            </Link>
                        </div>
                        <div className='div-title'>
                            <h2>Panel de control</h2>
                        </div>
                    </div>
                }

            </div>

            <div>
                {option === 'create' && <OptionAdd />} {option === 'update' && <OptionUpdate />}  {option === 'delete' && <OptionDelete /> } {option === 'ventas'&&  <OptionTickets/>}
            </div>
        </>
    )
}

export default ControlPanel