import style from "./DetailSale.module.css";
import print from "../../../../assets/img/print.png";
import detail from "../../../../assets/img/detail.png";
import visible from "../../../../assets/img/visible.png";
import hide from "../../../../assets/img/hide.png";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import LoadingScreen from "../../../../LoadingScreen.jsx";
import { putRemovePurchases } from '../../../../redux/clientActions.js';
import { getSales, getSaleById, getSaleByIdLocal, clearSaleDetail, deleteSale, searchSales } from '../../../../redux/saleActions.js';
import { getProductById, increaseStock } from '../../../../redux/productActions.js';

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
    const [showFinancialDetails, setShowFinancialDetails] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

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
                            price: product.price, // Usar el precio almacenado en saleDetail.products
                        });
                    } else {
                        const productInfo = response;
                        const selectedColor = getColorById(productInfo, product.colorId);
                        const selectedSize = getSizeById(productInfo, product.colorId, product.sizeId);
    
                        // Usar el precio de saleDetail.products, no el de productInfo
                        updatedProducts.push({ 
                            ...productInfo, 
                            selectedColor, 
                            selectedSize,
                            price: product.price // Precio almacenado en la venta
                        });
                    }
    
                    // Actualiza purchasedProducts solo después de que todos los productos hayan sido cargados
                    if (updatedProducts?.length === saleDetail.products?.length) {
                        setPurchasedProducts(updatedProducts);
                        setProductsLoading(false);
                    }
                })
                .catch(() => {
                    const filteredProduct = products.find(p => p._id === product.productId);
                    if (filteredProduct) {
                        const selectedColor = getColorById(filteredProduct, product.colorId);
                        const selectedSize = getSizeById(filteredProduct, product.colorId, product.sizeId);
    
                        updatedProducts.push({ 
                            ...filteredProduct, 
                            selectedColor, 
                            selectedSize,
                            price: product.price // Mantener el precio de la venta
                        });
                    }
                    if (updatedProducts?.length === saleDetail.products?.length) {
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
        if (number !== null && number !== undefined) {
            const rounded = Math.round(number); // redondea al entero más cercano
            return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }

    const handleMouseEnter = () => {
        setIsHovered(true); 
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    //Abrir PDF en ventana nueva
    const openAndPrintPDF = (doc) => {
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl, "_blank", "toolbar=no,menubar=no,location=no,status=no");
        if (printWindow) {
            printWindow.onload = () => printWindow.print();
        } else {
            alert("Por favor, permite las ventanas emergentes para imprimir el ticket.");
        }
    };

    //Función para ajustar texto al ancho del ticket y añadirlo al documento
    const addWrappedText = (doc, text, x, y, maxLineWidth, lineHeight, fontStyle = "normal") => {
        doc.setFont("helvetica", fontStyle);
        const lines = doc.splitTextToSize(text, maxLineWidth);
        lines.forEach(line => {
            doc.text(line, x, y);
            y += lineHeight;
        });
        doc.setFont("helvetica", "normal"); // reset
        return y;
    };

    // Ticket de CAMBIO/VENTA
    const printChangeTicket = () => {
        // Variables para el ancho y la altura del papel de ticket (58 mm x 100 aprox)
        const pageWidth = 58; 
        const minPageHeight = 100; // Altura mínima en mm
        const lineHeight = 6; // Altura de cada línea de texto en mm
        const maxLineWidth = pageWidth - 8; // Deja un margen de 4 mm en cada lado

        // Crear el PDF
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [pageWidth, minPageHeight]
        });

        // --- Función auxiliar para contar líneas ---
        const calculateLines = (text) => doc.splitTextToSize(text, maxLineWidth).length;

        // --- Calcular altura necesaria ---
        const calculateChangeTicketHeight = () => {
            let totalHeight = 30; // margen inicial

            totalHeight += calculateLines("INDIRA GOLD") * lineHeight;
            totalHeight += calculateLines("Ticket de cambio") * lineHeight;
            totalHeight += calculateLines(`Fecha: ${formatDate(saleDetail.date) || "N/A"}`) * lineHeight;
            totalHeight += calculateLines(`*Tenés hasta 15 días para realizar el cambio`) * lineHeight;
            totalHeight += calculateLines(`N° de orden: ${saleDetail.orderNumber}`) * lineHeight;
            totalHeight += calculateLines(`Cliente: ${saleDetail.client ? `${saleDetail.client.name} ${saleDetail.client.lastname}` : "Anónimo"}`) * lineHeight;

            if (showFinancialDetails) {
                totalHeight += calculateLines(`Modo de pago: ${saleDetail.paymentMethod || "N/A"}`) * lineHeight;
                totalHeight += calculateLines(`Subtotal: $${formatNumber(saleDetail.subTotal) || "0.00"}`) * lineHeight;
                totalHeight += calculateLines(`Descuento: ${saleDetail.discount}% (- $${formatNumber(saleDetail.discountApplied) || "0.00"})`) * lineHeight;
                totalHeight += calculateLines(`Total: $${formatNumber(saleDetail.totalPrice) || "0.00"}`) * lineHeight;
                if (saleDetail.debt) {
                    totalHeight += calculateLines(`Debe: $${formatNumber(saleDetail.debt)}`) * lineHeight;
                }
            }

            if (purchasedProducts?.length) {
                totalHeight += lineHeight; // título "Productos"
                purchasedProducts.forEach(product => {
                    totalHeight += calculateLines(`• ${product.name || "Producto desconocido"}`) * lineHeight;
                    totalHeight += calculateLines(`Color: ${product.selectedColor?.colorName || "N/A"}`) * lineHeight;
                    totalHeight += calculateLines(`Talle: ${product.selectedSize?.sizeName || "N/A"}`) * lineHeight;
                    if (showFinancialDetails) {
                        totalHeight += calculateLines(`Precio: $${formatNumber(product.price) || "0.00"}`) * lineHeight;
                    }
                });
            }

            return Math.max(totalHeight, minPageHeight);
        };

        // Ajustar la altura de la página al contenido
        const pageHeight = calculateChangeTicketHeight();
        doc.internal.pageSize.setHeight(pageHeight);

        // -------- DIBUJAR CONTENIDO --------
        let yPos = 5;

        // ENCABEZADO
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        const title = "INDIRA GOLD";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (doc.internal.pageSize.getWidth() - titleWidth) / 2, yPos);

        // Subtítulo
        yPos = 15;
        doc.setFontSize(16);
        const changeTitle = "Ticket de cambio";
        const changeTitleWidth = doc.getTextWidth(changeTitle);
        doc.text(changeTitle, (doc.internal.pageSize.getWidth() - changeTitleWidth) / 2, yPos);

        yPos = 25;
        doc.setFontSize(12);

        // Información venta
        yPos = addWrappedText(doc, `Fecha: ${formatDate(saleDetail.date) || "N/A"}`, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, `*Tenés hasta 15 días para realizar el cambio`, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, ``, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, `N° de orden: ${saleDetail.orderNumber || 'N/A'}`, 4, yPos, maxLineWidth, lineHeight, "bold");
        yPos = addWrappedText(doc, `Cliente: ${saleDetail.client ? `${saleDetail.client.name} ${saleDetail.client.lastname}` : "Anónimo"}`, 4, yPos, maxLineWidth, lineHeight);

        if (showFinancialDetails) {
            yPos = addWrappedText(doc, `Modo de pago: ${saleDetail.paymentMethod || "N/A"}`, 4, yPos, maxLineWidth, lineHeight);
            yPos = addWrappedText(doc, `Subtotal: $${formatNumber(saleDetail.subTotal) || "0.00"}`, 4, yPos, maxLineWidth, lineHeight);
            yPos = addWrappedText(doc, `Descuento: ${saleDetail.discount}% (- $${formatNumber(saleDetail.discountApplied) || "0.00"})`, 4, yPos, maxLineWidth, lineHeight);
            yPos = addWrappedText(doc, `TOTAL: $${formatNumber(saleDetail.totalPrice) || "0.00"}`, 4, yPos, maxLineWidth, lineHeight, "bold");
            if (saleDetail.debt) {
                yPos = addWrappedText(doc, `Debe: $${formatNumber(saleDetail.debt) || "0.00"}`, 4, yPos, maxLineWidth, lineHeight);
            }
        }
        yPos += 6;

        // Productos
        if (purchasedProducts?.length) {
            yPos = addWrappedText(doc, "Productos:", 4, yPos, maxLineWidth, lineHeight, "bold");
            yPos += 2;
            purchasedProducts.forEach(product => {
                yPos = addWrappedText(doc, `• ${product.name || "Producto desconocido"}`, 4, yPos, maxLineWidth, lineHeight);
                yPos = addWrappedText(doc, `Color: ${product.selectedColor?.colorName || "N/A"}`, 4, yPos, maxLineWidth, lineHeight);
                yPos = addWrappedText(doc, `Talle: ${product.selectedSize?.sizeName || "N/A"}`, 4, yPos, maxLineWidth, lineHeight);
                if (showFinancialDetails) {
                    yPos = addWrappedText(doc, `Precio: $${formatNumber(product.price) || "0.00"}`, 4, yPos, maxLineWidth, lineHeight);
                }
                yPos += 2;
            });
        }

        // Imprimir
        openAndPrintPDF(doc);
    };

    //Ticket de ENVÍO
    const printShipmentTicket = () => {
        if (!saleDetail.shipment) return;

        const pageWidth = 58;
        const minPageHeight = 100;
        const lineHeight = 6;
        const maxLineWidth = pageWidth - 8;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: [pageWidth, minPageHeight]
        });

        const calculateLines = (text) => doc.splitTextToSize(text, maxLineWidth).length;

        // --- Calcular altura necesaria ---
        const calculateShipmentTicketHeight = () => {
            let totalHeight = 1;

            totalHeight += calculateLines("INDIRA GOLD") * lineHeight;
            totalHeight += calculateLines("Ticket de envío") * lineHeight;
            totalHeight += calculateLines(`Fecha: ${formatDate(saleDetail.date) || "N/A"}`) * lineHeight;
            totalHeight += calculateLines(`Cliente: ${saleDetail.client ? `${saleDetail.client.name} ${saleDetail.client.lastname}` : "Anónimo"}`) * lineHeight;
            totalHeight += calculateLines(`Teléfono: ${saleDetail.client?.phone || "N/A"}`) * lineHeight;
            totalHeight += calculateLines(`Dirección de envío: ${saleDetail.shipment.address || "N/A"}`) * lineHeight;
            totalHeight += calculateLines(`Costo de envío: ${formatNumber(saleDetail.shipment.amount) || "0.00"}`) * lineHeight;

            return Math.max(totalHeight, minPageHeight);
        };

        // Ajustar altura
        const pageHeight = calculateShipmentTicketHeight();
        doc.internal.pageSize.setHeight(pageHeight);

        // -------- DIBUJAR CONTENIDO --------
        let yPos = 5;

        // ENCABEZADO
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        const title = "INDIRA GOLD";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (doc.internal.pageSize.getWidth() - titleWidth) / 2, yPos);

        // Subtítulo
        yPos = 15;
        doc.setFontSize(16);
        const shipmentTitle = "Ticket de envío";
        const shipmentTitleWidth = doc.getTextWidth(shipmentTitle);
        doc.text(shipmentTitle, (doc.internal.pageSize.getWidth() - shipmentTitleWidth) / 2, yPos);

        yPos = 25;
        doc.setFontSize(12);

        // Información envío
        yPos = addWrappedText(doc, `Fecha: ${formatDate(saleDetail.date) || 'N/A'}`, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, ``, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, `Cliente: ${saleDetail.client ? `${saleDetail.client.name} ${saleDetail.client.lastname}` : "Anónimo"}`, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, `Teléfono: ${saleDetail.client?.phone || "N/A"}`, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, `Dirección de envío: ${saleDetail.shipment.address || 'N/A'}`, 4, yPos, maxLineWidth, lineHeight);
        if (showFinancialDetails) {
            yPos = addWrappedText(doc, `Costo de envío: $${formatNumber(saleDetail.shipment.amount) || '0.00'}`, 4, yPos, maxLineWidth, lineHeight, "bold");
        }

        // Imprimir
        openAndPrintPDF(doc);
    };

    const handleDelete = () => {
        const groupedProducts = {};
    
        // Agrupar productos iguales
        purchasedProducts.forEach((product) => {
            const key = `${product._id}_${product.selectedColor._id}_${product.selectedSize._id}`;
            if (!groupedProducts[key]) {
                groupedProducts[key] = { ...product, quantity: 1 };
            } else {
                groupedProducts[key].quantity += 1;
            }
        });
    
        Object.values(groupedProducts).forEach((product) => {
            // Incrementar el stock con la cantidad correcta
            dispatch(increaseStock({
                _id: product._id,
                idColor: product.selectedColor._id,
                idSize: product.selectedSize._id,
                stockToIncrease: product.quantity // Incrementar stock por la cantidad de productos iguales
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
                };
                dispatch(putRemovePurchases(clientData));
            }
        });
    
        // Eliminar la venta
        dispatch(deleteSale(id)).then(() => {
            dispatch(getSales()).then(() => {
                navigate('/');
            });
        }).catch(() => {
            dispatch(getSales()).then(() => {
                navigate('/');
            });
        });
    };

    return(
        <div className="page">
            {loading ? (
                <div className="loadingApp">
                    <LoadingScreen />
                </div>
            ) : (
                <div className="component">
                    <div className="title">
                        <h2>Detalle de la venta</h2>
                        <div className="titleButtons">
                            <button onClick={printChangeTicket}><img src={print} alt=""/></button>
                            <button onClick={() => navigate(`/main_window/sales/edit/${id}`)}>Cambio</button>
                            <button className="delete" onClick={toggleShowDeleteModal}>Eliminar</button>
                            <button onClick={() => navigate('/main_window/sales/history')}>Atrás</button>
                        </div>
                    </div>
                    <div className={`container ${style.content}`}>
                        {saleDetail.orderNumber && <div className={style.orderNumber}><span>N° de orden:</span> {saleDetail.orderNumber}</div>}
                        <div className={style.toolbar}>
                            <span>Mostrar detalles en ticket:</span>
                            <button className={style.eyeIcon} type="button" onClick={() => setShowFinancialDetails(prev => !prev)}>
                                <img src={showFinancialDetails ? visible : hide} alt=""/>
                            </button>
                        </div>
                        <div className={`${style.column} ${style.column1Width}`}>
                            <p className={style.detailRow}>
                                <span className={style.label}>Fecha:</span>
                                <span className={style.value}>{formatDate(saleDetail.date)}</span>
                            </p>
                            {saleDetail.client
                                ?  
                                    <p className={style.detailRow}>
                                        <span className={style.label}>Cliente:</span>
                                        <span className={style.value}>{saleDetail.client.dni} - {saleDetail.client.name} {saleDetail.client.lastname}</span>
                                        <a onClick={() => navigate(`/main_window/clients/${saleDetail.client._id}`)}>
                                            <img className="detailImg" src={isHovered === false ? detail : visible} alt="detail" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>
                                        </a>
                                    </p>
                                : 
                                    <p className={style.detailRow}>
                                        <span className={style.label}>Cliente:</span>
                                        <span className={style.value}>Anónimo</span>
                                    </p>
                            }
                            <p className={style.detailRow}>
                                <span className={style.label}>Modo de pago:</span>
                                <span className={style.value}>{saleDetail.paymentMethod}</span>
                            </p>
                            <p className={style.detailRow}>
                                <span className={style.label}>Tipo de venta:</span>
                                <span className={style.value}>{saleDetail.soldAt}</span>
                            </p>
                            <p className={style.detailRow}>
                                <span className={style.label}>Subtotal:</span>
                                <span className={style.value}>${saleDetail.subTotal ? formatNumber(saleDetail.subTotal) : '0'}</span>
                            </p>
                            <p className={style.detailRow}>
                                <span className={style.label}>Descuento:</span>
                                <span className={style.value}>{saleDetail.discount}% {`(- $${formatNumber(saleDetail.discountApplied)})`}</span>
                            </p>
                            <p className={style.detailRow}>
                                <span className={style.label}>Retención:</span>
                                <span className={style.value}>{saleDetail.paymentFee}% {`(- $${formatNumber(saleDetail.paymentFeeApplied)})`}</span>
                            </p>
                            <p className={style.detailRow}>
                                <span className={style.label}>Total con retención:</span>
                                <span className={style.value}>{saleDetail.totalWithFee ? `$${formatNumber(saleDetail.totalWithFee)}` : "No aplica."}</span>
                            </p>
                            <p className={style.detailRow}>
                                <span className={style.label}>Total:</span>
                                <span className={style.value}>${saleDetail.totalPrice ? formatNumber(saleDetail.totalPrice) : '0'}</span>
                            </p>
                            {saleDetail.debt ? (
                                <p className={style.detailRow}>
                                    <span className={style.label}>Adeuda:</span>
                                    <span className={style.value}>${formatNumber(saleDetail.debt)}</span>
                                </p>
                            ) : (   
                                <></>
                            )}
                            {saleDetail.shipment?.address && (
                                <>
                                    <div className={style.titleShipment}>
                                        <h2>Venta con envío</h2>
                                        <button onClick={printShipmentTicket}><img src={print} alt=""/></button>
                                    </div>
                                    <p className={style.titleAddress}>Dirección:</p>
                                    <span className={style.contentAddress}>• {saleDetail.shipment?.address}</span>
                                    <p className={style.detailRow}>
                                        <span className={style.label}>Costo de envío:</span>
                                        <span className={style.value}>${formatNumber(saleDetail.shipment?.amount)}</span>
                                    </p>
                                </>
                            )}
                        </div>
                        <div className={`${style.column} ${style.column2Width}`}>
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
                                                    {product.price &&<li><span>Precio:&nbsp;</span>${formatNumber(product.price) || '0.00'}</li>}
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
            )}
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