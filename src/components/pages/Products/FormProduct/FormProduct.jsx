import style from './FormProduct.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import x from '../../Sales/FormSales/img/x.png';



const FormProduct = () => {

    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');

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

    const handleSubmit = (event) => {
        event.preventDefault();
    };
    // const [newProduct, setNewProduct] = useState(initialProductState);

    // const initialProductState = {
    //     name: '',
    //     color: '',
    //     size: '',
    //     stock: 0,
    //     imageGlobal: '',
    //     category: [],
    //     price: 0,
    //     description: ''
    // };

    return(
        <div className="component">
            <div className="title">
                <h2>NUEVA PRODUCTO</h2>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className={style.column1}>
                        <div>
                            <label htmlFor="name">Nombre</label>
                            <input type="text" name="name" />
                        </div>
                        <div>
                            <div>
                                <label htmlFor="color">Colores</label>
                                <div  className={style.olContainer}>
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
                                    <input className={style.inputAdd} type="text" name="color" value={newColor} onChange={handleInputColorChange} placeholder='Agregar'/>      
                                    <button className={style.buttonAdd} onClick={addColor}>+</button>                                                  
                                </div>
                            </div>
                            <div>
                                <label htmlFor="size">Talle</label>
                                <div  className={style.olContainer}>
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
                                    <input className={style.inputAdd} type="text" name="size" value={newSize} onChange={handleInputSizeChange} placeholder='Agregar'/>      
                                    <button className={style.buttonAdd} onClick={addSize}>+</button>                                                  
                                </div>                 
                            </div>                                                       
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormProduct;