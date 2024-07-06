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
        <div className="component">
            <div>
                <h2>Detalle de la venta</h2>
                <button>Cambio</button>
                <button>x</button>
            </div>
            <div>
                {saleDetail.orderNumber && <p>N° de orden: {saleDetail.orderNumber}</p>}
                {saleDetail.client
                 ?  <>
                        Cliente: {saleDetail.client.name} {saleDetail.client.lastname}
                        <Link to={`/main_window/clients/${saleDetail.client._id}`}>
                            <button>Detalle</button>
                        </Link>
                    </>
                 : <p>Anónimo</p>}
                {saleDetail.paymentMethod && <p>Modo de pago: {saleDetail.paymentMethod}</p>}
                {/* {saleDetail.paymentMethod && <p>Modo de pago: {saleDetail.paymentMethod.join(', ')}</p>} */}
                {saleDetail.soldAt && <p>Venta: {saleDetail.soldAt}</p>}
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
                {<p>Descuento: {saleDetail.discount}% {`(- $${saleDetail.discountApplied})`}</p>}
                {saleDetail.totalPrice && <p>Total: ${saleDetail.totalPrice}.-</p>}
            </div>          
        </div>
    );
};

export default DetailSale;