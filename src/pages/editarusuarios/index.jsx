import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const EditarUsuarios = () => {
  const { id } = useParams();
  const [id_rol, setId_rol] = useState(0);
  const [contra, setContra] = useState("");
  const [user, setUser] = useState("");

  const datos = async () => {
    const info = await axios.get(`http://localhost:5000/usuarios/${id}`);
    const { id_rol, password, username } = info.data;
    setId_rol(id_rol);
    setContra(password);
    setUser(username);
  };

  useEffect(() => {
    datos();
  }, []);

  const NoMobil = useMediaQuery("(min-width:600px)");
  const handleEnviar = async (valores) => {
    await axios.put(`http://localhost:5000/usuarios/${id}`, {
        username: valores.usuario,
        password: valores.contraseña,
        id_rol: valores.rol
    })
    window.location.href = "/usuarios";
  };

  const initialValues = {
    usuario: user,
    contraseña: contra,
    rol: id_rol,
  };

  const userSchema = yup.object().shape({
    usuario: yup.string(),
    contraseña: yup.string(),
    rol: yup.number().integer(),
  });

  return (
    <Box m="20px">
      <Header titulo="EDITAR USUARIO" subtitulo="Editar el usuario" />
      <Formik
        onSubmit={handleEnviar}
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{ "& > div": { gridColumn: NoMobil ? undefined : "span 4" } }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Usuario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.usuario}
                name="usuario"
                error={!!touched.usuario && !!errors.usuario}
                helperText={touched.usuario && errors.usuario}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contraseña}
                name="contraseña"
                error={!!touched.contraseña && !!errors.contraseña}
                helperText={touched.contraseña && errors.contraseña}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Rol"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rol}
                name="rol"
                error={!!touched.rol && !!errors.rol}
                helperText={touched.rol && errors.rol}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Editar Usuario
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditarUsuarios;
