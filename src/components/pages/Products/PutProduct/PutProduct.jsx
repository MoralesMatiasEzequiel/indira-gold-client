import style from './PutProduct.module.css';
import x from '../../Sales/FormSales/img/x.png';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormCategory from '../FormCategory/FormCategory.jsx';
import { getCategories } from '../../../../redux/categoryActions.js';
import { getProducts, getProductById, putProduct } from '../../../../redux/productActions.js';

const PutProduct = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productDetail = useSelector(state => state.products.productDetail);    
    const categories = useSelector(state => state.categories.categories);
    
    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);
    
    useEffect(() => {
        dispatch(getCategories());
    
        if (productDetail && productDetail._id === id) {
            setColors(productDetail.color.map(color => color.colorName));
    
            const allSizes = productDetail.color.flatMap(color => 
                color.size.map(size => size.sizeName)
            );
            const uniqueSizes = [...new Set(allSizes)];
            setSizes(uniqueSizes);
    
            const updatedEditProduct = {
                _id: productDetail._id,
                name: productDetail.name,
                color: productDetail.color?.map(color => ({
                    colorName: color.colorName,
                    size: color.size?.map(size => ({
                        sizeName: size.sizeName,
                        measurements: {
                            width: size.measurements[0]?.width || '',
                            long: size.measurements[0]?.long || '',
                            rise: size.measurements[0]?.rise || ''
                        },
                        stock: size.stock || 0
                    })),
                    image: color.image || ''
                })),
                supplier: productDetail.supplier,
                imageGlobal: productDetail.imageGlobal,
                price: productDetail.price,
                category: productDetail.category,
                description: productDetail.description,
                active: productDetail.active
            };
            setEditProduct(updatedEditProduct);
    
            // Inicializa selectedCategory con la categoría del producto
            const categoryId = productDetail.category?.[0]?._id || '';
            setSelectedCategory(categoryId);
        }
    }, [dispatch, id, productDetail]);

    const [editProduct, setEditProduct] = useState({});  
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [selectedOptionImage, setSelectedOptionImage] = useState(productDetail.imageGlobal ? 'unique' : 'byColor');
    const [imageGlobal, setImageGlobal] = useState(null);
    const [imagePreview, setImagePreview] = useState(imgProduct);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(editProduct.category ? editProduct.category[0]._id : null);
    const [actionType, setActionType] = useState(null);    
