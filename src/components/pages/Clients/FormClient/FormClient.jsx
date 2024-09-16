import style from './FormClient.module.css';
import React, { useState } from 'react';
import { postClient, getClients } from '../../../../redux/clientActions';
import { useDispatch } from 'react-redux';

const FormClient = ({ onClientAdded = () => {} }) => {

    const dispatch = useDispatch();

    const initialClientState = {
        dni: '',
        name: '',
        lastname: '',
        email: '',
        phone: ''
    };

    const [newClient, setNewClient] = useState(initialClientState);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSetForm = () => {
        setNewClient(initialClientState);
        setErrorMessage('');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setNewClient((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        dispatch(postClient(newClient)).then((response) => {
            if (typeof response === 'string') {
                setErrorMessage(response);
            } else {
                onClientAdded(response);
                dispatch(getClients());
                setNewClient(initialClientState);
            }
        });
    };

    return (
        <div className="component">
            <div className="title">
                <h2>NUEVO CLIENTE</h2>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit} className={style.clientForm}>
                    <div className={style.column}>
                        <div className={style.labelInput}>
                            <label htmlFor="dni">DNI</label>
                            <input 
                                type="number" 
                                id="dni" 
                                name="dni" 
                                value={newClient.dni} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className={style.labelInput}>
                            <label htmlFor="name">Nombre(s)</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={newClient.name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className={style.labelInput}>
                            <label htmlFor="lastname">Apellido(s)</label>
                            <input 
                                type="text" 
                                id="lastname" 
                                name="lastname" 
                                value={newClient.lastname} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>
                    <div className={style.column}>
                        <div className={style.labelInput}>
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={newClient.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className={style.labelInput}>
                            <label htmlFor="phone">Teléfono</label>
                            <input 
                                type="number" 
                                id="phone" 
                                name="phone" 
                                value={newClient.phone} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
                    </div>
                    
                    <button type="submit">Agregar</button>

                </form>

            </div>
        </div>
    );
};

export default FormClient;
