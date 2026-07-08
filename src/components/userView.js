import React from 'react'
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from "firebase/auth";
import RegisterData from '../components/registerData';

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const auth = getAuth(firebaseApp);



const ingresos = {
    "2026-07-05": {
        total: 70000,
        plataforma: "Uber",
    },
    "2026-07-06": {
        total: 120000,
        plataforma: "Didi",
    },
    "2026-07-11": {
        total: 85000,
        plataforma: "Rappi",
    },
    "2026-07-15": {
        total: 200000,
        plataforma: "InDrive",
    },
};

const formatearFecha = (fecha) => {
    return fecha.toISOString().split("T")[0];
};

const formatearNumero = (numero) => {
    return numero.toLocaleString("es-CO");
};

function userView({ user }) {


    console.log("Usuario en userView:", user);

    return (
        <div className="user-view-container">
            {!user.meta ? (
                <RegisterData user={user} />
            ) : (
                <div className="login-form">
                    {/* Se muestra cuando meta tiene contenido */}
                    <p>Meta: {user.meta}</p>

                    <Calendar
                        tileContent={({ date, view }) => {
                            if (view !== "month") return null;

                            const fecha = formatearFecha(date);
                            const ingreso = ingresos[fecha];

                            if (!ingreso) return null;

                            return (
                                <div className="contenidoDia">
                                    <div className="ingresoDia">
                                        ${formatearNumero(ingreso.total)}
                                    </div>

                                    <div className="plataformaDia">
                                        {ingreso.plataforma}
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            )}

            <button onClick={() => signOut(auth)}>
                Cerrar Sesión
            </button>

        </div>



    )
}

export default userView