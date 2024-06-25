import React from 'react';


const FormProduct = () => {

    return(
        <div>
            <div>
                <h1>NUEVO PRODUCTO</h1>
            </div>
            <div>
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
            </div>
        </div>
    );
};

export default FormProduct;