console.log(editProduct);

 
    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        if(name === 'name'){
            setEditProduct({
                ...editProduct,
                name: value
            });
        };
        if(name === 'price'){
            let priceNumber = Number(value);
            setEditProduct({
                ...editProduct,
                price: priceNumber
            });

            // validateForm();
        };
        if (name === 'category') {
            setSelectedCategory(value);
    
            const selectedCategory = categories.find(category => category._id === value);
            setEditProduct(prevEditProduct => ({
                ...prevEditProduct,
                category: [{ _id: selectedCategory._id, name: selectedCategory.name }]
            }));
        };
        if(name === 'description'){
            setEditProduct({
                ...editProduct,
                description: value
            });
        };
    
        // validateForm();
    };  

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addColor();
            addSize();
        };
    };

    //-----------COLOR-----------//
    const handleInputColorChange = (event) => {
        setNewColor(event.target.value);
    };

    const addColor = () => {
        if (newColor !== '') {
            setColors([...colors, newColor]);
    
            // Combina el nuevo color con los tamaños existentes
            const updatedEditProduct = {
                ...editProduct,
                color: [
                    ...editProduct.color,
                    {
                        colorName: newColor,
                        size: sizes.map(size => ({
                            sizeName: size,
                            measurements: { width: '', long: '', rise: '' },
                            stock: 0
                        }))
                    }
                ]
            };
            setEditProduct(updatedEditProduct);
    
            setNewColor('');
        }
    };

    const deleteColor = (index) => {
        const updatedColors = [...colors];
        const colorToDelete = updatedColors.splice(index, 1)[0];
        
        setColors(updatedColors);
        
        // Filtra los colores en el estado editProduct para eliminar el color correspondiente
        const filteredProductColors = editProduct.color.filter(color => color.colorName !== colorToDelete);
        
        setEditProduct(prevState => ({
            ...prevState,
            color: filteredProductColors
        }));
    };
    //-----------SIZE-----------//
    const handleInputSizeChange = (event) => {
        setNewSize(event.target.value);
    };

    const addSize = () => {
        if (newSize !== '') {
            setSizes([...sizes, newSize]);
    
            // Combina el nuevo tamaño con los colores existentes
            const updatedEditProduct = {
                ...editProduct,
                color: editProduct.color.map(color => ({
                    ...color,
                    size: [
                        ...color.size,
                        {
                            sizeName: newSize,
                            measurements: { width: '', long: '', rise: '' },
                            stock: 0
                        }
                    ]
                }))
            };
            setEditProduct(updatedEditProduct);
    
            setNewSize('');
        }
        // validateForm();
    }; 

    const deleteSize = (index) => {
        const updatedSizes = [...sizes];
        const sizeToDelete = updatedSizes.splice(index, 1)[0];
    
        setSizes(updatedSizes);
    
        // Actualiza el estado editProduct para reflejar la eliminación del talle
        const updatedProductColors = editProduct.color.map(color => {
            return {
                ...color,
                size: color.size.filter(size => size.sizeName !== sizeToDelete)
            };
        });
    
        setEditProduct(prevState => ({
            ...prevState,
            color: updatedProductColors
        }));
    
        // validateForm();
    };

    //-----------COMBINACION(COLOR/SIZE)-----------//
    const generateCombinations = () => {
        return colors?.flatMap(color =>
            sizes.map(size => ({ color, size }))
        );
    };

    const combinations = generateCombinations();
  

    const handleStockChange = (combination, event) => {
        const { name, value } = event.target;
        const updatedEditProduct = { ...editProduct };
    
        const colorIndex = updatedEditProduct.color.findIndex(c => c.colorName === combination.color);
        if (colorIndex === -1) {
            console.error(`Color ${combination.color} no encontrado`);
            return;
        }
    
        const sizeIndex = updatedEditProduct.color[colorIndex].size.findIndex(s => s.sizeName === combination.size);
        if (sizeIndex === -1) {
            console.error(`Talle ${combination.size} no encontrado para el color ${combination.color}`);
            return;
        }
    
        updatedEditProduct.color[colorIndex].size[sizeIndex].measurements = {
            ...updatedEditProduct.color[colorIndex].size[sizeIndex].measurements,
            [name]: value
        };
    
        if (name === 'stock') {
            updatedEditProduct.color[colorIndex].size[sizeIndex].stock = value;
        }
    
        setEditProduct(updatedEditProduct);
    };

    //-----------SUPPLIER-----------//
    const handleSupplierChange = (event) => {
        const { name, value } = event.target;
    
        const updatedProduct = {
            ...editProduct,
            supplier: {
                ...editProduct.supplier, 
                [name]: value
            }
        };
        setEditProduct(updatedProduct);
        // validateForm();
    };
    
    //-----------IMAGEN-----------//
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        
        // Reemplazar barras invertidas por barras inclinadas
        const correctedPath = imagePath.replace(/\\/g, '/');
        
        // URL base para los archivos estáticos
        const baseUrl = 'http://localhost:3001/';
        
        return `${baseUrl}${correctedPath}`;
    };

    // const getImageUrl = (imagePath) => {
    //     if (!imagePath) return '';
    //     // URL base para los archivos estáticos
    //     const baseUrl = 'http://localhost:3001/';
    //     return `${baseUrl}${imagePath}`;
    // };

    const handleCheckboxChange = (option) => {
        setSelectedOptionImage(!option === selectedOptionImage ? 'unique' : option);
    };

    const handleImageChange = (event, colorIndex) => {
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedProduct = { ...editProduct };
    
                if (colorIndex !== undefined) {
                    // Subir imagen específica por color
                    updatedProduct.color[colorIndex].imageFile = file;
                    updatedProduct.color[colorIndex].image = reader.result;
    
                    // Eliminar imagen global si hay una
                    if (updatedProduct.imageGlobal) {
                        updatedProduct.imageGlobal = null;
                        updatedProduct.imageGlobalPreview = null;
                        setImageGlobal(null);
                    };
    
                    setEditProduct(updatedProduct);
                    setImagePreview(reader.result);

                } else {
                    // Subir imagen global
                    updatedProduct.imageGlobal = file;
                    updatedProduct.imageGlobalPreview = reader.result;
    
                    // Eliminar imágenes específicas de cada color
                    updatedProduct.color = updatedProduct.color.map(color => ({
                        ...color,
                        imageFile: null,
                        image: null
                    }));
    
                    setEditProduct(updatedProduct);
                    setImageGlobal(reader.result);
                    setImagePreview(reader.result);
                };
                // validateForm();
            };
            reader.readAsDataURL(file);
        } 
    };
     
    const deleteImage = (index) => {
        const updatedProduct = { ...editProduct };
    
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
        setEditProduct(updatedProduct);
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
            setEditProduct((prevEditProduct) => ({
                ...prevEditProduct,
                category: [newCategory._id]
            }));
        };
        dispatch(getCategories());
    };    

    //-----------SUBMIT-----------//
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        
        // Verificar y preservar la imagen global si no fue modificada
        if (editProduct.imageGlobal) {
            formData.append('imageGlobal', editProduct.imageGlobal);
        } else if (productDetail.imageGlobal) {
            formData.append('imageGlobal', productDetail.imageGlobal);
        }
    
        // Verificar y preservar las imágenes de cada color si no fueron modificadas
        editProduct.color.forEach((color) => {
            // Busca el color original en productDetail
            const originalColor = productDetail.color.find(c => c._id === color._id);
    
            if (color.imageFile) {
                formData.append('images', color.imageFile);
            } else if (originalColor && originalColor.image) {
                // Preservar imagen existente si no se ha modificado
                formData.append('images', originalColor.image);
            }
        });
    
        // Agregar los demás campos al formData
        formData.append("_id", editProduct._id);
        formData.append("name", editProduct.name);
        formData.append("color", JSON.stringify(editProduct.color));
        formData.append("supplier", JSON.stringify(editProduct.supplier));
        formData.append("price", editProduct.price);
        formData.append("category", JSON.stringify(editProduct.category));
        formData.append("description", editProduct.description);
        formData.append("active", editProduct.active);
    
        // Revisión final para asegurarte de que todo esté en el formData
        console.log([...formData.entries()]);
    
        try {
            const response = await dispatch(putProduct(formData));
    
            if (response.data) {
                console.log("Successfully edited product");
                dispatch(getProducts());
                // dispatch(getProductById(id));
                dispatch(getCategories());
                navigate('/main_window/products/succes/put');
            };
        } catch (error) {
            console.error("Error editing product:", error);
        };
    };
    
    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>EDITAR PRODUCTO</h2>
                    <div className="titleButtons">
                        <button><Link to={`/main_window/products/${id}`}>Atrás</Link></button>
                    </div>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className={style.productForm}>
                        <div className={style.column1}>
                            <div>
                                <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                                <input type="text" name="name" value={editProduct.name} onChange={handleInputChange} className={style.inputName}/>
                            </div>
                            <div className={style.detailProduct}>
                                <div className={style.colorContainer}>
                                    <label htmlFor="color">Colores</label>
                                    <div className={style.colorCard}>
                                        <ol>
                                            {colors?.map((color, colorIndex) => (
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
                                        <input className={style.inputAddSize} type="text" name="size" value={newSize} onChange={handleInputSizeChange} onKeyDown={handleKeyDown} placeholder='Agregar' />
                                        <button type="button" className={style.buttonAdd} onClick={addSize}>+</button>
                                    </div>
                                </div>
                            </div>
                            <div className={style.stockContainer}>
                                <label htmlFor="color">Medidas y stock</label>
                                <div className={style.stockCard}>
                                    <ol>
                                    {combinations?.map((combination, index) => {
                                        // Encontrar el color y el talle correspondientes en el estado editProduct
                                        const colorState = editProduct.color?.find(c => c.colorName === combination.color);
                                        const sizeState = colorState?.size?.find(s => s.sizeName === combination.size);
                                        return (
                                            <li key={index} className={style.list}>
                                                <span className={style.spanList}>
                                                    Color {combination.color} - Talle {combination.size}
                                                </span>
                                                {sizeState ? (
                                                    <>
                                                        <span className={style.spansinMed} htmlFor="width">Ancho:</span>
                                                        <input 
                                                            className={style.inputsinMed} 
                                                            type="number" 
                                                            name="width" 
                                                            placeholder='0' 
                                                            value={sizeState?.measurements.width || ''}
                                                            onChange={(event) => handleStockChange(combination, event)} 
                                                        />
                                                        <span className={style.spansinMed} htmlFor="long">Largo:</span>
                                                        <input 
                                                            className={style.inputsinMed} 
                                                            type="number" 
                                                            name="long" 
                                                            placeholder='0' 
                                                            value={sizeState?.measurements.long || ''}
                                                            onChange={(event) => handleStockChange(combination, event)} 
                                                        />
                                                        <span className={style.spansinMed} htmlFor="rise">Tiro:</span>
                                                        <input 
                                                            className={style.inputsinMed} 
                                                            type="number" 
                                                            name="rise" 
                                                            placeholder='0' 
                                                            value={sizeState?.measurements.rise || ''}
                                                            onChange={(event) => handleStockChange(combination, event)} 
                                                        />
                                                        <span className={style.spansinMed} htmlFor="stock">Stock:</span>
                                                        <input 
                                                            className={style.inputsinStock} 
                                                            type="number" 
                                                            name="stock" 
                                                            min='0' 
                                                            placeholder='0' 
                                                            value={sizeState?.stock || ''}
                                                            onChange={(event) => handleStockChange(combination, event)} 
                                                        />
                                                    </>
                                                ) : (
                                                    <span>Combinación de color y talle no encontrada.</span>
                                                )}
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
                                    <input type="text" name="name" value={editProduct.supplier?.name} onChange={handleSupplierChange} className={style.inputName}/>
                                </div>
                                <div className={style.dataSupplierContainer}>
                                    <label htmlFor="phone" className={style.nameTitle}>Teléfono</label>
                                    <input type="text" name="phone" value={editProduct.supplier?.phone} onChange={handleSupplierChange} className={style.inputName}/>
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
                                        {selectedOptionImage === 'unique' && editProduct.color?.length > 0 && (
                                            <li key="unique" className={style.list}>
                                                <div className={style.addImg}>
                                                    <label className={style.buttonImg} htmlFor={'imageUniqueProduct'}>
                                                        <img className={style.imgProduct} src={getImageUrl(editProduct.imageGlobal) || imgProduct} alt="image-product" />
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
                                        {selectedOptionImage === 'byColor' && editProduct.color?.length > 0 && (
                                            editProduct.color?.map((color, index) => (
                                                <li key={color.colorName} className={style.list}>
                                                    <div className={style.addImg}>
                                                        <span className={style.spanList}>{color.colorName}</span>
                                                        <label className={style.buttonImg} htmlFor={`imageProduct-${index}`}>
                                                            <img className={style.imgProduct} src={getImageUrl(color.image) || imgProduct} alt="image-product" />
                                                        </label>
                                                        <input 
                                                            className={style.inputImage} 
                                                            type="file" 
                                                            accept="image/*" 
                                                            id={`imageProduct-${index}`}
                                                            onChange={(event) => handleImageChange(event, index)} 
                                                        />
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
                                    <label htmlFor="category" className={style.nameTitle}>Categoría</label>
                                    <select 
                                        name="category" 
                                        className={style.selectCategory} 
                                        value={selectedCategory}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>Seleccionar</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))}
                                    </select>
                                    <div className={style.containerAddCategory}>
                                        <button className={style.buttonAddCategory} type='button' onClick={() => handleShowCategoryForm('create')}>+</button>
                                        <button className={style.buttonDeleteCategory} type='button' onClick={() => handleShowCategoryForm('delete')}>-</button>
                                    </div>
                                </div>
                                <div className={style.priceContainer}>
                                    <label htmlFor="price" className={style.nameTitle}>Precio $</label>
                                    <input type="number" name="price" onChange={handleInputChange} value={editProduct.price} min='0'/>
                                </div>    
                                <div className={style.descriptionContainer}>
                                    <label htmlFor="description" className={style.nameTitle}>Descripción</label>
                                    <textarea type="text" name="description" value={editProduct.description} onChange={handleInputChange}/>
                                </div>  
                            </div>
                            <div>
                                <button className={style.buttonSubmit} type="submit">Editar</button>
                            </div>
                        </div>
                    </form>
                    <div className={`${style.addCategoryComponent} ${showCategoryForm ? style.addCategoryComponentBorder : ''}`}>
                        {showCategoryForm && <FormCategory onCategoryAdded={handleCategoryAdded} onClose={handleCloseCategoryForm} actionType={actionType}/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PutProduct;