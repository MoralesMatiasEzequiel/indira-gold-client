import style from './DetailDebt.module.css';
import detail from '../../../../../assets/img/detail.png';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { getDebtById, clearDebtDetail, deleteDebt } from '../../../../../redux/debtActions';
import { getProductById } from '../../../../../redux/productActions';

const DetailDebt = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const debtDetail = useSelector(state => state.debts.debtDetail);        

    const [loading, setLoading] = useState(true);
    const [realizedIncome, setRealizedIncome] = useState([]);
    const [incomesLoading, setIncomesLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(false);
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);    
    
    useEffect(() => {
        dispatch(clearDebtDetail());
        setLoading(true);
        setPurchasedProducts([]);
        setProductsLoading(true);
        setRealizedIncome([]);
        setIncomesLoading(true);
        dispatch(getDebtById(id))
        .then(() => {
            setLoading(false);
        })
        // .catch(() => {
        //     dispatch(getClientByIdLocal(id));
        //     setLoading(false);
        // });
    }, [dispatch, id]);

    const getColorById = (product, colorId) => {
        return product?.color?.find(c => c._id === colorId);
    };

    const getSizeById = (product, colorId, sizeId) => {
        const color = getColorById(product, colorId);
        return color?.size?.find(s => s._id === sizeId);
    };

    useEffect(() => {
        if (!loading && debtDetail && debtDetail.sale.products) {
            const updatedProducts = [];
            debtDetail.sale.products?.forEach((product) => {
                dispatch(getProductById(product.productId)).then((response) => {
                    if (response.error && response.error.status === 404) {
                        // Producto no encontrado, agregar producto como no disponible
                        updatedProducts.push({
                            name: 'Producto no disponible',
                            selectedColor: null,
                            selectedSize: null,
                            price: product.price, // Usar el precio almacenado en debtDetail.products
                        });
                    } else {
                        const productInfo = response;
                        const selectedColor = getColorById(productInfo, product.colorId);
                        const selectedSize = getSizeById(productInfo, product.colorId, product.sizeId);
    
                        // Usar el precio de debtDetail.products, no el de productInfo
                        updatedProducts.push({ 
                            ...productInfo, 
                            selectedColor, 
                            selectedSize,
                            price: product.price // Precio almacenado en la venta
                        });
                    }
    
                    // Actualiza purchasedProducts solo después de que todos los productos hayan sido cargados
                    if (updatedProducts.length === debtDetail.sale.products?.length) {
                        setPurchasedProducts(updatedProducts);
                        setProductsLoading(false);
                    }
                })
            //   .catch(() => {
            //       const filteredProduct = products.find(p => p._id === product.productId);
            //       if (filteredProduct) {
            //           const selectedColor = getColorById(filteredProduct, product.colorId);
            //           const selectedSize = getSizeById(filteredProduct, product.colorId, product.sizeId);
    
            //           updatedProducts.push({ 
            //               ...filteredProduct, 
            //               selectedColor, 
            //               selectedSize,
            //               price: product.price // Mantener el precio de la venta
            //           });
            //       }
            //       if (updatedProducts.length === debtDetail.products.length) {
            //           setPurchasedProducts(updatedProducts);
            //           setProductsLoading(false);
            //       }
            //   });
            });
        } else {
            setPurchasedProducts([]);
        }
    }, [debtDetail, dispatch, loading]);

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

    const formatDate2 = (date) => {        
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            // timeZone: 'UTC' 
        };

        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
    };
    
    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    const handleDelete = () => {
        dispatch(deleteDebt(id)).then(() => {
            navigate('/main_window/debts');
            setTimeout(() => {
                navigate(`/main_window/debts/${id}`);
            }, 50);
            setShowDeleteModal(false);
        });
    };

    return (
        <div className="page">
            {
                loading ? (
                    <div>Cargando</div>
                ) : (
                    <div className="component">
                        <div className="title">
                            <h2>Detalle de la deuda</h2>
                            <div className="titleButtons">
                                {debtDetail.active ? <button onClick={() => navigate(`/main_window/debts/edit/${id}`)}>Editar</button> : ''}
                                {!debtDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
                                <button onClick={() => navigate(`/main_window/debts`)}>Atrás</button>
                            </div>
                        </div>
                        <div className={!debtDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}>
                            {debtDetail.sale.orderNumber && <div className={style.orderNumber}><span>N° de orden:</span> {debtDetail.sale.orderNumber}</div>}
                            <div className={style.column}>
                                {debtDetail.sale.date && <p><span>Fecha:&nbsp;</span>{formatDate(debtDetail.sale.date)}</p>}
                                {debtDetail.client
                                ?  <p>
                                        <span>Cliente:&nbsp;</span>{debtDetail.client.dni} - {debtDetail.client.name} {debtDetail.client.lastname}
                                        <a onClick={() => navigate(`/main_window/clients/${debtDetail.client._id}`)}>
                                            <img className="detailImg" src={detail} alt=""/>
                                        </a>
                                    </p>
                                : <p><span>Cliente:&nbsp;</span> Anónimo</p>}
                                {debtDetail.sale &&
                                    <p>
                                        <span>Total de la venta:&nbsp;</span> ${formatNumber(debtDetail.sale.totalPrice)}
                                        <a onClick={() => navigate(`/main_window/sales/${debtDetail.sale._id}`)}>
                                            <img className="detailImg" src={detail} alt=""/>
                                        </a>
                                    </p>
                                }
                                <p><span>Pagos realizado:&nbsp;</span></p>
                                <ul>
                                    {debtDetail.income?.length > 0 ? (
                                        debtDetail.income?.map((income, index) => (
                                            <li key={index}>
                                                <ul className={style.productList}>
                                                    {income.date && <li><span>Fecha:&nbsp;</span>{formatDate2(income.date) || 'Fecha no encontrada'}</li>}
                                                    <li><span>Pago:&nbsp;</span> ${formatNumber(income.amount) || 'Pago no encontrado'}</li>
                                                </ul>
                                            </li>
                                        ))
                                    ) : (
                                        <div>No hay pagos registrados</div>
                                    )}
                                </ul>
                                <p><span>Total abonado:&nbsp;</span> ${formatNumber(debtDetail.paymentMade)}</p>
                                <p><span>Saldo:&nbsp;</span> ${formatNumber(debtDetail.remainingBalance) || 0}</p>
                            </div>
                            <div className={style.column}>
                                <p><span>Productos:&nbsp;</span></p>
                                {productsLoading ? (
                                    <div>Cargando productos...</div> 
                                ) : purchasedProducts?.length ? (
                                    <ul>
                                        {purchasedProducts?.length > 0 ? (
                                            purchasedProducts?.map((product, index) => (
                                                <li key={index}>
                                                    <p><span>{product.name}</span></p>
                                                    <ul className={style.productList}>
                                                        {product.selectedColor && <li><span>Color:&nbsp;</span>{product.selectedColor?.colorName || 'Desconocido'}</li>}
                                                        {product.selectedSize && <li><span>Talle:&nbsp;</span>{product.selectedSize?.sizeName || 'Desconocido'}</li>}
                                                        {product.price &&<li><span>Precio:&nbsp;</span>${formatNumber(product.price)}</li>}
                                                    </ul>
                                                </li>
                                            ))
                                        ) : (
                                            <div>No hay compras registradas</div>
                                        )}
                                    </ul>
                                ) : (
                                    <p>No hay productos vendidos disponibles.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea {debtDetail.active ? 'desactivar' : 'activar'} esta deuda?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleDelete} className={debtDetail.active ? 'delete' : 'add'}>{debtDetail.active ? 'Desactivar' : 'Activar'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailDebt