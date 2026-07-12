import React, { useEffect, useState } from "react";
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from "firebase/auth";
import RegisterData from '../components/registerData';
import { FaRegUser } from "react-icons/fa6";

import "react-calendar/dist/Calendar.css";

import { FiHome } from "react-icons/fi";
import { TiThMenuOutline } from "react-icons/ti";
import { TiChevronRightOutline } from "react-icons/ti";
import { TiChevronLeftOutline } from "react-icons/ti";
import UserInfoTop from "./homeComponents/userInfoTop";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import {
    Select,
    MenuItem,
} from "@material-ui/core";

const auth = getAuth(firebaseApp);


function UserView({ user }) {

    const isToday = (date) => {
        if (!date) return false;

        const today = new Date();

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const VIEW_TYPES = {
        MONTH: "month",
        WEEK: "week",
        FORTNIGHT: "fortnight",
    };

    const [viewType, setViewType] = useState(
        VIEW_TYPES.MONTH
    );

    const [currentDate, setCurrentDate] = useState(
        new Date()
    );


    const maxDate = new Date();

    maxDate.setMonth(maxDate.getMonth() + 1);
    maxDate.setDate(1);

    const useStyles = makeStyles({
        outlinedInput: {
            borderRadius: 10,
            color: "#000000",
            width: '150px',
            fontSize: '13px',

            "& input::placeholder": {
                color: "#fff", // Color del placeholder
                opacity: 1,    // Necesario para que no se vea transparente
            },

            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000000",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000000",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000000",
                borderWidth: 2,
            },
        },
    });


    const getWeekDays = (date) => {
        const current = new Date(date);

        let day = current.getDay();

        // Si es domingo (0), lo convertimos en 7
        if (day === 0) {
            day = 7;
        }

        // Retroceder hasta el lunes
        current.setDate(
            current.getDate() - day + 1
        );

        const week = [];

        for (let i = 0; i < 7; i++) {
            week.push(
                new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    current.getDate() + i
                )
            );
        }

        return week;
    };

    const getFortnightDays = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const days = [];

        let startDay;
        let endDay;

        // Primera quincena
        if (day <= 15) {
            startDay = 1;
            endDay = 15;
        }
        // Segunda quincena
        else {
            startDay = 16;
            endDay = new Date(
                year,
                month + 1,
                0
            ).getDate();
        }

        for (
            let d = startDay;
            d <= endDay;
            d++
        ) {
            days.push(
                new Date(
                    year,
                    month,
                    d
                )
            );
        }

        return days;
    };


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

    let days = [];

    if (viewType === VIEW_TYPES.MONTH) {
        days = generateCalendar(currentDate);
    }

    if (viewType === VIEW_TYPES.WEEK) {
        days = getWeekDays(currentDate);
    }

    if (viewType === VIEW_TYPES.FORTNIGHT) {
        days = getFortnightDays(currentDate);
    }


    const next = () => {
        const date = new Date(currentDate);

        if (viewType === VIEW_TYPES.MONTH) {
            date.setMonth(
                date.getMonth() + 1
            );
        }

        if (viewType === VIEW_TYPES.WEEK) {
            date.setDate(
                date.getDate() + 7
            );
        }

        if (viewType === VIEW_TYPES.FORTNIGHT) {
            if (currentDate.getDate() <= 15) {
                date.setDate(16);
            } else {
                date.setMonth(
                    date.getMonth() + 1
                );
                date.setDate(1);
            }
        }

        setCurrentDate(date);
    };

    const previous = () => {
        const date = new Date(currentDate);

        if (viewType === VIEW_TYPES.MONTH) {
            date.setMonth(date.getMonth() - 1);
        }

        if (viewType === VIEW_TYPES.WEEK) {
            date.setDate(date.getDate() - 7);
        }

        if (viewType === VIEW_TYPES.FORTNIGHT) {
            if (currentDate.getDate() > 15) {
                date.setDate(1);
            } else {
                date.setMonth(date.getMonth() - 1);
                date.setDate(16);
            }
        }

        setCurrentDate(date);
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

    const getCalendarTitle = () => {
        const months = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];

        const monthslight = [
            "En",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sept",
            "Oct",
            "Nov",
            "Dic",
        ];


        if (!days.length) {
            return "";
        }

        const firstDay = days.find(
            day => day !== null
        );

        const lastDay = [...days]
            .reverse()
            .find(day => day !== null);

        if (!firstDay || !lastDay) {
            return "";
        }

        const firstMonth = firstDay.getMonth();
        const lastMonth = lastDay.getMonth();

        const firstYear = firstDay.getFullYear();
        const lastYear = lastDay.getFullYear();

        if (
            firstMonth === lastMonth &&
            firstYear === lastYear
        ) {
            return `${months[firstMonth]} ${firstYear}`;
        }

        if (firstYear === lastYear) {
            return `${monthslight[firstMonth]} - ${monthslight[lastMonth]} ${firstYear}`;
        }

        return `${monthslight[firstMonth]} ${firstYear} - ${monthslight[lastMonth]} ${lastYear}`;
    };

    const viewOptions = [
        {
            value: VIEW_TYPES.MONTH,
            label: "Vista mes",
        },
        {
            value: VIEW_TYPES.WEEK,
            label: "Mostrar semana",
        },
        {
            value: VIEW_TYPES.FORTNIGHT,
            label: "Mostrar quincena",
        },
    ];

    const classes = useStyles();

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

                            <div className="calendar-title-top">
                                <div className="calendar-header">
                                    <button onClick={previous}>
                                        <TiChevronLeftOutline />
                                    </button>

                                    <h2>
                                        {getCalendarTitle()}
                                    </h2>

                                    <button onClick={next}>
                                        <TiChevronRightOutline />
                                    </button>
                                </div>

                                <FormControl
                                    variant="outlined"
                                    size="small"
                                >
                                    <Select
                                        value={viewType}
                                        onChange={(e) =>
                                            setViewType(e.target.value)
                                        }
                                        className={classes.outlinedInput}
                                    >
                                        {viewOptions.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>



                            <div className="calendar-grid">

                                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
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
                                            <span
                                                className={`day-number ${isToday(day) ? "today-number" : ""
                                                    }`}
                                            >
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