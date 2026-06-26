import React from 'react'
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from "firebase/auth";
import RegisterData from '../components/registerData';

const auth = getAuth(firebaseApp);


function userView({ user }) {


    console.log("Usuario en userView:", user);

    return (
        <div>

            <h2>Hola {user.nombre}</h2>

            {!user.meta ? (
                <RegisterData user={user} />
            ) : (
                <div className="login-form">
                    {/* Se muestra cuando meta tiene contenido */}
                    <p>Meta: {user.meta}</p>
                </div>
            )}

            <button onClick={() => signOut(auth)}>
                Cerrar Sesión
            </button>

        </div>



    )
}

export default userView