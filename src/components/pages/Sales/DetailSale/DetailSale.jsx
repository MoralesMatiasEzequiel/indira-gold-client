import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSaleById, deleteSale } from '../../../../redux/saleActions.js';
import print from "../../../../assets/img/print.png";
import detail from "../../../../assets/img/detail.png";
import style from "./DetailSale.module.css";


const DetailSale = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const saleDetail = useSelector(state => state.sales.saleDetail);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(getSaleById(id));
    }, [dispatch, id]);

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }
    
    const handleDelete = () => {
        dispatch(deleteSale(id));
        navigate('/main_window/');
    }

    return(
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>Detalle de la venta</h2>
                    <div className="titleButtons">
                        <button><img src={print} alt=""/></button>
                        <button>Cambio</button>
                        <button className="delete" onClick={toggleShowDeleteModal}>Eliminar</button>
                        <button><Link to={`/main_window/`}>Atrás</Link></button>
                    </div>
                </div>
                <div className={`container ${style.content}`}>
                    {saleDetail.orderNumber && <div className={style.orderNumber}><span>N° de orden:</span> {saleDetail.orderNumber}</div>}
                    
                    <div className={style.column}>
                        {saleDetail.client
                        ?  <p>
                                <span>Cliente:&nbsp;</span>{saleDetail.client.name} {saleDetail.client.lastname}
                                <Link to={`/main_window/clients/${saleDetail.client._id}`}>
                                    <img src={detail} alt=""/>
                                </Link>
                            </p>
                        : <p><span>Cliente:&nbsp;</span> Anónimo</p>}
                        {saleDetail.paymentMethod && <p><span>Modo de pago:&nbsp;</span> {saleDetail.paymentMethod}</p>}
                        {/* {saleDetail.paymentMethod && <p>Modo de pago: {saleDetail.paymentMethod.join(', ')}</p>} */}
                        {saleDetail.soldAt && <p><span>Tipo de venta:&nbsp;</span> {saleDetail.soldAt}</p>}
                        {saleDetail.subTotal && <p><span>Subtotal:&nbsp;</span> ${saleDetail.subTotal}.</p>}
                        {<p><span>Descuento:&nbsp;</span> {saleDetail.discount}% {`(- $${saleDetail.discountApplied})`}</p>}
                        {saleDetail.totalPrice && <p><span>Total:&nbsp;</span> ${saleDetail.totalPrice}.</p>}
                    </div>
                    <div className={style.column}>
                        {saleDetail.products?.length && <div><span>Productos:</span> 
                            <ul className={style.itemUl}>
                                {saleDetail.products.map(product => (
                                    <li key={product._id}>
                                        {product.name}
                                        <ul className={style.detailUl}>
                                            <li>Color: {product.color[0]?.colorName}</li>
                                            <li>Talle: {product.color[0]?.size[0]?.sizeName}</li>
                                            <li>Precio: ${product.price}</li>
                                        </ul>
                                    </li>
                        ))}
                            </ul>
                        </div>}
                    </div>
                </div>          
            </div>
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea eliminar esta venta?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleDelete} className="delete">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default DetailSale;