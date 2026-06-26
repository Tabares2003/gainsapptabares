import React, { useEffect, useState } from "react";
//Importamos la aplicación/credenciales
import firebaseApp from "./firebase/credenciales";
import Home from "./screens/Home";
import Login from "./screens/Login";

import { getFirestore, doc, getDoc } from "firebase/firestore";
// Conforme se necesite, importar los demás servicios y funciones. Por ejemplo:

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);



function App() {

  // Llevamos el estado del usuario a nivel de la aplicación para poder mostrar la vista correspondiente según si está logueado o no.
  const [user, setUser] = useState(null);

  async function getDatosUsuario(uid) {
    const docuRef = doc(firestore, `usuarios/${uid}`);
    const docuSnap = await getDoc(docuRef);

    if (docuSnap.exists()) {
      return docuSnap.data();
    }

    return null;
  }

  //funcion para obtener el rol del usuario desde Firestore
  async function setUserWithFirebase(usuarioFirebase) {
    const datosFirestore = await getDatosUsuario(
      usuarioFirebase.uid
    );

    const userData = {
      uid: usuarioFirebase.uid,
      email: usuarioFirebase.email,

      // datos Firestore
      nombre: datosFirestore?.nombre || "",
      rol: datosFirestore?.rol || "",
      provider: datosFirestore?.provider || "",
      fechaCreacion: datosFirestore?.fechaCreacion || "",
      fechaNacimiento: datosFirestore?.fechaNacimiento || "",
      meta: datosFirestore?.meta || "",
      picoyplaca: datosFirestore?.picoyplaca || "",
      tipovehiculo: datosFirestore?.tipovehiculo || "",
      foto: datosFirestore?.foto || ""
    };

    setUser(userData);

    console.log("Usuario completo:", userData);
  }

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {

      if (!user) {
        setUserWithFirebase(usuarioFirebase);
      }

    } else {
      setUser(null);
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {

      if (usuarioFirebase) {
        if (!user) {
          setUserWithFirebase(usuarioFirebase);
        }
      } else {
        setUser(null);
      }

    });

    return unsubscribe;

  }, [user]);

  return (
    <>
      {user ? <Home user={user} /> : <Login />}
    </>
  );
}

export default App;
