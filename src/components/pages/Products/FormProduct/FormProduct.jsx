import style from './FormProduct.module.css';
import x from '../../Sales/FormSales/img/x.png';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

    const categories = useSelector(state => state.categories.categories);
    const [newProduct, setNewProduct] = useState(initialProductState);
    const [name, setName] = useState('');
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [measurements, setMeasurements] = useState([]);
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
console.log(newProduct);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if(name === 'category'){
            let array = [];
            array.push(value);
            setNewProduct({
                ...newProduct,
                category: array
            });
        }else{
            setNewProduct({
                ...newProduct,
                [name]: value
            });
        }
    };

    const handleInputColorChange = (event) => {
        setNewColor(event.target.value);
    };

    const addColor = () => {
        if (newColor !== '') {
            setColors([...colors, newColor]);
            setNewColor('');
        }
    };

    const deleteColor = (index) => {
        const updatedColors = [...colors];
        updatedColors.splice(index, 1);
        setColors(updatedColors);
    };

    const handleInputSizeChange = (event) => {
        setNewSize(event.target.value);
    };

    const addSize = () => {
        if (newSize !== '') {
            setSizes([...sizes, newSize]);
            setNewSize('');
        }
    };

    const deleteSize = (index) => {
        const updatedSizes = [...sizes];
        updatedSizes.splice(index, 1);
        setSizes(updatedSizes);
    };

    const generateCombinations = () => {
        return colors.flatMap(color =>
            sizes.map(size => ({ color, size }))
        );
    };
    const combinations = generateCombinations();

    const handleStockChange = (combination, event) => {
        const { name, value } = event.target;

        // Construir una copia del nuevo estado
        const updatedProduct = { ...newProduct };

        // Encontrar el índice de color existente o añadir uno nuevo si no existe
        let colorIndex = updatedProduct.color.findIndex(item => item.colorName === combination.color);

        if (colorIndex === -1) {
            updatedProduct.color.push({
                colorName: combination.color,
                size: []
            });

            // Reasignar el índice para el color recién añadido
            colorIndex = updatedProduct.color.length - 1;
        }

        // Encontrar el índice de tamaño existente o añadir uno nuevo si no existe
        let sizeIndex = updatedProduct.color[colorIndex].size.findIndex(item => item.sizeName === combination.size);

        if (sizeIndex === -1) {
            updatedProduct.color[colorIndex].size.push({
                sizeName: combination.size,
                measurements: {
                    width: '',
                    long: '',
                    rise: ''
                },
                stock: 0
            });

            // Reasignar el índice para el tamaño recién añadido
            sizeIndex = updatedProduct.color[colorIndex].size.length - 1;
        }

        // Actualizar las medidas (width, long, rise) y el stock
        if (name === 'width' || name === 'long' || name === 'rise') {
            updatedProduct.color[colorIndex].size[sizeIndex].measurements[name] = value;
        } else if (name === 'stock' && value > 0) {
            updatedProduct.color[colorIndex].size[sizeIndex].stock = value;
        }

        // Actualizar el estado
        setNewProduct(updatedProduct);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // const productData = {
        //     name: name,
        //     color: colors.map((color, index) => ({
        //         colorName: color,
        //         size: sizes.map((size, idx) => ({
        //             sizeName: size,
        //             measurements: measurements[idx],
        //             code: '000', // Ajustar según sea necesario
        //             stock: 0 // Ajustar según sea necesario
        //         })),
        //         imageGlobal: '' // Ajustar según sea necesario
        //     })),
        //     price: price,
        //     category: category,
        //     description: description
        // };

        // dispatch(postProduct(productData));

        // // Reiniciar el formulario después de enviar
        // setName('');
        // setColors([]);
        // setSizes([]);
        // setMeasurements([]);
        // setPrice(0);
        // setCategory('');
        // setDescription('');
    };


    return (
        <div className="component">
            <div className="title">
                <h2>NUEVO PRODUCTO</h2>
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
                                        {colors.map((color, colorIndex) => (
                                            <li key={colorIndex} className={style.list}>
                                                <span className={style.spanList}>{color}</span>
                                                <button type="button" className={style.buttonDelete} onClick={() => deleteColor(colorIndex)}>
                                                    <img src={x} alt="x" />
                                                </button>
                                            </li>
                                        ))}
                                    </ol>
                                    <input className={style.inputAddColor} type="text" name="color" value={newColor} onChange={handleInputColorChange} placeholder='Agregar' />
                                    <button type="button" className={style.buttonAdd} onClick={addColor}>+</button>
                                </div>
                            </div>
                            <div className={style.sizeContainer}>
                                <label htmlFor="size">Talle</label>
                                <div className={style.sizeCard}>
                                    <ol>
                                        {sizes.map((size, index) => (
                                            <li key={index} className={style.list}>
                                                <span className={style.spanList}>{size}</span>
                                                <button type="button" className={style.buttonDelete} onClick={() => deleteSize(index)}>
                                                    <img src={x} alt="x" />
                                                </button>
                                            </li>
                                        ))}
                                    </ol>
                                    <input className={style.inputAddSize} type="text" name="size" value={newSize} onChange={handleInputSizeChange} placeholder='Agregar' />
                                    <button type="button" className={style.buttonAdd} onClick={addSize}>+</button>
                                </div>
                            </div>
                        </div>
                        <div className={style.stockContainer}>
                            <label htmlFor="color">Medidas y stock</label>
                            <div className={style.stockCard}>
                            <ol>
                                {combinations.map((combination, index) => (
                                    <li key={index} className={style.list}>
                                        <span className={style.spanList}>
                                            Color {combination.color} - Talle {combination.size}
                                        </span>
                                        <span className={style.spansinMed} htmlFor="width">Ancho:</span>
                                        <input className={style.inputsinMed} type="number" name="width" placeholder='0' onChange={(event) => handleStockChange(combination, event)} />
                                        <span className={style.spansinMed} htmlFor="long">Largo:</span>
                                        <input className={style.inputsinMed} type="number" name="long" placeholder='0' onChange={(event) => handleStockChange(combination, event)} />
                                        <span className={style.spansinMed} htmlFor="rise">Tiro:</span>
                                        <input className={style.inputsinMed} type="number" name="rise" placeholder='0' onChange={(event) => handleStockChange(combination, event)} />
                                        <span className={style.spansinMed} htmlFor="stock">Stock:</span>
                                        <input className={style.inputsinStock} type="number" name="stock" placeholder='0' onChange={(event) => handleStockChange(combination, event)} />
                                    </li>
                                ))}
                            </ol>
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
                    </div>
                    <div className={style.column2}>
                        <div className={style.imageContainer}>
                            <label htmlFor="image">Imágenes</label>
                            <div className={style.imageCard}>
                                <ol>
                                    {colors?.map((color, index) => (
                                        <li key={index} className={style.list}>
                                            <span className={style.spanList}>{color}</span>
                                        </li>
                                    ))}
                                </ol>                                                
                            </div>
                        </div>
                        <div className={style.categoryContainer}>
                            <label htmlFor="category" className={style.nameTitle}>Categoría</label>
                            <select name="category" className={style.selectCategory} value={newProduct.category} onChange={handleInputChange}>
                                <option value="" disabled>Seleccionar</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={style.priceContainer}>
                            <label htmlFor="price" className={style.nameTitle}>Precio $</label>
                            <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder='0'/>
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