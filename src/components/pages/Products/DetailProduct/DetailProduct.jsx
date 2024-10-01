import style from './DetailProduct.module.css';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import iconPDF from "../../../../assets/img/pdf.png";
import React, { useEffect, useState, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, putProductStatus } from '../../../../redux/productActions.js';


const DetailProduct = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Crear referencias para los códigos de barras
    const barcodeRefs = useRef({});

    const productDetail = useSelector(state => state.products.productDetail);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    const handleModifyStatus = () => {
        dispatch(putProductStatus(id));
        navigate('/main_window/products/management');
    };

    const generatePDF = () => {
        const doc = new jsPDF('portrait', 'mm', 'a4'); // Configurar el documento en A4
    
        const barcodeCanvas = barcodeRefs.current[productDetail._id];
    
        // Verifica que el canvas tenga un código de barras generado
        if (barcodeCanvas) {
            const imgData = barcodeCanvas.toDataURL("image/png");
    
            // Dimensiones originales del canvas del código de barras
            const originalWidth = barcodeCanvas.width;
            const originalHeight = barcodeCanvas.height;
    
            // Dimensiones de la página A4
            const pageWidth = 210; // mm
            const pageHeight = 297; // mm
    
            // Configurar el ancho de cada código de barras en 70 mm
            const barcodeWidth = 70;
            const barcodeHeight = (originalHeight / originalWidth) * barcodeWidth; // Mantener proporción
    
            // Definir márgenes y espacio entre códigos
            const margin = 10; // mm
            const spaceBetween = 10; // Espacio entre códigos en mm
    
            // Calcular cuántos códigos de barras caben en una fila y cuántas filas
            const codesPerRow = Math.floor((pageWidth - 2 * margin) / (barcodeWidth + spaceBetween));
            const codesPerColumn = Math.floor((pageHeight - 2 * margin) / (barcodeHeight + spaceBetween));
    
            let currentX = margin;
            let currentY = margin;
    
            // Agregar tantos códigos de barras como quepan en la página
            for (let row = 0; row < codesPerColumn; row++) {
                for (let col = 0; col < codesPerRow; col++) {
                    // Agregar el código de barras al PDF
                    doc.addImage(imgData, 'PNG', currentX, currentY, barcodeWidth, barcodeHeight);
    
                    // Actualizar la posición horizontal para el siguiente código de barras
                    currentX += barcodeWidth + spaceBetween;
    
                    // Si es la última columna de la fila, saltar a la siguiente fila
                    if (col === codesPerRow - 1) {
                        currentX = margin;
                        currentY += barcodeHeight + spaceBetween;
                    }
                }
    
                // Si se llega al final de la página, agregar una nueva página
                if (row === codesPerColumn - 1) {
                    doc.addPage();
                    currentX = margin;
                    currentY = margin;
                }
            }
    
            // Guardar el PDF
            doc.save(`${productDetail.name} - Códigos De Barras.pdf`);
        }
    };
    

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (productDetail && productDetail.color) {
            productDetail.color.forEach(color => {
                color.size.forEach(size => {
                    const barcodeId = productDetail._id;
                    const productName = productDetail.name;

                    if (barcodeRefs.current[barcodeId]) {
                        JsBarcode(barcodeRefs.current[barcodeId], barcodeId, { 
                            format: 'CODE128',
                            text: productName 
                        });
                    }
                });
            });
        }
    }, [productDetail]);

    return(
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>Detalle del producto</h2>
                    <div className="titleButtons">
                        <button onClick={generatePDF}><img src={iconPDF} alt=""/></button>
                        {productDetail.active ? <button onClick={() => navigate(`/main_window/products/edit/${id}`)}>Editar</button> : ''}
                        {!productDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Añadir</button> : <button className="delete" onClick={toggleShowDeleteModal}>Eliminar</button>}
                        <button onClick={() => navigate(`/main_window/products/management`)}>Atrás</button>
                    </div>
                </div>
                <div className={`container ${style.content}`}>
                    {!productDetail.active && <div className={style.productInactive}><span>Este producto ha sido eliminado</span></div>}
                    {productDetail.name && <div className={!productDetail.active ? style.nameProductInactive : style.nameProduct}><span>{productDetail.name}</span></div>}
                    <div className={!productDetail.active ? style.columnInactive : style.column}>
                        <div className={style.containerImgProduct}>
                            {productDetail.imageGlobal 
                            ? <img className={style.imgProduct} src={productDetail.imageGlobal || imgProduct} alt="Product Image"/> 
                            : productDetail.color?.map(color => (
                                color.image 
                                ? (<img key={color.image} className={style.imgProduct} src={color.image} alt="Product Image" />) 
                                : <img src={imgProduct} className={style.imgProduct} alt="Product Image" />
                            ))}                          
                        </div>                      
                        <p><span>Precio:&nbsp;</span>${productDetail.price}</p>
                        <p><span>Categoría:&nbsp;</span>{(productDetail.category && productDetail.category.length > 0) ? productDetail.category[0].name : 'No tiene categoría'}</p>
                        <canvas 
                            className={style.barcodeCanvas}
                            ref={el => barcodeRefs.current[productDetail._id] = el} 
                        />
                        {productDetail.description ? <p><span>Descripción:&nbsp;</span>{productDetail.description}</p> : ''}
                        {productDetail.supplier && productDetail.supplier.name.trim() !== '' || productDetail.supplier && productDetail.supplier.phone.trim() !== ''  
                        ? (
                            <div className={style.containerSupplier}>
                                <p><span>Proveedor:</span></p>
                                <li><span>Nombre:&nbsp;</span>{productDetail.supplier.name}</li>
                                <li><span>Teléfono:&nbsp;</span>{productDetail.supplier.phone}</li>
                            </div> 
                        ) : <span className={style.messageSupplier}>No hay información del proveedor.</span>}
                    </div>
                    <div className={!productDetail.active ? style.columnInactive : style.column}>
                        {productDetail.color?.map(color => (
                            <div className={style.colorSection}>
                                <p className={style.colorTag}><span>Color:&nbsp;</span>{color.colorName}</p>
                                <div className={style.containerColor}>                  
                                    {color.size.map(size => (
                                        <div key={size.sizeName} className={style.sizeBlock}>
                                            <p><span>Talle:&nbsp;</span>{size.sizeName}</p>   
                                            <p><span>Stock:&nbsp;</span>{size.stock}</p>                                           
                                            <p><span>Medidas:</span></p>
                                            <li><span>Ancho:&nbsp;</span>{size.measurements[0].width ? size.measurements[0].width : '-'}</li>
                                            <li><span>Largo:&nbsp;</span>{size.measurements[0].long ? size.measurements[0].long : '-'}</li>
                                            <li><span>Tiro:&nbsp;</span>{size.measurements[0].rise ? size.measurements[0].rise : '-'}</li>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {!productDetail.active 
            ? (
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea añadir este producto?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleModifyStatus} className="add">Añadir</button>
                    </div>
                </div>
            </div>
            ) : (
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea eliminar este producto?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleModifyStatus} className="delete">Eliminar</button>
                    </div>
                </div>
            </div>)}            
        </div>
    );
};

export default DetailProduct;