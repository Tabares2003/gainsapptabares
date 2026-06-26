import React, { useState } from "react";
import "../screens/Login.css";

import firebaseApp from "../firebase/credenciales";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

function RegisterData({ user }) {

    const [nombre, setNombre] = useState(user.nombre || "");
    const [fechaNacimiento, setFechaNacimiento] = useState(user.fechaNacimiento || "");
    const [meta, setMeta] = useState(user.meta || "");
    const [picoyplaca, setPicoyplaca] = useState(user.picoyplaca || "");
    const [tipovehiculo, setTipoVehiculo] = useState(user.tipovehiculo || "");

    async function guardarDatos(e) {
        e.preventDefault();

        try {

            const docRef = doc(
                firestore,
                `usuarios/${user.uid}`
            );

            await updateDoc(docRef, {
                nombre,
                fechaNacimiento,
                meta,
                picoyplaca,
                tipovehiculo
            });

            alert("Datos actualizados correctamente");

        } catch (error) {
            console.error(error);
            alert("Error actualizando los datos");
        }
    }

    return (
        <div className="login-container">
            
            <form
                className="login-form"
                onSubmit={guardarDatos}
            >

                <h2>Completa tu perfil</h2>

                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) =>
                        setNombre(e.target.value)
                    }
                />

                <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) =>
                        setFechaNacimiento(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Meta"
                    value={meta}
                    onChange={(e) =>
                        setMeta(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Pico y placa"
                    value={picoyplaca}
                    onChange={(e) =>
                        setPicoyplaca(e.target.value)
                    }
                />

                <select
                    value={tipovehiculo}
                    onChange={(e) =>
                        setTipoVehiculo(e.target.value)
                    }
                >
                    <option value="">
                        Selecciona un vehículo
                    </option>

                    <option value="carro">
                        Carro
                    </option>

                    <option value="moto">
                        Moto
                    </option>

                    <option value="bicicleta">
                        Bicicleta
                    </option>

                    <option value="camion">
                        Camión
                    </option>
                </select>

                <button
                    className="button-submit"
                    type="submit"
                >
                    Guardar
                </button>

            </form>
        </div>
    );
}

export default RegisterData;