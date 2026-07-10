import React, { useEffect, useState } from "react";
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from "firebase/auth";
import RegisterData from '../components/registerData';
import { FaRegUser } from "react-icons/fa6"; 

import "react-calendar/dist/Calendar.css";

import { FiHome } from "react-icons/fi";
import { TiThMenuOutline } from "react-icons/ti";

import UserInfoTop from "./homeComponents/userInfoTop";

const auth = getAuth(firebaseApp);


function UserView({ user }) {

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const maxDate = new Date();

    maxDate.setMonth(maxDate.getMonth() + 1);
    maxDate.setDate(1);

    const minDate = new Date(2025, 0, 1); // Enero 2025




    const generateCalendar = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        const calendar = [];

        // Espacios vacíos al inicio
        for (let i = 0; i < startDay; i++) {
            calendar.push(null);
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            calendar.push(
                new Date(year, month, day)
            );
        }

        return calendar;
    };

    const days = generateCalendar(currentMonth);


    const nextMonth = () => {
        const next = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            1
        );

        if (next <= maxDate) {
            setCurrentMonth(next);
        }
    };

    const previousMonth = () => {
        const prev = new Date(currentMonth);

        prev.setMonth(
            prev.getMonth() - 1
        );

        if (prev >= minDate) {
            setCurrentMonth(prev);
        }
    };

    const [mostrarMenu, setMostrarMenu] = useState(true);

    useEffect(() => {
        let timeout;

        const handleScroll = () => {
            // Oculta inmediatamente al hacer scroll
            setMostrarMenu(false);

            // Limpia el timeout anterior
            clearTimeout(timeout);

            // Si deja de hacer scroll por 300ms, vuelve a aparecer
            timeout = setTimeout(() => {
                setMostrarMenu(true);
            }, 300);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timeout);
        };
    }, []);


    console.log("vehiculo seleccionado", user?.vehiculoseleccionado);






    return (
        <div className="user-view-container">
            {!user.meta ? (
                <RegisterData user={user} />
            ) : (
                <div className="login-form">


                    <div className="user-menu-home">

                        <UserInfoTop
                            user={user}
                            notifications={10}
                            onNotificationsClick={() => {
                                console.log("Abrir notificaciones");
                            }}
                        />



                        <div className="calendar">

                            <div className="calendar-header">
                                <button onClick={previousMonth}>
                                    ←
                                </button>

                                <h2>
                                    {currentMonth.toLocaleDateString(
                                        "es-CO",
                                        {
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </h2>

                                <button onClick={nextMonth}>
                                    →
                                </button>
                            </div>

                            <div className="calendar-grid">

                                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                                    (day) => (
                                        <div
                                            key={day}
                                            className="calendar-weekday"
                                        >
                                            {day}
                                        </div>
                                    )
                                )}

                                {days.map((day, index) => (
                                    <div
                                        key={index}
                                        className="calendar-day"
                                    >
                                        {day && (
                                            <span className="day-number">
                                                {day.getDate()}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>





                        <div
                            className={`bottom-floating-menu ${mostrarMenu ? "menu-visible" : "menu-hidden"
                                }`}
                        >
                            <button>
                                <TiThMenuOutline />
                            </button>
                            <button>
                                <FiHome />
                            </button>
                            <button onClick={() => signOut(auth)}>
                                <FaRegUser />
                            </button>
                        </div>
                    </div>

























                </div>
            )}


        </div>



    )
}

export default UserView