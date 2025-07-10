import style from './PutClient.module.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getClients, getClientById, putClient } from '../../../../redux/clientActions';
import x from "./img/x.png";
import edit from "../../../../assets/img/edit.png";

const PutClient = ({ onClientAdded = () => {}}) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const clientDetail = useSelector(state => state.clients.clientDetail);

    useEffect(() => {
        dispatch(getClientById(id));
    }, [dispatch, id]);

    const [editClient, setEditClient] = useState({});  
    const [editingAddressIndex, setEditingAddressIndex] = useState(null); // Para controlar qué dirección se está editando

    useEffect(() => {    
        if (clientDetail && clientDetail._id === id) {        
            const updatedEditClient = {
                _id: clientDetail._id,
                dni: clientDetail.dni,
                name: clientDetail.name,
                lastname: clientDetail.lastname,
                email: clientDetail.email,
                phone: clientDetail.phone,
                addresses: clientDetail.addresses || [],
                active: clientDetail.active
            };
            setEditClient(updatedEditClient);
        }
    }, [dispatch, id, clientDetail]);

    //-----------Address-----------//
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

    const [address, setAddress] = useState(initalAddressState);

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const addAddress = () => {
        if (editingAddressIndex !== null) {
            // Si estamos editando una dirección existente
            const updatedAddresses = [...editClient.addresses];
            updatedAddresses[editingAddressIndex] = address;
            
            setEditClient(prevClient => ({
                ...prevClient,
                addresses: updatedAddresses
            }));
            
            setEditingAddressIndex(null);
        } else {
            // Si estamos añadiendo una nueva dirección
            setEditClient(prevClient => ({
                ...prevClient,
                addresses: [...(prevClient.addresses || []), address]
            }));
        }

        setAddress(initalAddressState);
    };
    
    const removeAddress = (index) => {
        setEditClient(prevClient => ({
            ...prevClient,
            addresses: prevClient.addresses.filter((_, i) => i !== index)
        }));
        
        // Si estábamos editando la dirección que se eliminó, limpiamos el estado
        if (editingAddressIndex === index) {
            setEditingAddressIndex(null);
            setAddress(initalAddressState);
        }
    };

    const editExistingAddress = (index) => {
        const addressToEdit = editClient.addresses[index];
        setAddress(addressToEdit);
        setEditingAddressIndex(index);
    };

    const cancelEdit = () => {
        setEditingAddressIndex(null);
        setAddress(initalAddressState);
    };

    //-----------CHANGE-----------//
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditClient((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await dispatch(putClient(editClient));
            await dispatch(getClientById(id));
            onClientAdded(response);
            dispatch(getClients());
            navigate(`/main_window/clients/${id}`);
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>EDITAR CLIENTE</h2>
                    <div className="titleButtons">
                        <button onClick={() => navigate(`/main_window/clients/${id}`)}>Atrás</button>
                    </div>
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
                                    value={editClient.dni} 
                                    onChange={handleChange} 
                                    required 
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>
                            <div className={style.labelInput}>
                                <label htmlFor="name">Nombre(s)</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={editClient.name} 
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
                                    value={editClient.lastname} 
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
                                    value={editClient.email} 
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
                                    value={editClient.phone} 
                                    onChange={handleChange} 
                                    required 
                                    onWheel={(e) => e.target.blur()}
                                    onKeyDown={(e) => {
                                        if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === '-') {
                                            e.preventDefault(); // Bloquea decimales, notación científica y negativos
                                        }
                                    }}
                                />
                            </div>
                            <div className={style.labelInput}><label>Direcciones</label></div>
                            <div className={style.newAddress}>
                                {editClient.addresses?.length > 0 ? 
                                    <ul>
                                        {editClient.addresses?.map((address, index) => (
                                            <li key={index}>
                                                {address.name && address.name}
                                                <div>
                                                    <button type="button" onClick={() => editExistingAddress(index)}>
                                                        <img src={edit} alt="Editar" />
                                                    </button>
                                                    <button type="button" onClick={() => removeAddress(index)}>
                                                        <img src={x} alt="Eliminar" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                :
                                    <label style={{fontStyle: "italic"}}>Aún no se han añadido direcciones.</label>}
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={style.newAddress}>
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
                                <div className={style.addressButtons}>
                                    <button type="button" onClick={addAddress}>
                                        {editingAddressIndex !== null ? 'Actualizar' : 'Añadir'}
                                    </button>
                                    {editingAddressIndex !== null && (
                                        <button type="button" onClick={cancelEdit} className={style.cancelButton}>
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                                        
                            <div className={style.containerSubmit}>
                                <button className={style.buttonSubmit} type="submit">Editar</button>
                            </div>
                        </div>                       
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PutClient;