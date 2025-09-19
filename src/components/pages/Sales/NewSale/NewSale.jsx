import style from './NewSale.module.css';
import print from "../../../../assets/img/print.png";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientById } from "../../../../redux/clientActions";
import jsPDF from 'jspdf';

const NewSale = ({ saleResponse, debtAmount, showFinancialDetails }) => {

    if (!saleResponse?.data) return null;

    const { client, paymentMethod, installments, discount, products, orderNumber, subTotal, totalPrice, date, shipment } = saleResponse.data;

    const dispatch = useDispatch();

    useEffect(() => {
        if(client){
            dispatch(getClientById(client));
        }
    }, [client])

    const clientById = useSelector(state => state.clients.clientDetail);

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

    //Ticket de ENVÍO
    const printShipmentTicket = () => {
        if (!shipment) return;

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
            totalHeight += calculateLines(`Fecha: ${formatDate(date) || "N/A"}`) * lineHeight;
            totalHeight += calculateLines(`Cliente: ${clientById ? `${clientById.name} ${clientById.lastname}` : 'Anónimo'}`) * lineHeight;
            totalHeight += calculateLines(`Teléfono: ${clientById ? `${clientById.phone}` : 'N/A'}`) * lineHeight;
            totalHeight += calculateLines(`Dirección de envío: ${shipment.address || "N/A"}`) * lineHeight;
            totalHeight += calculateLines(`Costo de envío: ${formatNumber(shipment.amount) || "N/A"}`) * lineHeight;

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
        yPos = addWrappedText(doc, `Fecha: ${formatDate(date) || 'N/A'}`, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, ``, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, `Cliente: ${clientById ? `${clientById.name} ${clientById.lastname}` : "Anónimo"}`, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, `Teléfono: ${clientById?.phone || "N/A"}`, 4, yPos, maxLineWidth, lineHeight);
        yPos = addWrappedText(doc, `Dirección de envío: ${shipment.address || 'N/A'}`, 4, yPos, maxLineWidth, lineHeight);
        if (showFinancialDetails) {
            yPos = addWrappedText(doc, `Costo de envío: $${formatNumber(shipment.amount) || '0.00'}`, 4, yPos, maxLineWidth, lineHeight, "bold");
        }

        // Imprimir
        openAndPrintPDF(doc);
    };

    return (
        <div className={style.content}>
            <div className={style.orderNumber}><span>N° de orden:</span> {orderNumber}</div>
            <div className={`${style.column} ${style.column1Width}`}>
                <p><span className={style.key}>Fecha:</span> {formatDate(date)}</p>
                <p><span className={style.key}>Cliente:</span> {client ? `${clientById.dni} - ${clientById.name} ${clientById.lastname}` : "Anónimo"}</p>
                <p><span className={style.key}>Método de Pago:</span> {paymentMethod}</p>
                <p><span className={style.key}>Cuotas:</span> {installments}</p>
                {shipment !== null && (
                    <>
                        <div className={style.titleShipment}>
                            <h2>Venta con envío</h2>
                            <button onClick={printShipmentTicket}><img src={print} alt=""/></button>
                        </div>
                        <p className={style.titleAddress}>Dirección:</p>
                        <span className={style.contentAddress}>• {shipment?.address}</span>
                        <p><span className={style.key}>Costo de envío:</span> ${formatNumber(shipment?.amount)}</p>
                    </>
                )}
            </div>
            <div className={`${style.column} ${style.column2Width}`}>
                <p><span className={style.key}>Productos comprados:</span> {products?.length}</p>
                <p><span className={style.key}>Subtotal:</span> ${formatNumber(subTotal)}</p>
                <p><span className={style.key}>Descuento:</span> {discount}%</p>
                <p><span className={style.key}>Total:</span> ${formatNumber(totalPrice)}</p>
                {debtAmount > 0 && (
                    <>
                        <p><span className={style.key}>Abonó:</span> ${formatNumber(totalPrice - debtAmount)}</p>
                        <p><span className={style.key}>Adeuda:</span> ${formatNumber(debtAmount)}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewSale;
