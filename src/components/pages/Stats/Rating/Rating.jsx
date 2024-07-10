import style from './Rating.module.css';
import React from 'react';
import { useSelector } from "react-redux";


const Rating = () => {

    const topFiveProducts = useSelector(state => state.products.topFiveProducts.topFiveProducts);
    
    return(
        <div className="component">
            <div className="title">
                <h2>MÁS VENDIDOS</h2>
            </div>
            {topFiveProducts?.map((product, index) => (
                <div key={product._id} className={style.containerTopFive}>
                    <div>
                        <span className={style.ratingNumber}>{index + 1}</span>
                    </div>
                    <div>
                        <p className={style.productName}>{product.name}</p>
                        <span>{product.color[0].colorName} - Talle {product.color[0].size[0].sizeName}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Rating;