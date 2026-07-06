import React, { useEffect, useState } from "react";
import "../screens/Login.css";

import firebaseApp from "../firebase/credenciales";
import {
    getFirestore, collection,
    getDocs,
    doc, updateDoc
} from "firebase/firestore";

import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { makeStyles } from "@material-ui/core/styles";
import {
    Select,
    MenuItem,
} from "@material-ui/core";

import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert"

const capitalizarPalabras = (texto) => {
    return texto?.replace(/\b\w/g, (letra) => letra?.toUpperCase());
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

    const [open, setOpen] = useState(false);

    const [snackbar, setSnackbar] = useState({
        message: "",
        severity: "success",
    });

    const notify = (message, severity = "success") => {
        setSnackbar({
            message,
            severity,
        });

        setOpen(true);
    };

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };


    const [tiposVehiculo, setTiposVehiculo] = useState([]);
    const [plataformasDB, setPlataformasDB] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);

    const [nombre, setNombre] = useState(user.nombre || "");
    const [meta, setMeta] = useState(user.meta || "");
    const [placavehiculo, setPlacaVehiculo] = useState(user.placavehiculo || "");
    const [tipovehiculo, setTipoVehiculo] = useState(user.tipovehiculo || "");
    const [diaslaborales, setDiasLaborales] = useState(user.diaslaborales || "");
    const [tipotrabajo, setTipoTrabajo] = useState(user.tipotrabajo || "");

    const [vehiculoseleccionado, setVehiculoSeleccionado] = useState(
        user.vehiculoseleccionado || ""
    );

    const vehiculosMostrar = vehiculos.filter(
        (vehiculo) =>
            Number(vehiculo.tipovehiculo) === Number(tipovehiculo)
    );

    const [plataformas, setPlataformas] = useState(user.plataformasuser || []);

    const plataformasMostrar = plataformasDB.filter((p) => {

        // Si eligió "Ambos", mostrar todas
        if (Number(tipotrabajo) === 3) {
            return true;
        }

        // Conductor
        if (Number(tipotrabajo) === 1) {
            return (
                p.tipoplataforma === "conductor" ||
                p.tipoplataforma === "ambos"
            );
        }

        // Repartidor
        if (Number(tipotrabajo) === 2) {
            return (
                p.tipoplataforma === "repartidor" ||
                p.tipoplataforma === "ambos"
            );
        }

        return false;

    });

    const tiposTrabajo = [
        {
            id: 1,
            imagen: "1.png",
            nombre: "Conductor",
        },
        {
            id: 2,
            imagen: "2.png",
            nombre: "Repartidor",
        },
        {
            id: 3,
            imagen: "3.png",
            nombre: "Ambos",
        },
    ];

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

    const validarFormulario = () => {

        if (!nombre.trim()) {

            notify(
                "Debes ingresar un nombre o apodo.",
                "warning"
            );

            return false;
        }

        if (!meta || Number(meta) < 30000) {

            notify(
                "La meta semanal debe ser de al menos $30.000.",
                "warning"
            );

            return false;
        }

        if (!diaslaborales) {

            notify(
                "Debes seleccionar los días laborales por semana.",
                "warning"
            );

            return false;
        }

        // Si es carro o moto, la placa es obligatoria
        if (
            ["1", "2"].includes(String(tipovehiculo)) &&
            placavehiculo.trim().length < 5
        ) {

            notify(
                "Debes ingresar una placa válida.",
                "warning"
            );

            return false;
        }

        if (!tipotrabajo) {

            notify(
                "Debes seleccionar tu tipo de trabajo.",
                "warning"
            );

            return false;
        }

        if (plataformas.length === 0) {

            notify(
                "Debes seleccionar al menos una plataforma.",
                "warning"
            );

            return false;
        }

        if (!tipovehiculo) {

            notify(
                "Debes seleccionar el tipo de vehículo.",
                "warning"
            );

            return false;
        }

        if (!vehiculoseleccionado) {

            notify(
                "Debes seleccionar tu vehículo.",
                "warning"
            );

            return false;
        }

        if (
            [1, 3].includes(Number(tipotrabajo)) &&
            ![1, 2].includes(Number(tipovehiculo))
        ) {

            notify(
                "Si trabajas como conductor o ambos, debes seleccionar un carro o una moto.",
                "warning"
            );

            return false;
        }


        return true;
    };

    async function guardarDatos(e) {
        e.preventDefault();

        // Validar antes de continuar
        if (!validarFormulario()) {
            return;
        }

        try {

            const datosActualizar = {
                nombre,
                meta,
                placavehiculo,
                tipovehiculo,
                tipotrabajo: Number(tipotrabajo),
                diaslaborales: Number(diaslaborales),
                plataformasuser: plataformas,
                vehiculoseleccionado: Number(vehiculoseleccionado),
            };

            console.log("Datos a enviar:", datosActualizar);  

            const docRef = doc(
                firestore,
                `usuarios/${user.uid}`
            );

            await updateDoc(docRef, datosActualizar);

            alert("Datos actualizados correctamente");
            
             notify(
                "Datos enviados correctamente",
                "success"
            ); 

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

    useEffect(() => {

        const obtenerPlataformas = async () => {

            const querySnapshot = await getDocs(
                collection(firestore, "plataformas")
            );

            const plataformas = querySnapshot.docs.map((doc) => ({
                id: Number(doc.id), // <-- el id viene del documento
                plataforma: doc.data().plataforma,
                tipoplataforma: doc.data().tipoplataforma,
            }));

            plataformas.sort((a, b) => a.id - b.id);

            setPlataformasDB(plataformas);
        };

        obtenerPlataformas();

    }, []);

    const togglePlataforma = (id) => {

        if (plataformas?.includes(id)) {

            setPlataformas(
                plataformas?.filter(item => item !== id)
            );

        } else {

            setPlataformas([
                ...plataformas,
                id
            ]);

        }

    };

    useEffect(() => {

        const obtenerVehiculos = async () => {

            const querySnapshot = await getDocs(
                collection(firestore, "vehiculos")
            );

            const datos = querySnapshot.docs.map((doc) => ({
                id: Number(doc.id),
                ...doc.data(),
            }));

            datos.sort((a, b) => a.id - b.id);

            setVehiculos(datos);

        };

        obtenerVehiculos();

    }, []);

    console.log("vehiculoseleccionado:", vehiculos);


    console.log("tipovehiculo:", tipovehiculo, typeof tipovehiculo);

    console.log("plataformas:", plataformasDB, typeof plataformasDB);

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
                                        {capitalizarPalabras(String(dia))}
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

                                    // Limpiar el vehículo seleccionado
                                    setVehiculoSeleccionado("");

                                    // Si no requiere placa, limpiar la placa
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
                                        {capitalizarPalabras(tipo.tipoveh)}
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

                        <div className="contenedorTiposTrabajo">
                            {tiposTrabajo.map((tipo) => (
                                <div
                                    key={tipo.id}
                                    className={`itemTipoTrabajo ${Number(tipotrabajo) === tipo.id ? "seleccionado" : ""
                                        }`}
                                    onClick={() => {
                                        setTipoTrabajo(tipo.id);
                                        setPlataformas([]);
                                    }}
                                >
                                    <img
                                        src={`/tipotrabajosimg/${tipo.imagen}`}
                                        alt={tipo.nombre}
                                    />

                                    <span className="nombreTipoTrabajo">
                                        {tipo.nombre}
                                    </span>

                                </div>
                            ))}
                        </div>

                    </div>

                    {tipotrabajo && (
                        <div className="formInputNormal">
                            <h3>¿Qué plataformas usas?</h3>

                            <div className="contenedorPlataformas">

                                {plataformasMostrar.map((plataforma) => (

                                    <div
                                        key={plataforma.id}
                                        className={`itemPlataforma ${plataformas.includes(plataforma.id)
                                            ? "seleccionado"
                                            : ""
                                            }`}
                                        onClick={() => togglePlataforma(plataforma.id)}
                                    >

                                        <img
                                            src={`/plataformas/${plataforma.id}.png`}
                                            alt={plataforma.plataforma}
                                        />

                                        <span className="nombrePlataforma">
                                            {capitalizarPalabras(plataforma.plataforma)}
                                        </span>

                                    </div>

                                ))}

                            </div>
                        </div>
                    )}


                    {tipovehiculo && (
                        <div className="formInputNormal">
                            <h3>Elije tu vehículo</h3>

                            <div className="contenedorVehiculos">

                                {vehiculosMostrar?.map((vehiculo) => (

                                    <div
                                        key={vehiculo.id}
                                        className={`itemVehiculo ${Number(vehiculoseleccionado) === vehiculo.id
                                            ? "seleccionado"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setVehiculoSeleccionado(vehiculo.id)
                                        }
                                    >

                                        <img
                                            src={`/vehiculos/${vehiculo.id}.png`}
                                            alt={vehiculo.nombrevehiculo}
                                        />

                                        <span className="nombreVehiculo">
                                            {capitalizarPalabras(vehiculo.nombrevehiculo)}
                                        </span>

                                        <span className="marcaVehiculo">
                                            {capitalizarPalabras(vehiculo.marca)}
                                        </span>

                                    </div>

                                ))}

                            </div>
                        </div>
                    )}


                    <button
                        className="button-submit"
                        type="submit"
                    >
                        Guardar
                    </button>

                </form>

            </div>




            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </div>
    );
}

export default RegisterData;