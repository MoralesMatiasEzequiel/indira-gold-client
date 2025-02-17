import style from './PutDebt.module.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getDebts, getDebtById, putDebt, putDebtAmount } from '../../../../../redux/debtActions';

const PutDebt = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const debtDetail = useSelector(state => state.debts.debtDetail);     

    useEffect(() => {
        dispatch(getDebtById(id));
    }, [dispatch, id]);

    const [editDebt, setEditDebt] = useState({});  

    useEffect(() => {    
        if (debtDetail && debtDetail._id === id) {        
            const updatedEditDebt = {
                _id: debtDetail._id,
                client: debtDetail.client,
                sale: debtDetail.sale,
                income: debtDetail.income,
                remainingBalance: debtDetail.remainingBalance,
                paymentMade: debtDetail.paymentMade,
                active: debtDetail.active
            };
            setEditDebt(updatedEditDebt);
        }
    }, [dispatch, id, debtDetail]);

    //-----------CHANGE-----------//
    const handleChange = (event) => {
        const { name, value } = event.target;

        setEditDebt((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await dispatch(putDebt(editDebt));
            
            // Espera a que el cliente se actualice antes de redirigir
            await dispatch(getDebtById(id));
            
            dispatch(getDebts());
            
            // Redirige después de actualizar el cliente
            navigate(`/main_window/debt/${id}`);
        } catch (error) {
            console.error('Error updating debt:', error);
        }
    };

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>EDITAR DEUDA</h2>
                    <div className="titleButtons">
                        <button onClick={() => navigate(`/main_window/debts/${id}`)}>Atrás</button>
                    </div>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className={style.salesForm}>
                        {/* <div className={style.column1}>
                            <div className={style.labelInput}>
                                <div className={style.left}>
                                    <label htmlFor="orderNumber">N° de orden</label>
                                </div>
                                <div className={style.right}>
                                    <div>
                                        <AsyncSelect
                                            // key={selectKey}
                                            cacheOptions
                                            name="orderNumber"
                                            value={selectedSale || ''}
                                            loadOptions={loadSalesOptions}
                                            onChange={handleDebtChange}
                                            placeholder="Buscar venta"
                                            defaultOptions={salesOptions}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                ...clientInputStyles
                                            }}
                                        />
                                    </div>                                 
                                </div>
                            </div>
                            <div className={style.labelInput}>
                                <div className={style.left}>
                                    <label htmlFor="amount">Pago realizado $</label>
                                </div>
                                <div className={style.right}>
                                    <input 
                                        className={style.discount}
                                        type='number'
                                        name="amount"
                                        value={newDebt.amount || ''}
                                        onChange={handleInputChange}
                                        placeholder='0'
                                        min='0'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={style.column2}>
                            <div className={style.labelInput}>
                                <div className={style.left}>
                                    <label htmlFor="client">Cliente</label>
                                </div>
                                <div className={style.right}>
                                    <span>{selectedClient ? selectedClient : "Anónimo"}</span>
                                </div>
                            </div>
                        </div>
                        <div className={style.column3}>
                            <div className={style.subtotal}>
                                <div className={style.left}>Monto</div>
                                <div className={style.right}>${formatNumber(totalSale)}</div>
                            </div>   
                            <div className={style.subtotal}>
                                <div className={style.left}>Pagado</div>
                                <div className={style.right}>${formatNumber(newDebt.amount)}</div>
                            </div>      
                            <div className={style.total}>
                                <div className={style.left}>Saldo</div>
                                <div className={style.right}>${formatNumber(totalSale - newDebt.amount)}</div>
                            </div>                     
                            <button type="submit" disabled={isSubmitDisabled}>Aceptar</button>
                        </div>  */}
                        {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}                     
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PutDebt;