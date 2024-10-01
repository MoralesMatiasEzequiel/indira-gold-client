import style from './FormProduct.module.css';
import iconClear from '../../../../assets/img/clearForm.png';
import x from '../../Sales/FormSales/img/x.png';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormCategory from '../FormCategory/FormCategory.jsx';
import { getCategories } from '../../../../redux/categoryActions.js';
import { postProduct, uploadImageToImgur } from '../../../../redux/productActions.js';
import imageCompression from 'browser-image-compression';
import { ToastContainer, toast } from 'react-toastify';

const FormProduct = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialProductState = {
        name: '',
        color: [],
        supplier: {
            name: '',
            phone: ''
        },
        price: '',
        category: [],
        description: ''
    };

    useEffect(() => {
        dispatch(getCategories());
        validateForm();
    }, [dispatch]);

    const categories = useSelector(state => state.categories.categories);
    
    const [newProduct, setNewProduct] = useState(initialProductState);
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [selectedOptionImage, setSelectedOptionImage] = useState('unique');
    const [imageGlobal, setImageGlobal] = useState(null);
    const [imagePreview, setImagePreview] = useState(imgProduct);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [imageLoading, setImageLoading] = useState(false);
    const [isClearDisabled, setIsClearDisabled] = useState(true);

//console.log(newProduct); 

    const handleSetForm = () => {
        setNewProduct(initialProductState);
        setColors([]);
        setSizes([]);
        setImageGlobal(null);
        setIsSubmitDisabled(true);
        setIsClearDisabled(true);
    };

    const validateForm = () => {
        const isProductNameValid = newProduct.name.trim() !== '';
        const isColorValid = colors.length > 0;
        const isSizeValid = sizes.length > 0;
        const isCategoryValid = newProduct.category.length > 0;
        const isPriceValid = newProduct.price > 0;

        // Validar que al menos una combinación de color y talla tenga stock mayor a 0
        const hasAtLeastOneValidStock = combinations.some(combination => {
            const color = newProduct.color.find(c => c.colorName === combination.color);
            const size = color ? color.size.find(s => s.sizeName === combination.size) : null;
            return size ? size.stock > 0 : false;
        });

        setIsSubmitDisabled(!(isProductNameValid && isColorValid && isSizeValid && isCategoryValid && isPriceValid && hasAtLeastOneValidStock));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (event.target.value) {
            setIsClearDisabled(false);
        }

        if(name === 'name'){
            setNewProduct({
                ...newProduct,
                name: value
            });
        };
        if(name === 'price'){
            let priceNumber = Number(value);
            setNewProduct({
                ...newProduct,
                price: priceNumber
            });
            validateForm();
        };
        if(name === 'category'){
            let array = [];
            array.push(value);
            setNewProduct({
                ...newProduct,
                category: array
            });
        };
        if(name === 'description'){
            setNewProduct({
                ...newProduct,
                description: value
            });
        };
        validateForm();
    };

    const handleKeyDown = (event) => {
        if (event.target.value) {
            setIsClearDisabled(false);
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            addColor();
            addSize();
        };
    };

    //-----------COLOR-----------//
    const handleInputColorChange = (event) => {
        if(event.target.value) {
            setIsClearDisabled(false);
        }
        setNewColor(event.target.value);
    };

    const addColor = () => {
        if (newColor !== '') {
            // Añadir el nuevo color
            const updatedProduct = { ...newProduct };
            updatedProduct.color.push({
                colorName: newColor,
                size: [], // Inicialmente vacío
                image: ''
            });
            setNewProduct(updatedProduct);
            setColors([...colors, newColor]); // Actualiza el estado local de colores
            setNewColor('');
            validateForm();
        }
    };
    
    const deleteColor = (index) => {
        const updatedColors = [...colors];
        const colorToDelete = updatedColors[index]; 
        updatedColors.splice(index, 1);
        setColors(updatedColors);
    
        const filteredProductsColor = newProduct.color.filter(item => item.colorName !== colorToDelete);
    
        setNewProduct({
            ...newProduct,
            color: filteredProductsColor
        });
        validateForm();
    };

    //-----------SIZE-----------//
    const handleInputSizeChange = (event) => {
        if(event.target.value) {
            setIsClearDisabled(false);
        }
        setNewSize(event.target.value);
    };
    const addSize = () => {
        if (newSize !== '') {
            const updatedProduct = { ...newProduct };
    
            // Asegúrate de que cada color tenga este nuevo tamaño
            updatedProduct.color.forEach(color => {
                const sizeExists = color.size.some(size => size.sizeName === newSize);
                if (!sizeExists) {
                    color.size.push({
                        sizeName: newSize,
                        measurements: {
                            width: '',
                            long: '',
                            rise: ''
                        },
                        code: '',
                        stock: 0 // Inicializa en 0
                    });
                }
            });
    
            setNewProduct(updatedProduct);
            setSizes([...sizes, newSize]); // Actualiza el estado local de tamaños
            setNewSize('');
            validateForm();
        }
    };
    

    const deleteSize = (index) => {
        const updatedSizes = [...sizes];
        const sizeToDelete = updatedSizes[index];
        updatedSizes.splice(index, 1);
        setSizes(updatedSizes);
    
        // Eliminar el tamaño de todos los colores
        const updatedProductColors = newProduct.color.map(color => ({
            ...color,
            size: color.size.filter(size => size.sizeName !== sizeToDelete)
        }));
    
        setNewProduct({
            ...newProduct,
            color: updatedProductColors
        });
        validateForm();
    };
    

    //-----------COMBINACION(COLOR/SIZE)-----------//
    const generateCombinations = () => {
        return colors.flatMap(color =>
            sizes.map(size => ({ color, size }))
        );
    };
    
    const combinations = generateCombinations();

    const handleStockChange = (combination, event) => {
        const { name, value } = event.target;
        const updatedProduct = { ...newProduct };
        const sizeToUpdate = combination.size;
    
        // Se encuentra el índice de color existente
        let colorIndex = updatedProduct.color.findIndex(item => item.colorName === combination.color);
    
        // Si el color no existe, lo añadimos
        if (colorIndex === -1) {
            updatedProduct.color.push({
                colorName: combination.color,
                size: [],
                image: ''
            });
            colorIndex = updatedProduct.color.length - 1;
        }
    
        // Verificar el índice del tamaño
        let sizeIndex = updatedProduct.color[colorIndex].size.findIndex(item => item.sizeName === combination.size);
    
        // Si el tamaño no existe, lo añadimos
        if (sizeIndex === -1) {
            updatedProduct.color[colorIndex].size.push({
                sizeName: combination.size,
                measurements: {
                    width: '',
                    long: '',
                    rise: ''
                },
                code: '',
                stock: 0 // Inicializa el stock en 0
            });
            sizeIndex = updatedProduct.color[colorIndex].size.length - 1;
        }
    
        // Actualizar las medidas (width, long, rise) o el stock
        if (name === 'width' || name === 'long' || name === 'rise') {
            if (sizeIndex !== -1) {
                updatedProduct.color[colorIndex].size[sizeIndex].measurements[name] = value;
            }
        } else if (name === 'stock') {
            if (sizeIndex !== -1) {
                updatedProduct.color[colorIndex].size[sizeIndex].stock = value; // Actualizar el stock
            }
        }
    
        setNewProduct(updatedProduct);
        validateForm();
    };
    
    

    //-----------SUPPLIER-----------//
    const handleSupplierChange = (event) => {

        if(event.target.value) {
            setIsClearDisabled(false);
        }

        const { name, value } = event.target;
    
        const updatedProduct = {
            ...newProduct,
            supplier: {
                ...newProduct.supplier, 
                [name]: value
            }
        };
        setNewProduct(updatedProduct);
    };
    
    //-----------IMAGEN-----------//
    const handleCheckboxChange = (option) => {
        setSelectedOptionImage(!option === selectedOptionImage ? 'unique' : option);
    };

    const handleImageChange = async (event, colorIndex) => {

        if(event.target.value) {
            setIsClearDisabled(false);
        }

        const file = event.target.files[0];

        if (file) {
            try {
                
                setImageLoading(true);
                // Configuración para la compresión
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };

                // Comprimir la imagen
                const compressedFile = await imageCompression(file, options);

                // Despachar la acción de subir la imagen a Imgur
                const imageUrl = await dispatch(uploadImageToImgur(compressedFile));

                // Actualizar el estado con la URL de la imagen
                const updatedProduct = { ...newProduct };

                if (colorIndex !== undefined) {
                    // Guardar el link de la imagen para un color específico
                    updatedProduct.color[colorIndex].image = imageUrl;

                    // Eliminar imagen global si hay una
                    if (updatedProduct.imageGlobal) {
                        updatedProduct.imageGlobal = null;
                        updatedProduct.imageGlobalPreview = null;
                        setImageGlobal(null);
                    }

                    setNewProduct(updatedProduct);
                    setImagePreview(imageUrl);
                    setImageLoading(false);
                } else {
                    // Guardar el link de la imagen global
                    updatedProduct.imageGlobal = imageUrl;
                    updatedProduct.imageGlobalPreview = imageUrl;

                    // Eliminar imágenes específicas de cada color
                    updatedProduct.color = updatedProduct.color.map(color => ({
                        ...color,
                        image: null,
                    }));

                    setNewProduct(updatedProduct);
                    setImageGlobal(imageUrl);
                    setImagePreview(imageUrl);
                    setImageLoading(false);
                }
            } catch (error) {
                console.error('Error al comprimir o subir la imagen:', error);
                toast.error('Error al subir la imagen, intentar nuevamente más tarde');
                setImageLoading(false);
            }
        }
    };

    const deleteImage = (index) => {
        const updatedProduct = { ...newProduct };
    
        if (index !== null) { // Elimina imagen específica por color
            if (updatedProduct.color[index]) {
                updatedProduct.color[index].imageFile = null;
                updatedProduct.color[index].image = null;
                updatedProduct.imageGlobal = null;
                updatedProduct.imageGlobalPreview = null;
            }
        } else { // Elimina imagen global
            updatedProduct.imageGlobal = null;
            updatedProduct.imageGlobalPreview = null;
    
            // Opcional: Resetea todas las imágenes de color
            updatedProduct.color.forEach(color => {
                color.imageFile = null;
                color.image = null;
            });
        }
    
        setImageGlobal(imgProduct);
        setNewProduct(updatedProduct);
        setImagePreview(imgProduct);
    }; 

    //-----------CATEGORY-----------//
    const handleShowCategoryForm = (type) => {
        setShowCategoryForm(!showCategoryForm);
        setActionType(type);
    };

    const handleCloseCategoryForm = () => {
        setShowCategoryForm(false);
    };

    const handleCategoryAdded = (newCategory) => {
        setShowCategoryForm(false);
        
        if(newCategory !== undefined){
            setSelectedCategory({ value: newCategory._id, label: newCategory.name });
            setNewProduct((prevNewProduct) => ({
                ...prevNewProduct,
                category: [newCategory._id]
            }));
        };
        dispatch(getCategories());
        validateForm();
    };

    //-----------SUBMIT-----------//
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Crear un objeto que contendrá los datos del producto
        const productData = {
            name: newProduct.name,
            color: newProduct.color, // No es necesario convertirlo en JSON, ya es un array
            supplier: newProduct.supplier,
            price: newProduct.price,
            category: newProduct.category,
            description: newProduct.description,
            imageGlobal: newProduct.imageGlobal || null, // Si existe la imagen global, la añadimos
        };
    
        // // Log del objeto productData para revisar
        // console.log(productData);
    
        try {
            // Enviar la petición como un objeto JSON
            const response = await dispatch(postProduct(productData));
    
            if (response.data) {
                console.log("Product successfully saved");
                setColors([]);
                setSizes([]);
                setImageGlobal(null);
                setNewProduct(initialProductState); // Resetear el formulario
                setIsClearDisabled(true);
                navigate('/main_window/products/success/post');
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    useEffect(() => {
        validateForm();
    }, [newProduct, colors, sizes]);

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>NUEVO PRODUCTO</h2>
                    <div className="titleButtons">
                        <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button>
                    </div>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className={style.productForm}>
                        <div className={style.column1}>
                            <div className={style.containerMessage}>
                                <label className={style.mensagge}>Los campos con (*) son obligatorios</label>
                            </div>
                            <div>
                                <label htmlFor="name" className={style.nameTitle}>*Nombre</label>
                                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} className={style.inputName}/>
                            </div>
                            <div className={style.detailProduct}>
                                <div className={style.colorContainer}>
                                    <label htmlFor="color">*Colores</label>
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
                                        <input className={style.inputAddColor} type="text" name="color" value={newColor} onChange={handleInputColorChange} onKeyDown={handleKeyDown} placeholder='Agregar' />
                                        <button type="button" className={style.buttonAdd} onClick={addColor}>+</button>
                                    </div>
                                </div>
                                <div className={style.sizeContainer}>
                                    <label htmlFor="size">*Talle</label>
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
                                        <input className={style.inputAddSize} type="text" name="size" value={newSize} onChange={handleInputSizeChange} onKeyDown={handleKeyDown} placeholder='Agregar' />
                                        <button type="button" className={style.buttonAdd} onClick={addSize}>+</button>
                                    </div>
                                </div>
                            </div>
                            <div className={style.stockContainer}>
                                <label htmlFor="color">Medidas y stock</label>
                                <div className={style.stockCard}>
                                    <ol>
                                        {combinations.map((combination, index) => {
                                            // Buscar el valor actual de las medidas para el tamaño
                                            const currentSizeData = newProduct.color.flatMap(color => 
                                                color.size.filter(size => size.sizeName === combination.size)
                                            ).find(size => size);

                                            const widthValue = currentSizeData ? currentSizeData.measurements.width : '';
                                            const longValue = currentSizeData ? currentSizeData.measurements.long : '';
                                            const riseValue = currentSizeData ? currentSizeData.measurements.rise : '';

                                            return (
                                                <li key={index} className={style.list}>
                                                    <span className={style.spanList}>
                                                        Color {combination.color} - Talle {combination.size}
                                                    </span>
                                                    <span className={style.spansinMed} htmlFor="stock">*Stock:</span>
                                                    <input
                                                        className={style.inputsinStock}
                                                        type="number" // Tipo texto
                                                        name="stock"
                                                        placeholder='0'
                                                        min='0'
                                                        onChange={(event) => handleStockChange(combination, event)}
                                                        onWheel={(event) => event.target.blur()} // Esto evita que el scroll cambie el valor
                                                    />
                                                    <span className={style.spansinMed} htmlFor="width">Ancho:</span>
                                                    <input
                                                        className={style.inputsinMed}
                                                        min='0'
                                                        type="number"
                                                        name="width"
                                                        placeholder='0'
                                                        value={widthValue}
                                                        onChange={(event) => handleStockChange(combination, event)}
                                                        onWheel={(event) => event.target.blur()} // Esto evita que el scroll cambie el valor
                                                    />
                                                    <span className={style.spansinMed} htmlFor="long">Largo:</span>
                                                    <input
                                                        className={style.inputsinMed}
                                                        min='0'
                                                        type="number"
                                                        name="long"
                                                        placeholder='0'
                                                        value={longValue}
                                                        onChange={(event) => handleStockChange(combination, event)}
                                                        onWheel={(event) => event.target.blur()} // Esto evita que el scroll cambie el valor
                                                    />
                                                    <span className={style.spansinMed} htmlFor="rise">Tiro:</span>
                                                    <input
                                                        className={style.inputsinMed}
                                                        min='0'
                                                        type="number"
                                                        name="rise"
                                                        placeholder='0'
                                                        value={riseValue}
                                                        onChange={(event) => handleStockChange(combination, event)}
                                                        onWheel={(event) => event.target.blur()} // Esto evita que el scroll cambie el valor
                                                    />
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </div>
                            </div>
                            <div className={style.supplierContainer}>
                                <label htmlFor="supplier" className={style.supplierTitle}>Proveedor</label>
                                <div className={style.dataSupplierContainer}>
                                    <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                                    <input type="text" name="name" value={newProduct.supplier.name} onChange={handleSupplierChange} className={style.inputName}/>
                                </div>
                                <div className={style.dataSupplierContainer}>
                                    <label htmlFor="phone" className={style.nameTitle}>Teléfono</label>
                                    <input type="text" name="phone" value={newProduct.supplier.phone} onChange={handleSupplierChange} className={style.inputName}/>
                                </div>
                            </div>   
                        </div>
                        <div className={style.column2}>
                            <div className={style.imageContainer}>
                                <div className={style.imageTitleContainer}>
                                    <div className={style.title}>
                                        <label htmlFor="image">Imágenes</label>
                                    </div>
                                    <div>
                                        <input className={style.inputCheckbox} type="checkbox" name="unique" id="unique" checked={selectedOptionImage === 'unique'} onChange={() => handleCheckboxChange('unique')} />
                                        <span className={style.spanImage}>Único</span>
                                        <input className={style.inputCheckbox} type="checkbox" name="byColor" id="byColor" checked={selectedOptionImage === 'byColor'} onChange={() => handleCheckboxChange('byColor')} />
                                        <span className={style.spanImage}>Por color</span>
                                    </div>
                                </div>
                                <div className={style.imageComponent}>  
                                    <ol>
                                        {selectedOptionImage === 'unique' && newProduct.color?.length > 0 && (
                                            <li key="unique" className={style.list}>
                                                <div className={style.addImg}>
                                                    <label className={style.buttonImg} htmlFor={'imageUniqueProduct'}>
                                                        {imageLoading ? <p>Cargando...</p> : <img className={style.imgProduct} src={imageGlobal || imgProduct} alt="image-product" />}
                                                    </label>
                                                    <input 
                                                        className={style.inputImage} 
                                                        type="file" 
                                                        accept="image/*" 
                                                        id={'imageUniqueProduct'} 
                                                        onChange={(event) => handleImageChange(event)} 
                                                    />
                                                </div>
                                                <button type="button" className={style.buttonDelete} onClick={() => deleteImage(null)}>
                                                    <img src={x} alt="x" />
                                                </button>
                                            </li>
                                        )}
                                        {selectedOptionImage === 'byColor' && newProduct.color?.length > 0 && (
                                            newProduct.color?.map((color, index) => (
                                                <li key={color.colorName} className={style.list}>
                                                    <div className={style.addImg}>
                                                        <div className={style.addImgChild}><span className={style.spanList}>{color.colorName}</span></div>
                                                        <div className={style.addImgChild}>
                                                            <label className={style.buttonImg} htmlFor={`imageProduct-${index}`}>
                                                                {imageLoading ? <p>Cargando...</p> : <img className={style.imgProduct} src={color.image || imageGlobal || imgProduct} alt="image-product" />}
                                                            </label>
                                                            <input 
                                                                className={style.inputImage} 
                                                                type="file" 
                                                                accept="image/*" 
                                                                id={`imageProduct-${index}`}
                                                                onChange={(event) => handleImageChange(event, index)} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <button type="button" className={style.buttonDelete} onClick={() => deleteImage(index)}>
                                                        <img src={x} alt="x" />
                                                    </button>  
                                                </li>
                                            ))
                                        )}
                                    </ol>                                              
                                </div>
                            </div>
                            <div className={style.rigthContainer}>      
                                <div className={style.categoryContainer}>
                                    <label htmlFor="category" className={style.nameTitle}>*Categoría</label>
                                    <select name="category" className={style.selectCategory} value={newProduct.category} onChange={handleInputChange}>
                                        <option value="" disabled>Seleccionar</option>
                                        {categories && categories.length > 0 ? (
                                            categories.map((category) => (
                                                <option key={category._id} value={category._id}>{category.name}</option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No hay categorías disponibles</option>
                                        )}
                                    </select>
                                    <div className={style.containerAddCategory}>
                                        <button className={style.buttonAddCategory} type='button' onClick={() => handleShowCategoryForm('create')}>+</button>
                                        <button className={style.buttonDeleteCategory} type='button' onClick={() => handleShowCategoryForm('delete')}>-</button>
                                    </div>
                                </div>
                                <div className={style.priceContainer}>
                                    <label htmlFor="price" className={style.nameTitle}>*Precio $</label>
                                    <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder='0' min='0'/>
                                </div>    
                                <div className={style.descriptionContainer}>
                                    <label htmlFor="description" className={style.nameTitle}>Descripción</label>
                                    <textarea type="text" name="description" value={newProduct.description} onChange={handleInputChange}/>
                                </div> 
                            </div>
                            <div>
                                <button className={style.buttonSubmit} type="submit" disabled={isSubmitDisabled}>Agregar</button>                    
                            </div>
                        </div>
                    </form>
                    <div className={`${style.addCategoryComponent} ${showCategoryForm ? style.addCategoryComponentBorder : ''}`}>
                        {showCategoryForm && <FormCategory onCategoryAdded={handleCategoryAdded} onClose={handleCloseCategoryForm} actionType={actionType}/>}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default FormProduct;