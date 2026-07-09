import React, { useEffect, useState } from "react";
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from "firebase/auth";
import RegisterData from '../components/registerData';

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const auth = getAuth(firebaseApp);



const formatearFecha = (fecha) => {
    return fecha.toISOString().split("T")[0];
};

const formatearNumero = (numero) => {
    return numero.toLocaleString("es-CO");
};


const ingresos = {
    "2026-07-08": [
        {
            total: 50000,
            plataforma: "Uber",
        },
        {
            total: 30000,
            plataforma: "Didi",
        },
        {
            total: 20000,
            plataforma: "Rappi",
        },
    ],

    "2026-07-09": [
        {
            total: 70000,
            plataforma: "Uber",
        },
    ],
};


function UserView({ user }) {


    const [mostrarTodoMes, setMostrarTodoMes] = useState(false);

    console.log("Usuario en userView:", user); 



    const diasSemana = [];

    const inicioSemana = new Date();
    const diaActual = inicioSemana.getDay();
    const diferencia = diaActual === 0 ? -6 : 1 - diaActual;

    inicioSemana.setDate(
        inicioSemana.getDate() + diferencia
    );

    for (let i = 0; i < 7; i++) {
        const fecha = new Date(inicioSemana);
        fecha.setDate(inicioSemana.getDate() + i);

        diasSemana.push(fecha);
    }

    const [mostrarMenu, setMostrarMenu] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setMostrarMenu(window.scrollY < 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="user-view-container">
            {!user.meta ? (
                <RegisterData user={user} />
            ) : (
                <div className="login-form">
                    {/* Se muestra cuando meta tiene contenido */}
                    <p>Meta: {user.meta}</p>

                    <div className="user-menu-home">
                        <p>home</p>


  {
                        !mostrarTodoMes ? (

                            <div className="semanaActual">

                                {diasSemana.map((dia) => {

                                    const fecha = formatearFecha(dia);

                                    const ingresosDia =
                                        ingresos[fecha] || [];

                                    const totalDia =
                                        ingresosDia.reduce(
                                            (acc, item) =>
                                                acc + item.total,
                                            0
                                        );

                                    return (
                                        <div
                                            key={fecha}
                                            className={`diaSemana ${formatearFecha(new Date()) === fecha
                                                    ? "diaActual"
                                                    : ""
                                                }`}
                                        >
                                            <div className="numeroDia">
                                                {dia.getDate()}
                                            </div>

                                            {ingresosDia.length > 0 && (
                                                <>
                                                    <div className="ingresoSemana">
                                                        $
                                                        {formatearNumero(totalDia)}
                                                    </div>

                                                    <div className="plataformaSemana">
                                                        {
                                                            ingresosDia
                                                                .map(
                                                                    x =>
                                                                        x.plataforma
                                                                )
                                                                .join(", ")
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>

                        ) : (

                            <Calendar
                                tileContent={({ date, view }) => {
                                    if (view !== "month")
                                        return null;

                                    const fecha =
                                        formatearFecha(date);

                                    const ingresosDia =
                                        ingresos[fecha] || [];

                                    const totalDia =
                                        ingresosDia.reduce(
                                            (acc, item) =>
                                                acc + item.total,
                                            0
                                        );

                                    if (ingresosDia.length === 0)
                                        return null;

                                    return (
                                        <div className="contenidoDia">
                                            <div className="ingresoDia">
                                                $
                                                {formatearNumero(totalDia)}
                                            </div>
                                        </div>
                                    );
                                }}
                            />

                        )
                    }
                     {
                        !mostrarTodoMes ? (

                            <div className="semanaActual">

                                {diasSemana.map((dia) => {

                                    const fecha = formatearFecha(dia);

                                    const ingresosDia =
                                        ingresos[fecha] || [];

                                    const totalDia =
                                        ingresosDia.reduce(
                                            (acc, item) =>
                                                acc + item.total,
                                            0
                                        );

                                    return (
                                        <div
                                            key={fecha}
                                            className={`diaSemana ${formatearFecha(new Date()) === fecha
                                                    ? "diaActual"
                                                    : ""
                                                }`}
                                        >
                                            <div className="numeroDia">
                                                {dia.getDate()}
                                            </div>

                                            {ingresosDia.length > 0 && (
                                                <>
                                                    <div className="ingresoSemana">
                                                        $
                                                        {formatearNumero(totalDia)}
                                                    </div>

                                                    <div className="plataformaSemana">
                                                        {
                                                            ingresosDia
                                                                .map(
                                                                    x =>
                                                                        x.plataforma
                                                                )
                                                                .join(", ")
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>

                        ) : (

                            <Calendar
                                tileContent={({ date, view }) => {
                                    if (view !== "month")
                                        return null;

                                    const fecha =
                                        formatearFecha(date);

                                    const ingresosDia =
                                        ingresos[fecha] || [];

                                    const totalDia =
                                        ingresosDia.reduce(
                                            (acc, item) =>
                                                acc + item.total,
                                            0
                                        );

                                    if (ingresosDia.length === 0)
                                        return null;

                                    return (
                                        <div className="contenidoDia">
                                            <div className="ingresoDia">
                                                $
                                                {formatearNumero(totalDia)}
                                            </div>
                                        </div>
                                    );
                                }}
                            />

                        )
                    }
                        <div
                            className={`bottom-floating-menu ${mostrarMenu ? "menu-visible" : "menu-hidden"
                                }`}
                        >
                            <button>🏠</button>
                            <button>🔍</button>
                            <button>👤</button>
                        </div>
                    </div>






















            
 

                </div>
            )}

            <button
                onClick={() =>
                    setMostrarTodoMes(
                        !mostrarTodoMes
                    )
                }
            >
                {
                    mostrarTodoMes
                        ? "Ver semana actual"
                        : "Ver mes completo"
                }
            </button>

            <button onClick={() => signOut(auth)}>
                Cerrar Sesión
            </button>

        </div>



    )
}

export default UserView