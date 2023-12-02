import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePen, faTrashCan, faArrowLeft, faBan } from '@fortawesome/free-solid-svg-icons';

import OptionAdd from '../ControlOptions/OptionAdd';
import OptionDelete from '../ControlOptions/OptionDelete';
import OptionUpdate from '../ControlOptions/OptionUpdate';

import './ControlPanel.css';

function ControlPanel() {
    const [option, setOption] = useState(null);

    const handleOption = (value) => {
        if (value === 'create') setOption('create');
        if (value === 'update') setOption('update');
        if (value === 'delete') setOption('delete');
        if (value === null) setOption(null);
    }

    return (
        <>
            <div>
                {option === null ?
                    <div className='div-controlPanel'>
                        <h2>Panel de control</h2>
                        <div className='div-options'>
                            <FontAwesomeIcon title='Crear producto' icon={faPlus} size='2x' onClick={() => handleOption('create')} className='btn-option' />
                            <FontAwesomeIcon title='Actualizar producto' icon={faFilePen} size='2x' onClick={() => handleOption('update')} className='btn-option' />
                            <FontAwesomeIcon title='Borrar producto' icon={faBan} size='2x' onClick={() => handleOption('delete')} className='btn-option' />
                        </div>
                    </div>
                    :
                    <div className='div-controlPanelOption'>
                        <div>
                        <FontAwesomeIcon icon={faArrowLeft} size='2x' onClick={() => handleOption(null)} className='iconBack'/>
                        </div>
                        <div className='div-title'>
                        <h2>Panel de control</h2>
                        </div>
                    </div>
                }

            </div>

            <div>
                {option === 'create' ? <OptionAdd /> : option === 'update' ? <OptionUpdate /> : option === 'delete' ? <OptionDelete /> : ''}
            </div>
        </>
    )
}

export default ControlPanel