import style from './PutPriceProducts.module.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getProducts, putIncreasePrice } from '../../../../redux/productActions.js';
import { getCategories } from '../../../../redux/categoryActions.js';

const PutPriceProducts = () => {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories.categories);

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
    }, [dispatch]);

    const initialPriceState = {
        porcentage: '',
        category: []
    };

    const [newPrice, setNewPrice] = useState(initialPriceState)
    const [selectedOption, setSelectedOption] = useState('allProducts');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const validateForm = () => {
        const isPorcentageValid = newPrice.porcentage !== '';
        const isCategoryValid = selectedOption === 'allProducts' || (selectedOption === 'byCategory' && newPrice.category.length > 0);

        setIsSubmitDisabled(!(isPorcentageValid && isCategoryValid));
    };

    useEffect(() => {
        validateForm();
    }, [newPrice.porcentage, newPrice.category, selectedOption]);

    // Convert categories to the format needed for react-select
    const categoryOptions = categories.map(category => ({
        value: category._id, // or another unique identifier
        label: category.name
    }));

    const handleInputChange = (event) => {
        let porcentageNumber = Number(event.target.value);
        setNewPrice({
            ...newPrice,
            porcentage: porcentageNumber
        });
        validateForm();
    };

    const handleCategoryChange = (selectedCategory) => {
        const array = selectedCategory ? [selectedCategory] : [];
        setNewPrice({
            ...newPrice,
            category: array
        });
        validateForm();
    };

    const handleCheckboxChange = (option) => {
        setSelectedOption(option);
        setNewPrice({
            ...newPrice,
            category: []
        });
        validateForm();
    };

    const categoryInputStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '20px',
            fontSize: '0.75rem',
            borderColor: state.isFocused ? '#e4b61a' : provided.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #e4b61a' : provided.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? '#e4b61a' : provided.borderColor,
            }
        }),
        input: (provided) => ({
            ...provided,
            color: '#3c3c3b',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#797979',
            fontStyle: 'italic'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#3c3c3b',
            padding: 0
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#000' : '#555',
            padding: '10px',
            fontSize: '0.75rem'
        }),
    };

    const handleSubmit = async (event) => {
        event.preventDefault();       
        dispatch(putIncreasePrice(newPrice));
        setNewPrice(initialPriceState);
    };

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>GESTIÓN DE PRECIO DE PRODUCTOS</h2>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input className={style.inputCheckbox} type="checkbox" name="allProducts" id="allProducts" checked={selectedOption === 'allProducts'} onChange={() => handleCheckboxChange('allProducts')} />
                            <span className={style.spanCheckbox}>Todos los productos</span>
                            <input className={style.inputCheckbox} type="checkbox" name="byCategory" id="byCategory" checked={selectedOption === 'byCategory'} onChange={() => handleCheckboxChange('byCategory')} />
                            <span className={style.spanCheckbox}>Por categoría</span>
                        </div>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="paymentMethod">Categorías</label>
                            </div>
                            <div className={style.right}>
                                <Select
                                    name="category"
                                    value={newPrice.category}
                                    onChange={handleCategoryChange}
                                    options={categoryOptions}
                                    placeholder="Seleccionar"
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                        ...categoryInputStyles
                                    }}
                                    isDisabled={selectedOption === 'allProducts'}
                                />
                            </div>
                        </div>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="porcentage">Aumento</label>
                            </div>
                            <div className={style.right}>
                                <input 
                                    name="porcentage"
                                    placeholder='%'
                                    min='0'
                                    value={newPrice.porcentage}
                                    onChange={handleInputChange}
                                    className={style.discount}
                                    type='number'
                                />
                            </div>
                        </div>
                        <div>
                            <button type='submit' disabled={isSubmitDisabled}>Actualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PutPriceProducts;
