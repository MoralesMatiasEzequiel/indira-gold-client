import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { putRemovePurchases } from '../../../../redux/clientActions.js';
import { getSales, getSaleById, getSaleByIdLocal, clearSaleDetail, deleteSale } from '../../../../redux/saleActions.js';
import { getProductById, increaseStock } from '../../../../redux/productActions.js';
import print from "../../../../assets/img/print.png";
import detail from "../../../../assets/img/detail.png";
import jsPDF from 'jspdf';
import style from "./DetailSale.module.css";


const DetailSale = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const saleDetail = useSelector(state => state.sales.saleDetail);
    const products = useSelector(state => state.products.products);
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(clearSaleDetail());
        setPurchasedProducts([]);
        setLoading(true);
        setProductsLoading(true);
        dispatch(getSaleById(id))
        .then(() => {
            setLoading(false); // Desactiva la bandera de carga cuando los datos estén listos
        })
        .catch(() => {
            // Si la solicitud falla, intenta obtener los datos localmente
            dispatch(getSaleByIdLocal(id));
            setLoading(false);
        });
    }, [dispatch, id]);

    useEffect(() => {
        if (!loading && saleDetail && saleDetail.products) {
            const updatedProducts = [];
            saleDetail.products.forEach((product) => {
                dispatch(getProductById(product.productId)).then((response) => {
                    if (response.error && response.error.status === 404) {
                        // Producto no encontrado, agregar producto como no disponible
                        updatedProducts.push({
                            name: 'Producto no disponible',
                            selectedColor: null,
                            selectedSize: null,
                            price: null,
                        });
                    } else {
                        const productInfo = response;
                        const selectedColor = getColorById(productInfo, product.colorId);
                        const selectedSize = getSizeById(productInfo, product.colorId, product.sizeId);

                        updatedProducts.push({ ...productInfo, selectedColor, selectedSize });
                    
                    }
                    // Solo actualiza purchasedProducts después de que todos los productos hayan sido cargados
                    if (updatedProducts.length === saleDetail.products.length) {
                        setPurchasedProducts(updatedProducts);
                        setProductsLoading(false);
                    }
                })
                .catch(() => {
                        const filteredProduct = products.find(p => p._id === product.productId);
                        if (filteredProduct) {
                            const selectedColor = getColorById(filteredProduct, product.colorId);
                            const selectedSize = getSizeById(filteredProduct, product.colorId, product.sizeId);

                            updatedProducts.push({ ...filteredProduct, selectedColor, selectedSize });
                        } 
                        if (updatedProducts.length === saleDetail.products.length) {
                            setPurchasedProducts(updatedProducts);
                            setProductsLoading(false);
                        }
                });
            });
        } else {
            setPurchasedProducts([]);
        }
    }, [saleDetail, dispatch, loading]);

    const getColorById = (product, colorId) => {
        return product?.color?.find(c => c._id === colorId);
    };

    const getSizeById = (product, colorId, sizeId) => {
        const color = getColorById(product, colorId);
        return color?.size?.find(s => s._id === sizeId);
    };

    const formatNumber = (number) => {
        return number.toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }

    const generatePDF = () => {
        const doc = new jsPDF();

        // Añade título
        doc.setFontSize(48);
        doc.text('Ticket de cambio', 14, 22);

        // Información general de la venta
        doc.setFontSize(36);
        doc.text(`N° de orden: ${saleDetail.orderNumber || 'N/A'}`, 14, 35);
        doc.text(`Cliente: ${saleDetail.client ? `${saleDetail.client.name} ${saleDetail.client.lastname}` : 'Anónimo'}`, 14, 45);
        doc.text(`Modo de pago: ${saleDetail.paymentMethod || 'N/A'}`, 14, 55);
        doc.text(`Subtotal: $${formatNumber(saleDetail.subTotal) || '0.00'}`, 14, 75);
        doc.text(`Descuento: ${saleDetail.discount}% (- $${formatNumber(saleDetail.discountApplied) || '0.00'})`, 14, 85);
        doc.text(`Total: $${formatNumber(saleDetail.totalPrice) || '0.00'}`, 14, 95);

        // Productos de la venta
        let yPos = 105;
        if (purchasedProducts?.length) {
            doc.setFontSize(36);
            doc.text('Productos:', 14, yPos);
            yPos += 10;

            purchasedProducts.forEach(product => {
                doc.setFontSize(36);
                doc.text(`${product.name}`, 14, yPos);
                doc.text(`Color: ${product.selectedColor?.colorName}`, 14, yPos);
                doc.text(`Talle: ${product.selectedSize?.sizeName}`, 14, yPos);
                doc.text(`Precio: $${formatNumber(product.price)}`), 14, yPos;
                yPos += 10;
            });
        }

        // Abre el PDF en una nueva pestaña/ventana y activa el diálogo de impresión
        const pdfBlob = doc.output('blob'); // Crea un Blob del PDF
        const pdfUrl = URL.createObjectURL(pdfBlob); // Crea una URL del Blob
        const printWindow = window.open(pdfUrl); // Abre una nueva ventana con el PDF
        printWindow.onload = function () {
            printWindow.print(); // Llama a la función de impresión de la nueva ventana
        };
    };
    
    const handleDelete = () => {

        purchasedProducts.forEach((product) => {
            const key = `${product._id}_${product.selectedColor._id}_${product.selectedSize._id}`;

            dispatch(increaseStock({
                _id: product._id,
                idColor: product.selectedColor._id,
                idSize: product.selectedSize._id,
                stockToIncrease: 1
            }))
            .catch(error => {
                console.error("Error incrementando el stock:", error);
            });

            if(saleDetail.client){

                let clientData = {
                    _id: saleDetail.client._id,
                    purchasesToRemove: [
                        {
                            productId: product._id,
                            colorId: product.selectedColor._id,
                            sizeId: product.selectedSize._id
                        }
                    ]
                }
                dispatch(putRemovePurchases(clientData));
            };
        })

        dispatch(deleteSale(id)).then(
            dispatch(getSales()).then(
                navigate('/main_window/')
            )
        );
    }

    return(
        <div className="page">
            {loading ? (
                <div>Cargando</div>
            ) : (
                <div>
                    <div className="component">
                        <div className="title">
                            <h2>Detalle de la venta</h2>
                            <div className="titleButtons">
                                <button onClick={generatePDF}><img src={print} alt=""/></button>
                                <button><Link to={`/main_window/sales/edit/${id}`}>Cambio</Link></button>
                                <button className="delete" onClick={toggleShowDeleteModal}>Eliminar</button>
                                <button><Link to={`/main_window/`}>Atrás</Link></button>
                            </div>
                        </div>
                        <div className={`container ${style.content}`}>
                            {saleDetail.orderNumber && <div className={style.orderNumber}><span>N° de orden:</span> {saleDetail.orderNumber}</div>}
                            
                            <div className={style.column}>
                                {saleDetail.client
                                ?  <p>
                                        <span>Cliente:&nbsp;</span>{saleDetail.client.dni} - {saleDetail.client.name} {saleDetail.client.lastname}
                                        <Link to={`/main_window/clients/${saleDetail.client._id}`}>
                                            <img src={detail} alt=""/>
                                        </Link>
                                    </p>
                                : <p><span>Cliente:&nbsp;</span> Anónimo</p>}
                                {saleDetail.paymentMethod && <p><span>Modo de pago:&nbsp;</span> {saleDetail.paymentMethod}</p>}
                                {/* {saleDetail.paymentMethod && <p>Modo de pago: {saleDetail.paymentMethod.join(', ')}</p>} */}
                                {saleDetail.soldAt && <p><span>Tipo de venta:&nbsp;</span> {saleDetail.soldAt}</p>}
                                {saleDetail.subTotal && <p><span>Subtotal:&nbsp;</span> ${formatNumber(saleDetail.subTotal)}.</p>}
                                {<p><span>Descuento:&nbsp;</span> {saleDetail.discount}% {`(- $${saleDetail.discountApplied})`}</p>}
                                {saleDetail.totalPrice && <p><span>Total:&nbsp;</span> ${formatNumber(saleDetail.totalPrice)}.</p>}
                            </div>
                            <div className={style.column}>
                                <p><span>Productos:&nbsp;</span></p>
                                {productsLoading ? (
                                    <div>Cargando productos...</div> 
                                ) : purchasedProducts?.length ? (
                                    <ul>
                                        {purchasedProducts.length > 0 ? (
                                            purchasedProducts.map((product, index) => (
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
            )}

        </div>
        
    );
};

export default DetailSale;