import style from './FormProduct.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import x from '../../Sales/FormSales/img/x.png';



const FormProduct = () => {
    
    const initialProductState = {
        name: '',
        color: [{
            colorName: '',
            size: [{
                sizeName:'',
                measurements: [{
                    width: '',
                    long: '',
                    rise: ''
                }],
                code: '',
                stock: 0
            }],
            imageGlobal: ''
        }],
        price: 0,
        category: [],
        description: ''
    };
    const [newProduct, setNewProduct] = useState(initialProductState);


    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [measurements, setMeasurements] = useState([]);
    const [newMeasurements, setNewMeasurements] = useState({width:'', long:'', rise:''});
// console.log(measurements);

    //------------COLOR-----------------//
    const handleInputColorChange = (event) => {
        setNewColor(event.target.value);
    };  
    const addColor = () => {
        if(newColor.trim() !== ''){
            setColors([...colors, newColor]);
            setNewColor('');
        };
    };
    const deleteColor = (index) => {
        const updatedColors = colors.filter((_, i) => i !== index);
        setColors(updatedColors);
    };

    //------------TALLE-----------------//
    const handleInputSizeChange = (event) => {
        setNewSize(event.target.value);
    };
    const addSize = () => {
        if(newSize.trim() !== ''){
            setSizes([...sizes, newSize]);
            setNewSize('');
        };
    };
    const deleteSize = (index) => {
        const updatedSizes = sizes.filter((_, i) => i !== index);
        setSizes(updatedSizes);
    };

    //------------MEDIDAS----------------//
    const handleInputMeasurementsChange = (event) => {
        const { name, value } = event.target;
        setNewMeasurements((prevState) => ({
            ...prevState,
            [name]: name === "width" || name === "long" || name === "rise" ? String(value) : value,
        }));
    };
    const addMeasurements = () => {
        if(newMeasurements.width !== '' && newMeasurements.long !== '' && newMeasurements.rise !== ''){
            setMeasurements([...measurements, newMeasurements]);
            setNewMeasurements({width:'', long:'', rise:''});
        };
    };
    const deleteMeasurements = (index) => {
        const updatedMeasurements = measurements.filter((_, i) => i !== index);
        setMeasurements(updatedMeasurements);
    };

    

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return(
        <div className="component">
            <div className="title">
                <h2>NUEVA PRODUCTO</h2>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit} className={style.productForm}>
                    <div className={style.column1}>
                        <div>
                            <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                            <input type="text" name="name" className={style.inputName}/>
                        </div>
                        <div className={style.detailProduct}>
                            <div className={style.colorContainer}>
                                <label htmlFor="color">Colores</label>
                                <div className={style.colorCard}>
                                    <ol>
                                        {colors?.map((color, index) => (
                                            <li key={index} className={style.list}>
                                                <span className={style.spanList}>{color}</span>
                                                <button className={style.buttonDelete} onClick={() => deleteColor(index)}>
                                                    <img src={x} alt="x"/>
                                                </button>
                                            </li>
                                        ))}
                                    </ol> 
                                    <input className={style.inputAddColor} type="text" name="color" value={newColor} onChange={handleInputColorChange} placeholder='Agregar'/>      
                                    <button className={style.buttonAdd} onClick={addColor}>+</button>                                                  
                                </div>
                            </div>
                            <div className={style.sizeContainer}> 
                                <label htmlFor="size">Talle</label>
                                <div className={style.sizeCard}>
                                    <ol>
                                        {sizes?.map((size, index) => (
                                            <li key={index} className={style.list}>
                                                <span className={style.spanList}>{size}</span>
                                                <button className={style.buttonDelete} onClick={() => deleteSize(index)}>
                                                    <img src={x} alt="x"/>
                                                </button>
                                            </li>
                                        ))}
                                    </ol> 
                                    <input className={style.inputAddSize} type="text" name="size" value={newSize} onChange={handleInputSizeChange} placeholder='Agregar'/>      
                                    <button className={style.buttonAdd} onClick={addSize}>+</button>                                                  
                                </div>                 
                            </div> 
                            <div className={style.measurementContainer}>
                                <label htmlFor="measurements">Medidas</label>
                                <div className={style.measurementCard}>
                                    <ol>
                                        {measurements?.map((measurement, index) => (
                                            <li key={index} className={style.list}>
                                                <span className={style.spanList}>
                                                    Ancho: {measurement.width}, Largo: {measurement.long}, Tiro: {measurement.rise}
                                                </span>
                                                <button className={style.buttonDelete} onClick={() => deleteMeasurements(index)}>
                                                    <img src={x} alt="x"/>
                                                </button>
                                            </li>
                                        ))}
                                    </ol> 
                                    <div className={style.inputsMeasurement}>
                                        <div className={style.inputslabels}>
                                            <label htmlFor="width" className={style.labelsMeasurement}>Ancho</label>
                                            <input type="number" name="width" value={newMeasurements.width} onChange={handleInputMeasurementsChange} placeholder='0'/>
                                        </div>
                                        <div className={style.inputslabels}>
                                            <label htmlFor="long" className={style.labelsMeasurement}>Largo</label>
                                            <input type="number" name="long" value={newMeasurements.long} onChange={handleInputMeasurementsChange} placeholder='0'/>
                                        </div>
                                        <div className={style.inputslabels}>    
                                            <label htmlFor="rise" className={style.labelsMeasurement}>Tiro</label>
                                            <input type="number" name="rise" value={newMeasurements.rise} onChange={handleInputMeasurementsChange} placeholder='0'/>
                                        </div>
                                        <div className={style.buttonAddMeasurement}>
                                            <button className={style.buttonAdd} onClick={addMeasurements}>+</button>
                                        </div>                          
                                    </div>
                                </div>                 
                            </div>                           
                        </div>
                        <div className={style.stockContainer}>
                            <label htmlFor="color">Stock</label>
                            <div className={style.stockCard}>
                                <ol>
                                    {colors?.map((color, index) => (
                                        <li key={index} className={style.list}>
                                            <span className={style.spanList}>{color}</span>
                                            <button className={style.buttonDelete} onClick={() => deleteColor(index)}>
                                                <img src={x} alt="x"/>
                                            </button>
                                            <input type="number" name="stock" placeholder='0'/>   
                                        </li>
                                    ))}
                                </ol> 
                            </div>
                        </div>    
                        <div className={style.supplierContainer}>
                            <label htmlFor="supplier" className={style.supplierTitle}>Proveedor</label>
                            <div className={style.dataSupplierContainer}>
                                <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                                <input type="text" name="name" className={style.inputName}/>
                            </div>
                            <div>
                                <label htmlFor="phone" className={style.nameTitle}>Teléfono</label>
                                <input type="text" name="phone" className={style.inputName}/>
                            </div>
                        </div>    
                    </div>
                    <div className={style.column2}>
                        <div className={style.imageContainer}>
                            <label htmlFor="image">Imágenes</label>
                            <div className={style.imageCard}>
                                <ol>
                                    {colors?.map((color, index) => (
                                        <li key={index} className={style.list}>
                                            <span className={style.spanList}>{color}</span>
                                            <button className={style.buttonDelete} onClick={() => deleteColor(index)}>
                                                <img src={x} alt="x"/>
                                            </button>
                                        </li>
                                    ))}
                                </ol>                                                
                            </div>
                        </div>      
                        <div className={style.categoryContainer}>
                            <label htmlFor="category" className={style.nameTitle}>Categoría</label>
                            <input type="text" name="category" className={style.inputName}/>
                        </div>   
                        <div className={style.priceContainer}>
                            <label htmlFor="price" className={style.nameTitle}>Precio</label>
                            <input type="text" name="price" className={style.inputName}/>
                        </div>     
                        <div className={style.descriptionContainer}>
                            <label htmlFor="description" className={style.nameTitle}>Descripción</label>
                            <textarea type="text" name="description"/>
                        </div> 
                        <div>
                            <button>Agregar</button>
                        </div>        
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormProduct;