import React, { useState, useEffect } from "react";
import style from "./SideBar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./img/logo.png";
import bg from "./img/sideBarBg.jpg";
import item from "./img/item.png";
import itemSelected from "./img/itemSelected.png";

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [subMenuVisible, setSubMenuVisible] = useState(false);

    const handleClick = (name) => {
        if (name !== 'products') {
            setSubMenuVisible(false);
        }

        if(name === 'clients'){
            navigate('/main_window/clients');
        }

        if(name === 'sales'){
            navigate('/');
        }

        if(name === 'stats'){
            navigate('/main_window/stats');
        }
    };

    const toggleSubMenu = (event) => {
        setSubMenuVisible(!subMenuVisible);
    };

    return (
        <div className={style.div}>
            <div className={style.bg}><img src={bg} alt=""/></div>
            <div className={style.content}>
                <h1><img src={logo} alt="Indira Gold"/></h1>
                <div className={style.nav}>
                    <ul>                                
                        <div className={`${style.NavLink} ${location.pathname === '/' ? style.selected : ''}`}  onClick={() => handleClick('sales')}>
                            <li>
                                <div className={style.icon}></div>
                                <div className={style.text}>
                                    <div>
                                        <p>Ventas</p>
                                    </div>
                                </div>
                            </li>
                        </div>
                        <li className={`${style.NavLink} ${subMenuVisible ? style.selected : ''}`} onClick={toggleSubMenu}>
                            <div className={style.icon}><img src={`${subMenuVisible ? itemSelected : item}`} alt=""/></div>
                            <div className={style.text}>
                                <div className={`${style.NavLink} ${location.pathname.includes('/main_window/products/form') ? style.selected : ''}` } onClick={() => navigate('/main_window/products/form')}>
                                    <div>
                                        <p>Productos</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        {subMenuVisible && (
                            <div className={`${style.subMenu} ${subMenuVisible ? style.subMenuVisible : ''}`}>
                                <ul>
                                    <li onClick={() => navigate('/main_window/products/form')}>
                                        <div
                                            className={`${style.NavLink} ${location.pathname === '/main_window/products/form' ? style.selected : ''}`}
                                        >
                                            <div>
                                                <p>Nuevo Producto</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li onClick={() => navigate('/main_window/products/management')}>
                                        <div
                                            className={`${style.NavLink} ${location.pathname === '/main_window/products/management' ? style.selected : ''}`}
                                        >
                                            <div>
                                                <p>Gestión de Productos</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li onClick={() => navigate('/main_window/products/edit/price')}>
                                        <div
                                            className={`${style.NavLink} ${location.pathname === '/main_window/products/edit/price' ? style.selected : ''}`}
                                        >
                                            <div>
                                                <p>Gestión de Precios</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )}
                        <div className={`${style.NavLink} ${location.pathname === '/main_window/clients' ? style.selected : ''}`} onClick={() => handleClick('clients')}>
                            <li>
                                <div className={style.icon}></div>
                                <div className={style.text}>
                                    <div>
                                        <p>Clientes</p>
                                    </div>
                                </div>
                            </li>
                        </div>
                        <div className={`${style.NavLink} ${location.pathname === '/main_window/stats' ? style.selected : ''}`} onClick={() => handleClick('stats')}>
                            <li>
                                <div className={style.icon}></div>
                                <div className={style.text}>
                                    <div>
                                        <p>Estadísticas</p>
                                    </div>
                                </div>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideBar;