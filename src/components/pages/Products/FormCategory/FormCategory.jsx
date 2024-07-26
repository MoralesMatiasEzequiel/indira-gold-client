import style from './FormCategory.module.css';
import React, { useState } from 'react';
import { postCategory } from '../../../../redux/categoryActions.js';
import { useDispatch } from 'react-redux';


const FormCategory = ({ onCategoryAdded }) => {
    const dispatch = useDispatch();

    const initialCategoryState = {
        name: ''
    };

    const [newCategory, setNewCategory] = useState(initialCategoryState);

    const handleInputChange = (event) => {
        setNewCategory({
            ...newCategory,
            name: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const createdCategory = await dispatch(postCategory(newCategory));
        onCategoryAdded(createdCategory); // Llamar a la función pasada como prop
        setNewCategory(initialCategoryState);
    };

    return(
        <div className="component">
            <div className="title">
                <h2>NUEVA CATEGORÍA</h2>
            </div>
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                        <input type="text" name="name" value={newCategory.name} onChange={handleInputChange} className={style.inputName}/>
                        <div className={style.containerButton}>
                            <button type="submit">Agregar</button>
                        </div>
                    </form>
                </div>
        </div>
    );
};

export default FormCategory;