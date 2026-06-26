import React, { useState } from 'react'
import firebaseApp from '../firebase/credenciales';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    fetchSignInMethodsForEmail
} from "firebase/auth";
import "./Login.css";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "firebase/firestore";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert"




const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function obtenerFechaActual() {
    return new Date().toISOString().split("T")[0];
}


function Login() {

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



    const firestore = getFirestore(firebaseApp);

    const [isRegistrando, setIsRegistrando] = useState(false);

    async function loginConGoogle() {
        try {
            const resultado = await signInWithPopup(
                auth,
                googleProvider
            );

            const usuario = resultado.user;

            const docuRef = doc(
                firestore,
                `usuarios/${usuario.uid}`
            );

            const docSnap = await getDoc(docuRef);

            if (!docSnap.exists()) {
                await setDoc(docuRef, {
                    email: usuario.email,
                    nombre: usuario.displayName || "",
                    foto: usuario.photoURL || "",
                    rol: "user",
                    provider: "google",
                    fechaCreacion: obtenerFechaActual(),
                    fechaNacimiento: "",
                    meta: "",
                    picoyplaca: "",
                    tipovehiculo: "",
                    tipotrabajo: "",
                    placavehiculo: "",
                    vehiculoseleccionado: "",
                    genero: ""
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function registrarUsuario(nombre, email, password, rol) {

        const infoUsuario =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const docuRef = doc(
            firestore,
            `usuarios/${infoUsuario.user.uid}`
        );

        await setDoc(docuRef, {
            nombre,
            email,
            foto: "",
            rol,
            provider: "correo",
            fechaCreacion: obtenerFechaActual(),
            fechaNacimiento: "",
            meta: "",
            picoyplaca: "",
            tipovehiculo: "",
            tipotrabajo: "",
            placavehiculo: "",
            vehiculoseleccionado: "",
            genero: ""
        });
    }



    async function submitHandler(e) {
        e.preventDefault();

        const nombre = e.target.nombre?.value || "";
        const email = e.target.email.value.trim();
        const password = e.target.password.value;
        const rol = "user";

        if (isRegistrando) {
            console.log("Registrando usuario...");

            try {
                await registrarUsuario(
                    nombre,
                    email,
                    password,
                    rol
                );

                notify(
                    "Usuario registrado correctamente",
                    "success"
                );

            } catch (error) {
                console.error(error);

                if (error.code === "auth/email-already-in-use") {
                    notify(
                        "Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.",
                        "error"
                    );
                } else if (error.code === "auth/weak-password") {
                    notify(
                        "La contraseña es demasiado débil. Usa al menos 6 caracteres.",
                        "warning"
                    );
                } else if (error.code === "auth/invalid-email") {
                    notify(
                        "El correo electrónico no es válido.",
                        "error"
                    );
                } else {
                    notify(
                        "Error al registrar usuario",
                        "error"
                    );
                }
            }
        } else {
            console.log("Iniciando sesión...");

            try {
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                notify(
                    "Inicio de sesión exitoso.",
                    "success"
                );

            } catch (error) {

                try {
                    const methods = await fetchSignInMethodsForEmail(
                        auth,
                        email
                    );

                    if (methods.includes("google.com")) {
                        notify(
                            "Esta cuenta fue registrada con Google. Inicia sesión con el botón de Google.",
                            "info"
                        );
                    } else if (methods.includes("password")) {
                        notify(
                            "Contraseña incorrecta.",
                            "error"
                        );
                    } else {
                        notify(
                            "No existe una cuenta con este correo, o anteriormente iniciaste sesión con Google.",
                            "warning"
                        );
                    }

                } catch (err) {
                    console.error(err);
                    notify(
                        "Error al verificar el método de inicio de sesión.",
                        "error"
                    );
                }
            }
        }
    }

    return (
        <div className="login-container">


            <div className="form">
                <form onSubmit={submitHandler} className="form-container">

                    <div className="logo-container-login">
                        <img
                            src="/logoapp2.png"
                            alt="Logo"
                            className="logoapp"
                        />
                    </div>

                    <div className="flex-column">
                        <label>Correo Electrónico</label>
                    </div>


                    <div className="inputForm">
                        <svg
                            height="20"
                            width="20"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g>
                                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                            </g>
                        </svg>

                        <input type="email" name="email" id="email" className="input" placeholder="Ingresa tu correo electrónico" />


                    </div>

                    <div className="flex-column">
                        <label>Contraseña</label>
                    </div>

                    <div className="inputForm">
                        <svg
                            height="20"
                            width="20"
                            viewBox="-64 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                        </svg>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="input"
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>


                    {/** 

                    <div className="flex-row">
                        <span className="span">¿Olvidaste tu contraseña?</span>
                    </div>
*/}

                    <input type="submit" value={isRegistrando ? "Registrarse" : "Iniciar Sesión"} className="button-submit" />

                    <p className="p">
                        {isRegistrando ? (
                            <>
                                Ya tienes cuenta?{" "}
                                <span
                                    className="span"
                                    onClick={() => setIsRegistrando(false)}
                                >
                                    Inicia Sesión
                                </span>
                            </>
                        ) : (
                            <>
                                No tienes cuenta?{" "}
                                <span
                                    className="span"
                                    onClick={() => setIsRegistrando(true)}
                                >
                                    Registrate
                                </span>
                            </>
                        )}
                    </p>

                    <p className="p line">O Ingresa Con</p>
                </form>

                <div className="flex-row">
                    <button type="button" className="btn google" onClick={loginConGoogle}>
                        Google
                        <svg
                            viewBox="0 0 24 24"
                            height="25"
                            width="25"
                            y="0px"
                            x="0px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12,5c1.6167603,0,3.1012573,0.5535278,4.2863159,1.4740601l3.637146-3.4699707 C17.8087769,1.1399536,15.0406494,0,12,0C7.392395,0,3.3966675,2.5999146,1.3858032,6.4098511l4.0444336,3.1929321 C6.4099731,6.9193726,8.977478,5,12,5z"
                                fill="#F44336"
                            ></path>
                            <path
                                d="M23.8960571,13.5018311C23.9585571,13.0101929,24,12.508667,24,12 c0-0.8578491-0.093689-1.6931763-0.2647705-2.5H12v5h6.4862061c-0.5247192,1.3637695-1.4589844,2.5177612-2.6481934,3.319458 l4.0594482,3.204834C22.0493774,19.135437,23.5219727,16.4903564,23.8960571,13.5018311z"
                                fill="#2196F3"
                            ></path>
                            <path
                                d="M5,12c0-0.8434448,0.1568604-1.6483765,0.4302368-2.3972168L1.3858032,6.4098511 C0.5043335,8.0800171,0,9.9801636,0,12c0,1.9972534,0.4950562,3.8763428,1.3582153,5.532959l4.0495605-3.1970215 C5.1484375,13.6044312,5,12.8204346,5,12z"
                                fill="#FFC107"
                            ></path>
                            <path
                                d="M12,19c-3.0455322,0-5.6295776-1.9484863-6.5922241-4.6640625L1.3582153,17.532959 C3.3592529,21.3734741,7.369812,24,12,24c3.027771,0,5.7887573-1.1248169,7.8974609-2.975708l-4.0594482-3.204834 C14.7412109,18.5588989,13.4284058,19,12,19z"
                                fill="#00B060"
                            ></path>
                            <path
                                opacity=".1"
                                d="M12,23.75c-3.5316772,0-6.7072754-1.4571533-8.9524536-3.7786865C5.2453613,22.4378052,8.4364624,24,12,24 c3.5305786,0,6.6952515-1.5313721,8.8881226-3.9592285C18.6495972,22.324646,15.4981079,23.75,12,23.75z"
                            ></path>
                            <polygon
                                opacity=".1"
                                points="12,14.25 12,14.5 18.4862061,14.5 18.587492,14.25"
                            ></polygon>
                            <path
                                d="M23.9944458,12.1470337C23.9952393,12.0977783,24,12.0493774,24,12 c0-0.0139771-0.0021973-0.0274658-0.0022583-0.0414429C23.9970703,12.0215454,23.9938965,12.0838013,23.9944458,12.1470337z"
                                fill="#E6E6E6"
                            ></path>
                            <path
                                opacity=".2"
                                d="M12,9.5v0.25h11.7855721c-0.0157471-0.0825195-0.0329475-0.1680908-0.0503426-0.25H12z"
                                fill="#FFF"
                            ></path>
                            <linearGradient
                                gradientUnits="userSpaceOnUse"
                                y2="12"
                                y1="12"
                                x2="24"
                                x1="0"
                                id="LxT-gk5MfRc1Gl_4XsNKba_xoyhGXWmHnqX_gr1"
                            >
                                <stop stop-opacity=".2" stop-color="#fff" offset="0"></stop>
                                <stop stop-opacity="0" stop-color="#fff" offset="1"></stop>
                            </linearGradient>
                            <path
                                d="M23.7352295,9.5H12v5h6.4862061C17.4775391,17.121582,14.9771729,19,12,19 c-3.8659668,0-7-3.1340332-7-7c0-3.8660278,3.1340332-7,7-7c1.4018555,0,2.6939087,0.4306641,3.7885132,1.140686 c0.1675415,0.1088867,0.3403931,0.2111206,0.4978027,0.333374l3.637146-3.4699707L19.8414307,2.940979 C17.7369385,1.1170654,15.00354,0,12,0C5.3725586,0,0,5.3725586,0,12c0,6.6273804,5.3725586,12,12,12 c6.1176758,0,11.1554565-4.5812378,11.8960571-10.4981689C23.9585571,13.0101929,24,12.508667,24,12 C24,11.1421509,23.906311,10.3068237,23.7352295,9.5z"
                                fill="url(#LxT-gk5MfRc1Gl_4XsNKba_xoyhGXWmHnqX_gr1)"
                            ></path>
                            <path
                                opacity=".1"
                                d="M15.7885132,5.890686C14.6939087,5.1806641,13.4018555,4.75,12,4.75c-3.8659668,0-7,3.1339722-7,7 c0,0.0421753,0.0005674,0.0751343,0.0012999,0.1171875C5.0687437,8.0595093,8.1762085,5,12,5 c1.4018555,0,2.6939087,0.4306641,3.7885132,1.140686c0.1675415,0.1088867,0.3403931,0.2111206,0.4978027,0.333374 l3.637146-3.4699707l-3.637146,3.2199707C16.1289062,6.1018066,15.9560547,5.9995728,15.7885132,5.890686z"
                            ></path>
                            <path
                                opacity=".2"
                                d="M12,0.25c2.9750366,0,5.6829224,1.0983887,7.7792969,2.8916016l0.144165-0.1375122 l-0.110014-0.0958166C17.7089558,1.0843592,15.00354,0,12,0C5.3725586,0,0,5.3725586,0,12 c0,0.0421753,0.0058594,0.0828857,0.0062866,0.125C0.0740356,5.5558472,5.4147339,0.25,12,0.25z"
                                fill="#FFF"
                            ></path>
                        </svg>
                    </button>
                </div>
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
    )
}

export default Login