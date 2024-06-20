import React from "react";
import { NavLink } from "react-router-dom";


const SideBar = () => {

    return(
        <div>
            <p>Indira Gold</p>
            <div>
                <ul>
                    <li>
                        <NavLink to={"/main_window/sales"}>
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
                        <NavLink to={"/main_window/stats"}>
                            <div>
                                <p>Estadísticas</p>
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
                </ul>
            </div>
        </div>
    )
};

export default SideBar;