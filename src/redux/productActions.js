// import axios from "axios";
import axios from '../services/axios.js';
import { saveToIndexedDB, saveProductsToIndexedDB, saveAllProductsToIndexedDB, getFromIndexedDB, getAllProductsFromIndexedDB, getProductsFromIndexedDB } from '../services/indexedDB.js';
import { getProductsReducer, getAllProductsReducer, getProductByIdReducer, getProductsByNameReducer, getSoldProductsReducer, getSoldProductsLocalReducer, getTopFiveProductsReducer, getTopFiveProductsLocalReducer } from "./productSlice.js";
import { imgurClientId } from "../assets/enviromentVars.js";

export const getProducts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/products");
            
            dispatch(getProductsReducer(data));

        } catch (error) {
            console.error("Error retrieving products from server: " + error.message);         
            return null;
        }
    };
};

// export const getProducts = () => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get("/products");
            
//             if (data) {
//                 dispatch(getProductsReducer(data));
//                 const key = 0;
//                 await saveProductsToIndexedDB('products', data, key);
//             } else {
//                 console.log("No llegó data de GetProducts");
//             };

//         } catch (error) {
//             // Intentar obtener los datos locales de IndexedDB como un respaldo
//             const { success, data: products } = await getProductsFromIndexedDB('products');
//             if (success && Array.isArray(products) && products.length > 0) {
//                 // Obtener la última posición del array
//                 const lastProducts = products[products.length - 1];
//                 dispatch(getProductsReducer(lastProducts)); // Despachar solo el último elemento
//                 return true;
//             } else {
//                 console.error("Error retrieving sales from server:", error.message);
//             };
            
//             // console.error("Error retrieving sales from server:", error.message);
//         }
//     };
// };

export const getAllProducts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/products/all");
            
            dispatch(getAllProductsReducer(data));

        } catch (error) {
            console.error("Error retrieving all products from server: " + error.message);         
            return null;
        }
    };
};

// export const getAllProducts = () => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get("/products/all");
            
//             if (data) {
//                 dispatch(getAllProductsReducer(data));
//                 const key = 0;
//                 await saveAllProductsToIndexedDB('allProducts', data, key);
//             } else {
//                 console.log("No llegó data de GetAllProducts");
//             };

//         } catch (error) {
//             // Intentar obtener los datos locales de IndexedDB como un respaldo
//             const { success, data: allProducts } = await getAllProductsFromIndexedDB('allProducts');
//             if (success && Array.isArray(allProducts) && allProducts.length > 0) {
//                 // Obtener la última posición del array
//                 const lastAllProducts = allProducts[allProducts.length - 1];
//                 dispatch(getAllProductsReducer(lastAllProducts)); // Despachar solo el último elemento
//                 return true;
//             } else {
//                 console.error("Error retrieving sales from server:", error.message);
//             };
            
//             // console.error("Error retrieving sales from server:", error.message);
//         }
//     };
// };

export const getProductById = (productId) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/products/${productId}`);

            dispatch(getProductByIdReducer(data));

        } catch (error) {
            console.error("Error retrieving product by server id: " + error.message);         
            return null;
        }
    };
};

// export const getProductById = (productId) => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get(`/products/${productId}`);
//             if(data){
//                 console.log("hay data");
//                 dispatch(getProductByIdReducer(data));
//                 return data;
//             } else {
//                 console.log("no hay");
//                 return Promise.reject("No data received");
//             }
            
//         } catch (error) {
//             console.log(error.message);
//             return Promise.reject(error);
//         }
//     };
// };

export const getProductByName = (productName) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/products/all?name=${productName}&`);

            dispatch(getAllProductsReducer(data));

        } catch (error) {
            console.error("Error retrieving product by server name: " + error.message); 
            return null;
        }
        
    };
};

// export const getProductByName = (productName) => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get(`/products/all?name=${productName}&`);

//             dispatch(getAllProductsReducer(data));

//         } catch (error) {
//             dispatch(getProductsByNameReducer(productName));
//         }
        
//     };
// };

