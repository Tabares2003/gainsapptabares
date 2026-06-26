import React from 'react'
import firebaseApp from '../firebase/credenciales';
import { getAuth, signOut } from "firebase/auth";

import AdminView from '../components/adminView';
import UserView from '../components/userView';

const auth = getAuth(firebaseApp);


function Home({ user }) {

    console.log("Usuario en Home:", user);

    return (
        <div>
            {user.rol === "admin" ? <AdminView user={user}/> : <UserView user={user}/>} 
            {/*  <button onClick={() => signOut(auth)}>Cerrar Sesión</button>*/}
        </div>
    )
}

export default Home