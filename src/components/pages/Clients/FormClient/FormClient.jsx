import style from './FormClient.module.css';
import iconClear from '../../../../assets/img/clearForm.png';
import React, { useEffect, useState } from 'react';
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
    const [address, setAddress] = useState(initalAddressState);
    const [isClearDisabled, setIsClearDisabled] = useState(true);
    const [isSubmitClientDisabled, setIsSubmitClientDisabled] = useState(true);
    const [isSubmitAddressDisabled, setIsSubmitAddressDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSetForm = () => {
        setNewClient(initialClientState);
        setAddress(initalAddressState);
        setIsClearDisabled(true);
        setIsSubmitClientDisabled(true);
        setIsSubmitAddressDisabled(true);
        setErrorMessage('');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (event.target.value) {
            setIsClearDisabled(false);
        };

        setNewClient((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        if (event.target.value) {
            setIsClearDisabled(false);
        };
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

    // const handleKeyDown = (event) => {
    //     if (event.target.value) {
    //         setIsClearDisabled(false);
    //     }

    //     if (event.key === 'Enter') {
    //         event.preventDefault();
    //         addAddress();
    //     };
    // };

    // const validateFormClient = () => {
    //     const { dni, name, lastname, email, phone } = newClient;
    //     return dni && name && lastname && email && phone;
    // };

    // const validateFormAddress = () => {
    //     const { name, street } = address;
    //     return name && street;
    // };

    useEffect(() => {
        const isNameValid = newClient.name.trim() !== '';
        const isLastnameValid = newClient.lastname.trim() !== '';
        const isPhoneValid = newClient.phone.trim() !== '';
        const isEmailValid = newClient.email.trim() !== '';
        const isDniValid = newClient.dni.trim() !== '';

        setIsSubmitClientDisabled(!(isNameValid && isLastnameValid && isPhoneValid && isEmailValid && isDniValid));
    }, [newClient]);

    useEffect(() => {
        const isNameValid = address.name.trim() !== '';
        const isStreetValid = address.street.trim() !== '';

        setIsSubmitAddressDisabled(!(isNameValid && isStreetValid));
    }, [address]);

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
                    <div className="titleButtons">
                        <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button>
                    </div>
                </div>
                <div className="container">
                    <div className={style.containerMessage}>
                        <label className={style.mensagge}>Los campos con (*) son obligatorios</label>
                    </div>
                    <form onSubmit={handleSubmit} className={style.clientForm}>
                        <div className={style.column}>
                            <div className={`${style.newAddress} ${style.whiteBackground}`}>
                                <div className={style.labelInput}>
                                    <label htmlFor="dni">*DNI</label>
                                    <input 
                                        type="text" 
                                        id="dni" 
                                        name="dni" 
                                        value={newClient.dni} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="name">*Nombre(s)</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={newClient.name} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="lastname">*Apellido(s)</label>
                                    <input 
                                        type="text" 
                                        id="lastname" 
                                        name="lastname" 
                                        value={newClient.lastname} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="email">*Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={newClient.email} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="phone">*Teléfono</label>
                                    <input 
                                        type="text" 
                                        id="phone" 
                                        name="phone" 
                                        value={newClient.phone} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className={style.labelInput}><label>Direcciones</label></div>
                                <div className={`${style.newAddress} ${style.addMarginTop}`}>
                                    {newClient.addresses?.length > 0 ? 
                                        <ul>
                                            {newClient.addresses?.map((address, index) => (
                                                <li key={index}>
                                                    {address.name && address.name} - {address.street && address.street} 
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
                                <button type="submit" disabled={isSubmitClientDisabled}>Crear</button>
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={`${style.newAddress} ${style.greyBackground}`}>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressName">*Nombre</label>
                                    <input 
                                        type="text" 
                                        id="addressName" 
                                        name="name" 
                                        value={address.name} 
                                        onChange={handleAddressChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isSubmitAddressDisabled) {
                                            e.preventDefault(); // evita que recargue el formulario principal
                                            addAddress();
                                            }
                                        }}
                                    />
                                </div>
                                <div className={style.labelInput}>
                                    <label htmlFor="addressStreet">*Calle</label>
                                    <input 
                                        type="text" 
                                        id="addressStreet" 
                                        name="street" 
                                        value={address.street} 
                                        onChange={handleAddressChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isSubmitAddressDisabled) {
                                            e.preventDefault();
                                            addAddress();
                                            }
                                        }}
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
                                <button type="button" onClick={addAddress} disabled={isSubmitAddressDisabled}>Añadir</button>
                            </div>                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormClient;
