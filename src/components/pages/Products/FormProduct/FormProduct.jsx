import style from './FormProduct.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import x from '../../Sales/FormSales/img/x.png';
import { postProduct } from '../../../../redux/productActions';


const FormProduct = () => {

    const dispatch = useDispatch();
    
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
    const [newColorName, setNewColorName] = useState('');
    const [newSizeName, setNewSizeName] = useState('');
    // console.log(newProduct);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setNewProduct({
            ...newProduct,
            [name]: value
        });
    };

    const handleColorChange = (index, event) => {
        const { value } = event.target;
        const updatedColors = [...newProduct.color];
        updatedColors[index].colorName = value;

        setNewProduct({
            ...newProduct,
            color: updatedColors
        });
    };

    const handleSizeChange = (index, event) => {
        const { value } = event.target;
        const updatedSizes = [...newProduct.color];
        updatedSizes[index].size[0].sizeName = value;

        setNewProduct({
            ...newProduct,
            color: updatedSizes
        });
    };

    const categories = useSelector(state => state.categories.categories);
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [measurements, setMeasurements] = useState([]);
    const [newMeasurements, setNewMeasurements] = useState({width:'', long:'', rise:''});
    const [stock, setStock] = useState([]);
    const [newStock, setNewStock] = useState(0);
    const [category, setCategory] = useState([]);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
