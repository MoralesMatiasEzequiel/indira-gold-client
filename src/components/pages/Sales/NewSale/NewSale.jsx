import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientById } from "../../../../redux/clientActions";
import style from './NewSale.module.css';

const NewSale = ({ saleResponse }) => {

    const { client, paymentMethod, installments, discount, products, orderNumber, subTotal, totalPrice, date } = saleResponse.data;
    const dispatch = useDispatch();

    useEffect(() => {
        if(client){
            dispatch(getClientById(client));
        }
    }, [client])

    const clientById = useSelector(state => state.clients.clientDetail);

    const formatNumber = (number) => {
        return number.toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
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
            </div>
        </div>
    );
};

export default NewSale;
