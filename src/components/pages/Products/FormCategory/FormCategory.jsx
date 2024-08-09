import style from './FormCategory.module.css';
import React, { useState, useEffect } from 'react';
import { postCategory } from '../../../../redux/categoryActions.js';
import { useDispatch, useSelector } from 'react-redux';

const FormCategory = ({ onCategoryAdded }) => {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories.categories);

    const initialCategoryState = {
        name: ''
    };

    const [newCategory, setNewCategory] = useState(initialCategoryState);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        validateForm();
    }, [newCategory]);

    const validateForm = () => {
        const isCategoryNameValid = newCategory.name.trim() !== '';
        setIsSubmitDisabled(!isCategoryNameValid);
    };

    const handleInputChange = (event) => {
        setNewCategory({
            ...newCategory,
            name: event.target.value
        });
        setErrorMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const categoryExists = categories.some(category => category.name.toLowerCase() === newCategory.name.toLowerCase());
        
        if (categoryExists) {
            setErrorMessage('*Esta categoría ya existe');
            return;
        }

        const createdCategory = dispatch(postCategory(newCategory));
        onCategoryAdded(createdCategory); // Llamar a la función pasada como prop
        setNewCategory(initialCategoryState);
    };

    return (
        <div className="component">
            <div className="title">
                <h2>NUEVA CATEGORÍA</h2>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={newCategory.name}
                        onChange={handleInputChange}
                        className={style.inputName}
                    />
                    {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
                    <div className={style.containerButton}>
                        <button type="submit" disabled={isSubmitDisabled}>Agregar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormCategory;