// console.log(category);

    //------------ COLOR -----------------//  
    // const addColor = () => {
    //     // if(newColor.trim() !== ''){
    //     //     setColors([...colors, newColor]);
    //     //     setNewColor('');
    //     // };
    //     setNewProduct({...newProduct,color: [...newProduct.color, 
    //         {
    //             colorName: '',
    //             size: [{
    //                 sizeName: '',
    //                 measurements: [{
    //                     width: '',
    //                     long: '',
    //                     rise: ''
    //                 }],
    //                 code: '',
    //                 stock: 0
    //             }],
    //             image: ''
    //         }]
    //     });
    // };
    // const deleteColor = (index) => {
    //     const updatedColors = colors.filter((_, i) => i !== index);
    //     setColors(updatedColors);
    // };

    const addColor = () => {
        setNewProduct({
            ...newProduct,
            color: [
                ...newProduct.color,
                {
                    colorName: newColorName,
                    size: [{
                        sizeName: '',
                        measurements: {
                            width: '',
                            long: '',
                            rise: ''
                        },
                        code: '',
                        stock: 0
                    }],
                    imageGlobal: ''
                }
            ]
        });
        setNewColorName(''); // Limpiar el input de nuevo color después de agregar
    };
    
    const deleteProduct = (index) => {
        const updatedColors = [...newProduct.color];
        updatedColors.splice(index, 1);

        setNewProduct({
            ...newProduct,
            color: updatedColors
        });
    };

    //------------ TALLE -----------------//

    const addSize = () => {
        setNewProduct({
            ...newProduct,
            color: [
                ...newProduct.color,
                {
                    colorName: '',
                    size: [{
                        sizeName: newSizeName,
                        measurements: {
                            width: '',
                            long: '',
                            rise: ''
                        },
                        code: '',
                        stock: 0
                    }],
                    imageGlobal: ''
                }
            ]
        });
        setNewSizeName(''); 
    };
    // const addSize = () => {
    //     if(newSize.trim() !== ''){
    //         setSizes([...sizes, newSize]);
    //         setNewSize('');
    //     };
    // };
    const deleteSize = (index) => {
        const updatedSizes = [...newProduct.color[index].size];
        updatedSizes.splice(index, 1);
        setNewProduct({
            ...newProduct,
            color: updatedSizes
        });
    };

    //------------ MEASUREMENTS ----------------//
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

    //------------ STOCK ----------------//
    const handleInputStockChange = (event) => {
        setNewStock(event.target.value);
    };
    const addStock = () => {
        if(newStock !== 0){
            setStock([...stock, newStock]);
            setNewStock(0);
        };
    };

    //------------ CATEGORY ----------------//
    const handleCategoryChange = (event) => {
        // console.log(event);
        setCategory(event.target.value);
    };

    //------------ PRICE ----------------//
    const handleInputPriceChange = (event) => {
        setPrice(event.target.value);
    };

    //------------ DESCRIPTION ----------------//
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };



    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     // const productData = {...newProduct};
    //     // dispatch(postProduct(productData));
    // };
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(postProduct(newProduct)); // Enviar el producto al store o realizar la acción correspondiente
        setNewProduct(initialProductState); // Limpiar el formulario después de enviar
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
                            <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} className={style.inputName}/>
                        </div>
                        <div className={style.detailProduct}>
                            <div className={style.colorContainer}>
                                <label htmlFor="color">Colores</label>
                                <div className={style.colorCard}>
                                <ol>
                                    {newProduct?.color.map((color, colorIndex) => (
                                        <li key={colorIndex} className={style.list}>
                                            <input
                                                type="text"
                                                value={color.colorName}
                                                onChange={(event) => handleColorChange(colorIndex, event)}
                                                className={style.inputColorName}
                                            />                                              
                                            <button className={style.buttonDelete} type="button" onClick={() => deleteProduct(colorIndex)}>
                                                <img src={x} alt="x"/>
                                            </button>
                                        </li>
                                    ))}
                                </ol> 
                                <input
                                    className={style.inputAddColor}
                                    type="text"
                                    value={newColorName}
                                    onChange={(event) => setNewColorName(event.target.value)}
                                    placeholder='Agregar'
                                />       
                                <button className={style.buttonAdd} type="button" onClick={addColor}>+</button>                                             
                                </div>
                            </div>
                            <div className={style.sizeContainer}> 
                                <label htmlFor="size">Talle</label>
                                <div className={style.sizeCard}>
                                    <ol>
                                        {newProduct?.color.map((color, index) => (
                                            <li key={index} className={style.list}>
                                                <input
                                                type="text"
                                                value={color.size[0].sizeName}
                                                onChange={(event) => handleSizeChange(index, event)}
                                                className={style.inputsizeName}
                                                />
                                                <button className={style.buttonDelete} type="button" onClick={() => deleteProduct(index)}>
                                                <img src={x} alt="x"/>
                                            </button>
                                            </li>
                                        ))}
                                    </ol> 
                                    <input
                                    className={style.inputAddSize}
                                    type="text"
                                    value={newSizeName}
                                    onChange={(event) => setNewSizeName(event.target.value)}
                                    placeholder='Agregar'
                                    />       
                                    <button className={style.buttonAdd} type="button" onClick={addSize}>+</button>                                                 
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
                                            <span className={style.spanList}>Color {color} - Talle {sizes[index]}</span>
                                            {/* <button className={style.buttonDelete} onClick={() => deleteColor(index)}>
                                                <img src={x} alt="x"/>
                                            </button> */}
                                            <input type="number" name="stock" placeholder='0' value={newStock} onChange={handleInputStockChange}/>   
                                        </li>
                                    ))}
                                </ol> 
                            </div>
                        </div>    
                        {/* <div className={style.supplierContainer}>
                            <label htmlFor="supplier" className={style.supplierTitle}>Proveedor</label>
                            <div className={style.dataSupplierContainer}>
                                <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                                <input type="text" name="name" className={style.inputName}/>
                            </div>
                            <div>
                                <label htmlFor="phone" className={style.nameTitle}>Teléfono</label>
                                <input type="text" name="phone" className={style.inputName}/>
                            </div>
                        </div>     */}
                    </div>
                    <div className={style.column2}>
                        {/* <div className={style.imageContainer}>
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
                        </div>       */}
                        <div className={style.categoryContainer}>
                            <label htmlFor="category" className={style.nameTitle}>Categoría</label>
                            <select name="category" className={style.selectCategory}>
                                <option value="" disabled selected>Seleccionar</option>
                                {categories?.map((category, index) => (
                                    <option key={index} value={category._id} onChange={handleCategoryChange}>{category.name}</option>
                                ))}
                                {/* <option value="">Agregar</option> */}
                            </select>
                            {/* <input type="text" name="category" className={style.inputName}/> */}
                        </div>   
                        <div className={style.priceContainer}>
                            <label htmlFor="price" className={style.nameTitle}>Precio $</label>
                            <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} className={style.inputName}/>
                        </div>     
                        <div className={style.descriptionContainer}>
                            <label htmlFor="description" className={style.nameTitle}>Descripción</label>
                            <textarea type="text" name="description" value={newProduct.description} onChange={handleInputChange}/>
                        </div> 
                        <div>
                            <button type="submit">Agregar</button>
                        </div>        
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormProduct;