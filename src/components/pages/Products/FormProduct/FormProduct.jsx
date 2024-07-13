import style from './FormProduct.module.css';
import React, { useState, useRef, useEffect } from 'react';



const FormProduct = () => {
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
                <form >
                <div className={style.column1}>

                </div>

                </form>

            </div>
            {/* <div>
                <label htmlFor="nombre">Nombre </label>
                <input type="text" name="nombre" />

                <div>
                    <label htmlFor="color">Colores</label>
                    <input type="text" />

                    <label htmlFor="size">Talle</label>
                    <input type="text" />

                    <label htmlFor="stock">Stock</label>
                    <input type="text" />
                </div>
                <div>
                    <p>Imágenes</p>
                    <input type="text" />
                    
                    <label htmlFor="category">Categoría</label>
                    <input type="text" />

                    <label htmlFor="price">Precio</label>
                    <input type="text" />
                    <button>Agregar</button>
                </div>
            </div> */}
        </div>
    );
};

export default FormProduct;