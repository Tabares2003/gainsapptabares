import React, { useCallback, useEffect, useState } from 'react'

import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@material-ui/core';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineAddCircleOutline } from 'react-icons/md';


function AdminView() {


  const db = getFirestore();


  const [diasDemanda, setDiasDemanda] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editando, setEditando] = useState(false);

  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [nivel, setNivel] = useState(1);
  const [ciudad, setCiudad] = useState("");

  const obtenerDiasDemanda = useCallback(async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "demandadias")
      );

      const datos = [];

      snapshot.forEach((doc) => {
        datos.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setDiasDemanda(datos);
    } catch (error) {
      console.log(error);
    }
  }, [db]);

  useEffect(() => {
    obtenerDiasDemanda();
  }, [obtenerDiasDemanda]);

  const abrirCrear = () => {
    setEditando(false);

    setFecha("");
    setMotivo("");
    setNivel(1);
    setCiudad("");

    setOpenDialog(true);
  };

  const abrirEditar = (dia) => {
    setEditando(true);

    setFecha(dia.id);
    setMotivo(dia.motivo);
    setNivel(dia.nivel);
    setCiudad(dia.ciudad);

    setOpenDialog(true);
  };

  const guardarDia = async () => {
    try {
      await setDoc(
        doc(db, "demandadias", fecha),
        {
          fecha,
          motivo: motivo,
          nivel: Number(nivel),
          ciudad,
        }
      );

      setOpenDialog(false);

      obtenerDiasDemanda();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarDia = async (id) => {
    const confirmar = window.confirm(
      "¿Eliminar este registro?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "demandadias", id)
      );

      obtenerDiasDemanda();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Hola, Admin


      <div className="tabla-dias-demanda">
        <div className="tabla-dias-demanda-header">
          <h2 style={{ fontSize: '12px' }}>Días de Demanda</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={abrirCrear}
          >
            <MdOutlineAddCircleOutline />
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {diasDemanda.map((dia) => (
              <TableRow key={dia?.id}>
                <TableCell style={{ fontSize: '8px' }}>
                  {dia?.id}
                </TableCell>

                <TableCell style={{ fontSize: '8px', width: '200px', wordWrap: 'break-word' }}>
                  {dia?.motivo}
                </TableCell>

                <TableCell style={{ fontSize: "8px" }}>
                  {
                    dia?.nivel === 1
                      ? "Baja"
                      : dia?.nivel === 2
                        ? "Media"
                        : "Alta"
                  }
                </TableCell>

                <TableCell>
                  <Button
                    color="primary"
                    onClick={() =>
                      abrirEditar(dia)
                    }
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    color="secondary"
                    onClick={() =>
                      eliminarDia(dia.id)
                    }
                  >
                    <MdDeleteOutline />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      <Dialog
        open={openDialog}
        onClose={() =>
          setOpenDialog(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editando
            ? "Editar día de demanda"
            : "Nuevo día de demanda"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Fecha"
            type="date"
            fullWidth
            margin="normal"
            value={fecha}
            onChange={(e) =>
              setFecha(e.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Motivo"
            fullWidth
            margin="normal"
            value={motivo}
            onChange={(e) =>
              setMotivo(e.target.value)
            }
          />

          <TextField
            label="Ciudad"
            fullWidth
            margin="normal"
            value={ciudad}
            onChange={(e) =>
              setCiudad(e.target.value)
            }
          />

          <FormControl
            fullWidth
            margin="normal"
          >
            <Select
              value={nivel}
              onChange={(e) =>
                setNivel(
                  e.target.value
                )
              }
            >
              <MenuItem value={1}>
                Baja demanda
              </MenuItem>

              <MenuItem value={2}>
                Demanda normal
              </MenuItem>

              <MenuItem value={3}>
                Alta demanda
              </MenuItem>
            </Select>
          </FormControl>

        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpenDialog(false)
            }
          >
            Cancelar
          </Button>

          <Button
            color="primary"
            variant="contained"
            onClick={guardarDia}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AdminView;