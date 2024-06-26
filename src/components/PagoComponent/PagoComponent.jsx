import React, { useEffect, useState } from 'react';
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react';
import { useMp } from '../context/MpContext';

function PagoComponent() {
    const publicKey = process.env.REACT_APP_PUBLIC_KEY_MP;
    const { crearPreferencia, prodsCookie } = useMp();

    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        initMercadoPago(publicKey, { locale: 'es-AR' });


        const fetchData = async () => {

            const resp = await crearPreferencia();

            if (resp.status === 'succes') {
                setPreferenceId(resp.payload);
                console.log(resp.payload)
                setLoading(false);
            }
            if (resp.status === 'error') {
                setError(resp.error)
                setLoading(false)
            }
        }

        fetchData();
    }, [])


    return (
        <>
            {loading ? 'Cargando...'
                :
                error ?
                    error
                    :
                    <Wallet initialization={{ preferenceId: preferenceId, redirectMode: 'self' }} />
            }

        </>
    )
}

export default PagoComponent;