import {
    TextField,
    Button
} from "@material-ui/core";
import { RiDeleteBin5Line } from "react-icons/ri";

 

const formatearNumero = (valor) => {
    if (!valor) return "";

    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};


function IngresoDialogContent({
    selectedDate,
    brutoTotal,
    setBrutoTotal,
    netoTotal,
    setNetoTotal,
    setOpenIngresoDialog,
    ingresos,
    user,
    db,
    obtenerIngresos,
    nuevoBruto,
    setNuevoBruto,
    nuevoNeto,
    setNuevoNeto,
    agregarMovimiento,
    movimientos,
    eliminarMovimiento
}) {



    return (
        <>
            <div className="ingresos-dialog-content">
                <div className="ingresos-header">
                    <h3>+{formatearNumero(netoTotal)}</h3> 
                    <span>{formatearNumero(brutoTotal)}</span> 
                </div>

                <div className="movimientos-container"> 
                    <div className="movimientos-header">
                        <h4>Movimientos</h4>
                    </div>

                    {movimientos.map((movimiento) => (
                        <div
                            key={movimiento.id}
                            className="movimiento-item"
                        >
                            <div className="movimiento-icono">
                                💰
                            </div>

                            <div className="movimiento-info">
                                <h4>
                                    +$
                                    {formatearNumero(
                                        movimiento.neto
                                    )}
                                </h4>

                                <p>
                                    Bruto: $
                                    {formatearNumero(
                                        movimiento.bruto
                                    )}
                                </p>

                                <span>
                                    {movimiento.createdAt &&
                                        new Date(
                                            movimiento.createdAt.seconds *
                                            1000
                                        ).toLocaleTimeString(
                                            "es-CO",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                </span>
                            </div>

                            <button
                                className="btn-eliminar-movimiento"
                                onClick={() =>
                                    eliminarMovimiento(
                                        movimiento
                                    )
                                }
                            >
                                <RiDeleteBin5Line />
                            </button>
                        </div>
                    ))}
                </div>

                <div>
                    <TextField
                        label="Nuevo bruto"
                        value={nuevoBruto}
                        onChange={(e) =>
                            setNuevoBruto(
                                e.target.value
                            )
                        }
                        type="number"
                        fullWidth
                    />

                    <TextField
                        label="Nuevo neto"
                        value={nuevoNeto}
                        onChange={(e) =>
                            setNuevoNeto(
                                e.target.value
                            )
                        }
                        type="number"
                        fullWidth
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={
                            agregarMovimiento
                        }
                    >
                        Agregar movimiento
                    </Button>
                </div>


            </div>

        </>
    );
}

export default IngresoDialogContent;