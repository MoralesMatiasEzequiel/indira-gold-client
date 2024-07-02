import React from "react";
import style from "./SideBar.module.css";
import { NavLink } from "react-router-dom";
import logo from "./img/logo.png";
import bg from "./img/sideBarBg.jpg";


const SideBar = () => {

    return(
        <div className={style.div}>
            <div className={style.bg}><img src={bg} alt=""/></div>
            <div className={style.content}>
                <h1><img src={logo} alt="Indira Gold"/></h1>
                <div>
                    <ul>
                        <li>
                            <NavLink to={"/main_window"}>
                                <div>
                                    <p>Ventas</p>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/main_window/products"}>
                                <div>
                                    <p>Productos</p>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/main_window/clients"}>
                                <div>
                                    <p>Clientes</p>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/main_window/stats"}>
                                <div>
                                    <p>Estadísticas</p>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default SideBar;