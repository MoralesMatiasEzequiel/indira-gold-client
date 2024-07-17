import React from "react";

const NewSale = ({ saleResponse }) => {
    if (!saleResponse) {
        return null;
    }

    const { client, paymentMethod, discount, products, orderNumber } = saleResponse.data;
    const { status, statusText } = saleResponse;

    return (
        <div className="newSaleDetails">
            <p>Número de orden: {orderNumber}</p>
            <p><strong>Cliente:</strong> {client}</p>
            <p><strong>Método de Pago:</strong> {orderNumber}</p>
            <p><strong>Descuento:</strong> {discount}%</p>
            <p><strong>Productos:</strong></p>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>{product}</li>
                ))}
            </ul>
        </div>
    );
};

export default NewSale;
