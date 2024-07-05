import React, { useState } from 'react';
import { postClient } from '../../../../redux/clientActions';
import { useDispatch } from 'react-redux';

const FormClient = ({ onClientAdded }) => {
    const dispatch = useDispatch();

    const initialClientState = {
        name: '',
        lastname: '',
        email: '',
        phone: ''
    };

    const [newClient, setNewClient] = useState(initialClientState);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setNewClient((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(newClient);
        dispatch(postClient(newClient));
        if (onClientAdded) {
            onClientAdded();
        }
    };

    return (
        <div>
            <h2>NUEVO CLIENTE</h2>
            <form onSubmit={handleSubmit}>
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
};

export default FormClient;
