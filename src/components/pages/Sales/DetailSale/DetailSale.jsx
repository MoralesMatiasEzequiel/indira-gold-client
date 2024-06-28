import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from 'react-router-dom';
import { getSaleById } from '../../../../redux/saleActions.js';


const DetailSale = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const saleDetail = useSelector(state => state.sales.saleDetail);

    useEffect(() => {
        dispatch(getSaleById(id));
    }, [dispatch, id]);
    
    return(
        <div>
            <div>
                <h1>Detalle de la venta</h1>
            </div>
            <div>
                {saleDetail.orderNumber && <p>N° de orden: {saleDetail.orderNumber}</p>}
                {saleDetail.client?.length > 0
                 ?  <>
                        Cliente: {saleDetail.client[0].name} {saleDetail.client[0].lastname}
                        <Link to={`/main_window/clients/${saleDetail.client[0]._id}`}>
                            <button>Detalle</button>
                        </Link>
                    </>
                 : <p>Anónimo</p>}
                {saleDetail.paymentMethod && <p>Modo de pago: {saleDetail.paymentMethod.join(', ')}</p>}
                {saleDetail.soldIn && <p>Venta: {saleDetail.soldIn[0]}</p>}
                {saleDetail.products?.length && <>Productos: {saleDetail.products.map(product => (
                    <div key={product._id}>
                        <li>
                            {product.name}, 
                            Color: {product.color[0]?.colorName},
                            Talle: {product.color[0]?.size[0]?.sizeName},
                            Precio: ${product.price}.-
                        </li>
                    </div>
                ))}</>}
                {saleDetail.subTotal && <p>Sub total: ${saleDetail.subTotal}.-</p>}
                {saleDetail.discount && <p>Descuento: {saleDetail.discount}% {`(- $${saleDetail.discountApplied})`}</p>}
                {saleDetail.totalPrice && <p>Total: ${saleDetail.totalPrice}.-</p>}
            </div>          
        </div>
    );
};

export default DetailSale;