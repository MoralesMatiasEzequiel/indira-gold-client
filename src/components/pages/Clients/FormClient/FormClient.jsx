import style from './FormClient.module.css';
import React, { useState } from 'react';
import { postClient, getClients } from '../../../../redux/clientActions.js';
import { useDispatch } from 'react-redux';
import x from "./img/x.png";

const FormClient = ({ onClientAdded = () => {} }) => {

    const dispatch = useDispatch();

    const initialClientState = {
        dni: '',
        name: '',
        lastname: '',
        email: '',
        phone: '',
        addresses: []
    };

    const initalAddressState = {
        name: "",
        street: "",
        number: "",
        between: "",
        floor: "",
        apartment: "",
        city: "",
        province: "",
        postalCode: "",
        reference: ""
    };

    const [newClient, setNewClient] = useState(initialClientState);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSetForm = () => {
        setNewClient(initialClientState);
        setErrorMessage('');
    };

    const [address, setAddress] = useState(initalAddressState);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setNewClient((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const addAddress = () => {
        setNewClient(prevClient => ({
            ...prevClient,
            addresses: [...prevClient.addresses, address]
        }));

        setAddress(initalAddressState);
    };
    
    const removeAddress = (index) => {
        setNewClient(prevClient => ({
            ...prevClient,
            addresses: prevClient.addresses.filter((_, i) => i !== index)
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
            }
        });
        handleSetForm();
    };

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>NUEVO CLIENTE</h2>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className={style.clientForm}>
                        <div className={style.column}>
                            <div className={`${style.newAddress} ${style.whiteBackground}`}>
                                <div className={style.labelInput}>
                                    <label htmlFor="dni">DNI</label>
                                    <input 
                                        type="number" 
                                        id="dni" 
                                        name="dni" 
                                        value={newClient.dni} 
                                        onChange={handleChange} 
                                        required 
                                        min={0}
                                        onWheel={(event) => event.target.blur()}
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
                                        min={0}
                                        onWheel={(event) => event.target.blur()}
                                        onKeyDown={(e) => {
                                        if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === '-') {
                                            e.preventDefault(); // Bloquea decimales, notación científica y negativos
                                        }
                                    }}
                                    />
                                </div>
                                <div className={style.labelInput}><label>Direcciones</label></div>
                                <div className={`${style.newAddress} ${style.addMarginTop}`}>
                                    {newClient.addresses?.length > 0 ? 
                                        <ul>
                                            {newClient.addresses?.map((address, index) => (
                                                <li key={index}>
                                                    {address.name && address.name}
                                                    <button type="button" onClick={() => removeAddress(index)}>
                                                        <img src={x} alt="Eliminar" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    :
                                        <label style={{fontStyle: "italic"}}>Aún no se han añadido direcciones.</label>}
                                </div>
                                {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
                                <button type="submit">Crear</button>
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={`${style.newAddress} ${style.greyBackground}`}>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressName">Nombre</label>
                                    <input 
                                        type="text" 
                                        id="addressName" 
                                        name="name" 
                                        value={address.name} 
                                        onChange={handleAddressChange}
                                        
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressStreet">Calle</label>
                                    <input 
                                        type="text" 
                                        id="addressStreet" 
                                        name="street" 
                                        value={address.street} 
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <div className={style.variousInputs}>
                                    <div>
                                        <label htmlFor="addressNumber">Número</label>
                                        <input 
                                            type="text" 
                                            id="addressNumber" 
                                            name="number" 
                                            value={address.number} 
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="addressFloor">Piso</label>
                                        <input 
                                            type="text" 
                                            id="addressFloor" 
                                            name="floor" 
                                            value={address.floor} 
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="addressApartment">Departamento</label>
                                        <input 
                                            type="text" 
                                            id="addressApartment" 
                                            name="apartment" 
                                            value={address.apartment} 
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressBetween">Entre</label>
                                    <input 
                                        type="text" 
                                        id="addressBetween" 
                                        name="between" 
                                        value={address.between} 
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressCity">Ciudad</label>
                                    <input 
                                        type="text" 
                                        id="addressCity" 
                                        name="city" 
                                        value={address.city} 
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressProvince">Provincia</label>
                                    <input 
                                        type="text" 
                                        id="addressProvince" 
                                        name="province" 
                                        value={address.province} 
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressPostalCode">Código Postal</label>
                                    <input 
                                        type="text" 
                                        id="addressPostalCode" 
                                        name="postalCode" 
                                        value={address.postalCode} 
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressReference">Referencia</label>
                                    <input 
                                        type="text" 
                                        id="addressReference" 
                                        name="reference" 
                                        value={address.reference} 
                                        onChange={handleAddressChange}
                                    />
                                </div>
                                <button type="button" onClick={addAddress}>Añadir</button>
                            </div>                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormClient;
