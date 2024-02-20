import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePen, faTrashCan, faArrowLeft, faBan } from '@fortawesome/free-solid-svg-icons';

import OptionAdd from '../ControlOptions/OptionAdd';
import OptionDelete from '../ControlOptions/OptionDelete';
import OptionUpdate from '../ControlOptions/OptionUpdate';

import './ControlPanel.css';
import OptionTickets from '../ControlOptions/OptionTickets';

function ControlPanel() {
    const [option, setOption] = useState(null);

    const handleOption = (value) => {
        if (value === 'create') setOption('create');
        if (value === 'update') setOption('update');
        if (value === 'delete') setOption('delete');
        if (value === 'ventas') setOption('ventas');
        if (value === null) setOption(null);
    }

    return (
        <>
            <div>
                {option === null ?
                    <div className='div-controlPanel'>
                        <h2>Panel de control</h2>
                        <div className='div-options'>
                            <button onClick={() => handleOption('create')} className='btn-option'>Crear productos</button>
                            <button onClick={() => handleOption('update')} className='btn-option'>Actualizar productos</button>
                            <button onClick={() => handleOption('delete')} className='btn-option'>Borrar productos</button>
                            <button onClick={() => handleOption('ventas')} className='btn-option'>Ver órdenes</button>
                            
                        </div>
                    </div>
                    :
                    <div className='div-controlPanelOption'>
                        <div>
                            <FontAwesomeIcon icon={faArrowLeft} size='2x' onClick={() => handleOption(null)} className='iconBack' />
                        </div>
                        <div className='div-title'>
                            <h2>Panel de control</h2>
                        </div>
                    </div>
                }

            </div>

            <div>
                {option === 'create' ? <OptionAdd /> : option === 'update' ? <OptionUpdate /> : option === 'delete' ? <OptionDelete /> : option === 'ventas'?  <OptionTickets/> : ''}
            </div>
        </>
    )
}

export default ControlPanel