export const getActiveProductsByName = (productName) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/products/?name=${productName}&`);

            dispatch(getProductsReducer(data));

        } catch (error) {
            console.error("Error retrieving active products by name: " + error.message); 
            return null;
        }
        
    };
};

// export const getActiveProductsByName = (productName) => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get(`/products/?name=${productName}&`);

//             dispatch(getProductsReducer(data));

//         } catch (error) {
//             dispatch(getProductsByNameReducer(productName));
//         }
        
//     };
// };

export const getSoldProducts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/products/sold");

            dispatch(getSoldProductsReducer(data));

        } catch (error) {
            console.error("Error retrieving sold products from the server: " + error.message);         
            return null;
        }
        
    };
};

// export const getSoldProductsLocal = () => {
//     return async (dispatch) => {
//         dispatch(getSoldProductsLocalReducer());
//     };
// };

export const getTopFiveProducts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/products/rating");

            dispatch(getTopFiveProductsReducer(data));
            
        } catch (error) {
            console.error("Error retrieving the five best-selling products from the server: " + error.message);         
            return null;
        }
    };
};

// export const getTopFiveProductsLocal = () => {
//     return async (dispatch) => {
//         dispatch(getTopFiveProductsLocalReducer());
//     };
// };

export const postProduct = (productData) => {
    return async (dispatch) => { 
        try {
            const response = await axios.post('/products', productData);
            return response;
        } catch (error) {
            console.error("Error creating product: " + error.message);         
            return null;
        }    
    };
};

/* export const postProduct = (productData) => {
    return async (dispatch) => {     
        const response = await axios.post('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    };
}; */

/* export const putProduct = (productData) => {    
    return async (dispatch) => {     
        const response = await axios.put('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    };
}; */

export const putProduct = (productData) => {    
    return async (dispatch) => { 
        try {
            const response = await axios.put('/products', productData);
            return response;
        } catch (error) {
            console.error("Error editing product: " + error.message);         
            return null;
        }    
    };
};

export const uploadImageToImgur = (compressedFile) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append('image', compressedFile);

        const response = await axios.post('https://api.imgur.com/3/image', formData, {
            headers: {

                //Usar este para testeos
                Authorization: `Client-ID ${imgurClientId}`,
                
                'Content-Type': 'multipart/form-data'
            },
            timeout: 10000, // Establece un tiempo de espera de 10 segundos
        });

        if (response.data.success) {
            const imageUrl = response.data.data.link;
            return imageUrl;
        } else {
            throw new Error('Error al subir la imagen a Imgur');
        }
    } catch (error) {
        console.error('Error en la subida de imagen a Imgur:', error);
        return null;
    }
};

// export const uploadImageToImgur = (compressedFile) => async (dispatch) => {
//     try {
//         const formData = new FormData();
//         formData.append('image', compressedFile);

//         const response = await axios.post('https://api.imgur.com/3/image', formData, {
//             headers: {

//                 //Usar este para testeos
//                 Authorization: `Client-ID ${imgurClientId}`,
                
//                 'Content-Type': 'multipart/form-data'
//             },
//             timeout: 10000, // Establece un tiempo de espera de 10 segundos
//         });

//         if (response.data.success) {
//             const imageUrl = response.data.data.link;
//             return imageUrl;
//         } else {
//             throw new Error('Error al subir la imagen a Imgur');
//         }
//     } catch (error) {
//         console.error('Error en la subida de imagen a Imgur:', error);
//         throw error;
//     }
// };

export const putProductStatus = (productId) => {    
    return async (dispatch) => {   
        try {
            const response = await axios.put(`/products/${productId}`);

            return response;

        } catch (error) {
            console.error("Error editing product status: " + error.message);         
            return null;
        }  
    };
};

export const putIncreasePrice = (productData) => {    
    return async (dispatch) => {     
        try {
            const response = await axios.put('/products/increasePrice', productData);

            return response;

        } catch (error) {
            console.error("Error editing product price: " + error.message);    

            return null;
        }
    };
};

export const reduceStock = (productData) => {
    return async () => {
        try {
            const { data } = await axios.put('/products/reduce', productData);
            
            return data;

        } catch (error) {
            console.error("Error when reducing product stock: " + error.message);         
            return null;
        }
        
    };
};

export const increaseStock = (productData) => {
    return async () => {
        try {
            const { data } = await axios.put('/products/increase', productData);

            return data;
            
        } catch (error) {
            console.error("Error when increasing product stock: " + error.message);         
            return null;
        }
        
    };
};

export const deleteProductById = (productId) => {
    return async (dispatch) =>{
        const { data } = await axios.put(`/products/deactive/${productId}`);
    };
};