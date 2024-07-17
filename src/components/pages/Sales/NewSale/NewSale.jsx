import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientById } from "../../../../redux/clientActions";
import style from './NewSale.module.css';

const NewSale = ({ saleResponse }) => {
    if (!saleResponse) {
        return null;
    }

    const { client, paymentMethod, discount, products, orderNumber, subTotal, totalPrice } = saleResponse.data;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getClientById(client));
    }, [client])

    const clientById = useSelector(state => state.clients.clientDetail);

    return (
        <div className={style.content}>
            <p className={style.orderNumber}>N° de orden: {orderNumber}</p>

            <div className={style.column}>
                <p><span className={style.key}>Cliente:</span> {`${clientById.name} ${clientById.lastname}`}</p>
                <p><span className={style.key}>Método de Pago:</span> {paymentMethod}</p>
                <p><span className={style.key}>Productos comprados:</span> {products.length}</p>
            </div>
            <div className={style.column}>
                <p><span className={style.key}>Subtotal:</span> ${subTotal}</p>
                <p><span className={style.key}>Descuento:</span> {discount}%</p>
                <p><span className={style.key}>Total:</span> ${totalPrice}</p>
            </div>
        </div>
    );
};

export default NewSale;
