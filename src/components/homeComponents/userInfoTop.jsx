import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

const UserInfoTop = ({
    user,
    notifications = 0,
    onNotificationsClick,
}) => {
    if (!user) return null;
    
    return (
        <div className="user-info-top">
            <div className="user-info-top-left">
                <img
                    src={`/vehiculos/${user?.vehiculoseleccionado}.png`}
                    alt="Vehículo del usuario"
                />

                <div>
                    <h5>GainsApp</h5>
                    <p>Hola, {user?.nombre}</p>
                </div>
            </div>

            <div className="user-info-top-right">
                <div className="notification-container">
                    <button
                        className="notification-button"
                        onClick={onNotificationsClick}
                    >
                        <IoMdNotificationsOutline />

                        {notifications > 0 && (
                            <span className="notification-badge">
                                {notifications > 99
                                    ? "99+"
                                    : notifications}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserInfoTop;