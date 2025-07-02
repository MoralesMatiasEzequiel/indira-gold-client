import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientById } from "../../../../redux/clientActions";
import style from './NewSale.module.css';

const NewSale = ({ saleResponse, debtAmount }) => {

    if (!saleResponse?.data) return null;

    const { client, paymentMethod, installments, discount, products, orderNumber, subTotal, totalPrice, date, shipment } = saleResponse.data;

    const safeDebtAmount = debtAmount ?? 0;

    const dispatch = useDispatch();

    useEffect(() => {
        if(client){
            dispatch(getClientById(client));
        }
    }, [client])

    const clientById = useSelector(state => state.clients.clientDetail);

    const formatNumber = (number) => {
        if (number !== null && number !== undefined) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return '0';
    };

    const formatDate = (date) => {
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            timeZone: 'UTC' 
        };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
    };

    return (
        <div className={style.content}>
            <p className={style.orderNumber}>N° de orden: {orderNumber}</p>
            <div className={style.column}>
                <p><span className={style.key}>Fecha:</span> {formatDate(date)}</p>
                <p><span className={style.key}>Cliente:</span> {client ? `${clientById.dni} - ${clientById.name} ${clientById.lastname}` : "Anónimo"}</p>
                <p><span className={style.key}>Método de Pago:</span> {paymentMethod}</p>
                <p><span className={style.key}>Cuotas:</span> {installments}</p>
            </div>
            <div className={style.column}>
                <p><span className={style.key}>Productos comprados:</span> {products.length}</p>
                <p><span className={style.key}>Subtotal:</span> ${formatNumber(subTotal)}</p>
                <p><span className={style.key}>Descuento:</span> {discount}%</p>
                <p><span className={style.key}>Total:</span> ${formatNumber(totalPrice)}</p>
                {safeDebtAmount > 0 && safeDebtAmount < totalPrice && (
                    <>
                        <p><span className={style.key}>Total abonado:</span> ${formatNumber(safeDebtAmount)}</p>
                        <p><span className={style.key}>Adeuda:</span> ${formatNumber(totalPrice - safeDebtAmount)}</p>
                    </>
                )}
                {shipment !== null && (
                    <>
                        <p><span className={style.key}>Dirección de envío:</span> {shipment?.address}</p>
                        <p><span className={style.key}>Costo de envío:</span> ${formatNumber(shipment?.amount)}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewSale;
