import React, { useEffect, useState, useMemo, useCallback } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from "@material-ui/core";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp,
    collection,
    getDocs,
    query,
    where,
    documentId,
} from "firebase/firestore";

const auth = getAuth(firebaseApp);

const VIEW_TYPES = {
    MONTH: "month",
    WEEK: "week",
    FORTNIGHT: "fortnight",
}; 
 

const formatearNumero = (valor) => {
    if (!valor) return "";

    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};


function UserView({ user }) {

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

    const db = getFirestore();



    const [currentDate, setCurrentDate] = useState(
        new Date()
    );


    const [viewType, setViewType] = useState(
        VIEW_TYPES.MONTH
    );


    const generateCalendar = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        const calendar = [];

        for (let i = 0; i < startDay; i++) {
            calendar.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendar.push(
                new Date(year, month, day)
            );
        }

        return calendar;
    };

    const days = useMemo(() => {
        if (viewType === VIEW_TYPES.MONTH) {
            return generateCalendar(currentDate);
        }

        if (viewType === VIEW_TYPES.WEEK) {
            return getWeekDays(currentDate);
        }

        if (viewType === VIEW_TYPES.FORTNIGHT) {
            return getFortnightDays(currentDate);
        }

        return [];
    }, [
        currentDate,
        viewType
    ]);

    const formatearFechaFirestore = (fecha) => {
        const year = fecha.getFullYear();

        const month = String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            fecha.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    const [ingresos, setIngresos] = useState({});

    const obtenerIngresos = useCallback(async () => {
        try {
            const validDays = days.filter(Boolean);

            if (!validDays.length) {
                return;
            }

            const fechaInicio =
                obtenerFechaId(validDays[0]);

            const fechaFin =
                obtenerFechaId(
                    validDays[validDays.length - 1]
                );

            const q = query(
                collection(
                    db,
                    "usuarios",
                    user.uid,
                    "ingresos"
                ),
                where(
                    documentId(),
                    ">=",
                    fechaInicio
                ),
                where(
                    documentId(),
                    "<=",
                    fechaFin
                )
            );

            const snapshot = await getDocs(q);

            const datos = {};

            snapshot.forEach((doc) => {
                datos[doc.id] = doc.data();
            });

            setIngresos(datos);
        } catch (error) {
            console.log(error);
        }
    }, [days,
        user?.uid,
        db]);

    useEffect(() => {
        if (user?.uid) {
            obtenerIngresos();
        }
    }, [
        obtenerIngresos,
        user?.uid
    ]);

    const obtenerFechaId = (fecha) => {
        const year = fecha.getFullYear();

        const month = String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            fecha.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    const isToday = (date) => {
        if (!date) return false;

        const today = new Date();

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };






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

    const abrirIngresoDialog = (day) => {
        if (!day) {
            return;
        }

        const fechaId =
            formatearFechaFirestore(day);

        const ingreso =
            ingresos[fechaId];

        setSelectedDate(day);

        if (ingreso) {
            setBrutoTotal(
                ingreso.brutoTotal
            );

            setNetoTotal(
                ingreso.netoTotal
            );
        } else {
            setBrutoTotal("");
            setNetoTotal("");
        }

        setOpenIngresoDialog(true);
    };

    const [openIngresoDialog, setOpenIngresoDialog] =
        useState(false);

    const [selectedDate, setSelectedDate] =
        useState(null);

    const [brutoTotal, setBrutoTotal] =
        useState("");

    const [netoTotal, setNetoTotal] =
        useState("");




    const guardarIngresoDia = async () => {
        try {
            if (!selectedDate) {
                return;
            }

            const fechaId =
                formatearFechaFirestore(
                    selectedDate
                );

            const data = {
                fecha: fechaId,

                brutoTotal:
                    Number(brutoTotal) || 0,

                netoTotal:
                    Number(netoTotal) || 0,

                updatedAt:
                    serverTimestamp(),
            };

            const ingresoActual =
                ingresos[fechaId];

            if (!ingresoActual) {
                data.createdAt =
                    serverTimestamp();
            }

            await setDoc(
                doc(
                    db,
                    "usuarios",
                    user.uid,
                    "ingresos",
                    fechaId
                ),
                data,
                {
                    merge: true,
                }
            );

            await obtenerIngresos();

            setOpenIngresoDialog(false);

        } catch (error) {
            console.log(error);
        }
    };

    const totalPeriodo = Object.values(
        ingresos
    ).reduce(
        (total, ingreso) =>
            total +
            (ingreso.netoTotal || 0),
        0
    );

    const obtenerMetaPeriodo = () => {
        const metaSemanal =
            Number(user?.meta || 0);

        if (
            viewType ===
            VIEW_TYPES.WEEK
        ) {
            return metaSemanal;
        }

        if (
            viewType ===
            VIEW_TYPES.FORTNIGHT
        ) {
            return metaSemanal * 2;
        }

        if (
            viewType ===
            VIEW_TYPES.MONTH
        ) {
            const semanas =
                Math.ceil(
                    days.filter(Boolean)
                        .length / 7
                );

            return (
                metaSemanal *
                semanas
            );
        }

        return metaSemanal;
    };

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    const validDays =
        days.filter(Boolean);

    const ultimoDia =
        validDays[
        validDays.length - 1
        ];

    const periodoFinalizado =
        ultimoDia < hoy;



    const nombrePeriodo = {
        [VIEW_TYPES.WEEK]: "semana",
        [VIEW_TYPES.FORTNIGHT]:
            "quincena",
        [VIEW_TYPES.MONTH]: "mes",
    };


    const metaPeriodo =
        obtenerMetaPeriodo();

    const porcentaje =
        metaPeriodo > 0
            ? Math.min(
                (totalPeriodo /
                    metaPeriodo) *
                100,
                100
            )
            : 0;

    const metaCompletada =
        totalPeriodo >= metaPeriodo;

    const dineroExtra =
        totalPeriodo - metaPeriodo;

    const dineroFaltante =
        metaPeriodo - totalPeriodo;

    const obtenerMensajeMeta = () => {
        const periodo =
            nombrePeriodo[viewType];

        const porcentajeFaltante =
            Math.max(
                100 - porcentaje,
                0
            );

        if (metaCompletada) {
            if (dineroExtra > 0) {
                return `¡Excelente! En este ${periodo} completaste tu meta y además generaste $${formatearNumero(
                    dineroExtra
                )} extra.`;
            }

            return `¡Excelente! En este ${periodo} completaste tu meta exitosamente.`;
        }

        // El período ya terminó
        if (periodoFinalizado) {
            return `En este ${periodo} te quedaste a ${porcentajeFaltante.toFixed(
                0
            )}% y $${formatearNumero(
                dineroFaltante
            )} de completar tu meta.`;
        }

        // El período sigue en curso
        return `En este ${periodo} llevas ${porcentaje.toFixed(
            0
        )}% de tu meta y te faltan $${formatearNumero(
            dineroFaltante
        )} para alcanzarla.`;
    };

    const obtenerColoresBarra = () => {
        if (metaCompletada) {
            return {
                progreso: "#4CAF50",
                fondo: "#E8F5E9",
            };
        }

        if (periodoFallido) {
            return {
                progreso: "#f44336",
                fondo: "#fe96a1",
            };
        }

        return {
            progreso: "#2d79f3",
            fondo: "#E3F2FD",
        };
    };

    const periodoFallido =
        periodoFinalizado &&
        !metaCompletada;

    const coloresBarra =
        obtenerColoresBarra(); 

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

                                {days.map((day, index) => {

                                    const fechaId =
                                        day &&
                                        obtenerFechaId(day);

                                    const ingresoDia =
                                        fechaId &&
                                        ingresos[fechaId];

                                    return (
                                        <div
                                            key={index}
                                            className="calendar-day"
                                            onClick={() => abrirIngresoDialog(day)}
                                        >
                                            {day && (
                                                <>
                                                    <span
                                                        className={`day-number ${isToday(day)
                                                            ? "today-number"
                                                            : ""
                                                            }`}
                                                    >
                                                        {day.getDate()}
                                                    </span>

                                                    {ingresoDia && (
                                                        <div className="calendar-income">
                                                            <h4>
                                                                ${ingresoDia.netoTotal.toLocaleString()}
                                                            </h4>

                                                            <p>
                                                                {ingresoDia.brutoTotal.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="meta-container">
                            <div className="meta-title">
                                <h3>Estadisticas</h3>
                            </div>

                            <div className="meta-porcentaje">
                                {obtenerMensajeMeta()}
                            </div>

                            <div
                                className="meta-barra"
                                style={{
                                    backgroundColor:
                                        coloresBarra.fondo,
                                }}
                            >
                                <div
                                    className="meta-barra-progreso"
                                    style={{
                                        width: `${Math.min(
                                            porcentaje,
                                            100
                                        )}%`,
                                        backgroundColor:
                                            coloresBarra.progreso,
                                    }}
                                />
                            </div>

                            <div className="meta-valores">
                                $
                                {formatearNumero(totalPeriodo)}
                                {" / "}
                                $
                                {formatearNumero(metaPeriodo)}
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

            <Dialog
                open={openIngresoDialog}
                onClose={() =>
                    setOpenIngresoDialog(false)
                }
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    {selectedDate?.toLocaleDateString(
                        "es-CO"
                    )}
                </DialogTitle>

                <DialogContent>

                    <TextField
                        label="Ingreso bruto"
                        fullWidth
                        margin="normal"
                        value={brutoTotal}
                        onChange={(e) =>
                            setBrutoTotal(
                                e.target.value
                            )
                        }
                        type="number"
                    />

                    <TextField
                        label="Ingresos totales"
                        fullWidth
                        margin="normal"
                        value={netoTotal}
                        onChange={(e) =>
                            setNetoTotal(
                                e.target.value
                            )
                        }
                        type="number"
                    />

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenIngresoDialog(false)
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        color="primary"
                        variant="contained"
                        onClick={
                            guardarIngresoDia
                        }
                    >
                        Guardar
                    </Button>

                </DialogActions>
            </Dialog>


        </div>



    )
}

export default UserView