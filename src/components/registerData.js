import React, { useEffect, useState } from "react";
import "../screens/Login.css";

import firebaseApp from "../firebase/credenciales";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { makeStyles } from "@material-ui/core/styles";
import {
    Select,
    MenuItem,
} from "@material-ui/core";

import {
    collection,
    getDocs,
} from "firebase/firestore";


const formatearNumero = (valor) => {
    if (!valor) return "";

    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatearPlaca = (valor) => {
    if (!valor) return "";

    const limpio = valor
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 6);

    if (limpio.length <= 3) return limpio;

    return `${limpio.slice(0, 3)} - ${limpio.slice(3)}`;
};


const firestore = getFirestore(firebaseApp);


const useStyles = makeStyles({
    outlinedInput: {
        borderRadius: 10,
        color: "#fff", // Color del texto que escribe el usuario

        "& input::placeholder": {
            color: "#fff", // Color del placeholder
            opacity: 1,    // Necesario para que no se vea transparente
        },

        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1565c0",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
            borderWidth: 2,
        },
    },
});

function RegisterData({ user }) {

    const [tiposVehiculo, setTiposVehiculo] = useState([]);



    const [nombre, setNombre] = useState(user.nombre || "");
    const [meta, setMeta] = useState(user.meta || "");
    const [placavehiculo, setPlacaVehiculo] = useState(user.placavehiculo || "");
    const [tipovehiculo, setTipoVehiculo] = useState(user.tipovehiculo || "");
    const [diaslaborales, setDiasLaborales] = useState(user.diaslaborales || "");

    const metaNumerica = Number(meta) || 0;
    const dias = Number(diaslaborales) || 0;


    const requierePlaca = ["1", "2"].includes(tipovehiculo);


    // Meta aproximada por día
    const metaDiaria =
        dias > 0 ? Math.round(metaNumerica / dias) : 0;

    // Meta aproximada por mes (4 semanas)
    const metaMensual = metaNumerica * 4;

    const formatearNumero = (valor) => {
        if (!valor) return "";

        return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handlePlacaChange = (e) => {
        const limpio = e.target.value
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase()
            .slice(0, 6);

        setPlacaVehiculo(limpio);
    };

    async function guardarDatos(e) {
        e.preventDefault();

        try {

            const docRef = doc(
                firestore,
                `usuarios/${user.uid}`
            );

            await updateDoc(docRef, {
                nombre,
                meta,
                placavehiculo,
                tipovehiculo,
                diaslaborales: Number(diaslaborales),
            });

            alert("Datos actualizados correctamente");

        } catch (error) {
            console.error(error);
            alert("Error actualizando los datos");
        }
    }


    const handleMetaChange = (e) => {

        // Elimina todo lo que no sea número
        const soloNumeros = e.target.value.replace(/\D/g, "");

        // Guarda únicamente el número limpio
        setMeta(soloNumeros);
    };


    const classes = useStyles();



    useEffect(() => {

        const cargarTiposVehiculo = async () => {

            try {

                const querySnapshot = await getDocs(
                    collection(firestore, "tipovehiculos")
                );

                const tipos = [];

                querySnapshot.forEach((doc) => {

                    tipos.push({
                        id: doc.id,
                        ...doc.data(),
                    });

                });

                // Ordena por el id (1,2,3,4,5)
                tipos.sort((a, b) => Number(a.id) - Number(b.id));

                setTiposVehiculo(tipos);

                console.log("Tipos de vehículo cargados:", tipos);

            } catch (error) {
                console.error(error);
            }

        };

        cargarTiposVehiculo();

    }, []);

    console.log("tipovehiculo:", tipovehiculo, typeof tipovehiculo);

    return (
        <div className="login-container">
            <div className="form-register">
                <form
                    className="form-container"
                    onSubmit={guardarDatos}
                >

                    <div className="form-header-title">
                        <h1>Completa tu perfil</h1>
                    </div>

                    <div className="formInputNormal">
                        <h3>Nombre o apodo preferido</h3>
                        <FormControl fullWidth variant="outlined">
                            <OutlinedInput
                                className={classes.outlinedInput}
                                placeholder=" "
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                maxlength={10}
                            />
                        </FormControl>
                    </div>



                    <div className="formInputNormal">
                        <h3>Meta semanal aproximada</h3>
                        <OutlinedInput
                            className={classes.outlinedInput}
                            value={formatearNumero(meta)}
                            onChange={handleMetaChange}
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                maxLength: 13,
                            }}
                        />
                    </div>

                    <div className="formInputNormal">
                        <h3>Días laborales por semana</h3>

                        <FormControl fullWidth variant="outlined">
                            <Select
                                value={diaslaborales}
                                onChange={(e) => setDiasLaborales(e.target.value)}
                                className={classes.outlinedInput}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    <em>Seleccione</em>
                                </MenuItem>

                                {[1, 2, 3, 4, 5, 6, 7].map((dia) => (
                                    <MenuItem key={dia} value={dia}>
                                        {dia}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="formInputNormal">
                        <h3>Meta diaria aproximada</h3>

                        <OutlinedInput
                            className={classes.outlinedInput}
                            value={formatearNumero(metaDiaria)}
                            readOnly
                        />
                    </div>

                    <div className="formInputNormal">
                        <h3>Total mensual aproximado</h3>

                        <OutlinedInput
                            className={classes.outlinedInput}
                            value={formatearNumero(metaMensual)}
                            readOnly
                        />
                    </div>

                    <div className="formInputNormal">
                        <h3>Tipo de vehículo</h3>

                        <FormControl fullWidth variant="outlined">
                            <Select
                                value={tipovehiculo}
                                onChange={(e) => {
                                    const valor = e.target.value;

                                    setTipoVehiculo(valor);

                                    if (!["1", "2"].includes(String(valor))) {
                                        setPlacaVehiculo("");
                                    }
                                }}
                                className={classes.outlinedInput}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    <em>Seleccione un vehículo</em>
                                </MenuItem>

                                {tiposVehiculo?.map((tipo) => (
                                    <MenuItem
                                        key={tipo.id}
                                        value={tipo.id}
                                    >
                                        {tipo.tipoveh}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    {requierePlaca && (
                        <div className="formInputNormal">
                            <h3>Placa Vehículo</h3>

                            <OutlinedInput
                                className={classes.outlinedInput}
                                value={formatearPlaca(placavehiculo)}
                                onChange={handlePlacaChange}
                            />
                        </div>
                    )}

                     <div className="formInputNormal">
                        <h3>Tipo de trabajo</h3>

                         
                    </div>


                    <button
                        className="button-submit"
                        type="submit"
                    >
                        Guardar
                    </button>

                </form>

            </div>






        </div>
    );
}

export default RegisterData;