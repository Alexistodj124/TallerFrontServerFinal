import { Box, Button, TextField, Typography, useTheme, Modal } from "@mui/material";
import { tokens } from "../../tema";
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import config from '../../config';


const Marcas = () => {
  const tema = useTheme();
  const colores = tokens(tema.palette.mode);
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState([]);
  const [filteredMarcas, setFilteredMarcas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState({
    Marca: "",
    Modelo: "",
    Linea: "",
    Edicion: ""
  });

  const datos = async () => {
    // const info = await axios.get("http://3.140.209.59:8000/marcas");
    const info = await axios.get(`${config.API_BASE_URL}/marcas`);
    setMarcas(info.data);
    setFilteredMarcas(info.data);
  };

  useEffect(() => {
    datos();
  }, []);

  useEffect(() => {
    setFilteredMarcas(
      marcas.filter((marca) =>
        Object.values(marca)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, marcas]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaMarca({ ...nuevaMarca, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBoxClick = (marca) => {
    navigate(`/carros/${marca.id}`);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/marcas/${id}`);
      datos(); // Refresh the list of brands
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${config.API_BASE_URL}/marcas/${nuevaMarca.id}`, nuevaMarca);
      } else {
        await axios.post(`${config.API_BASE_URL}/marcas`, nuevaMarca);
      }
      datos(); // Refresh the list of brands
      setNuevaMarca({
        Marca: "",
        Modelo: "",
        Linea: "",
        Edicion: ""
      }); // Reset the form
      setOpen(false); // Close the modal
      setEditing(false); // Reset editing state
    } catch (error) {
      console.error("Error al agregar/editar la marca:", error);
    }
  };

  return (
    <Box m="20px">
      <Header titulo="MARCAS" subtitulo="Pagina de Marcas" />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Buscar Marca"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
          Agregar Marca
        </Button>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"  // Define cuatro columnas
        gap={1}  // Espacio entre las columnas
        sx={{
          backgroundColor: colores.primario[400],
          padding: '20px',
          maxHeight: '55vh',  // Limita la altura máxima
          overflow: 'auto',   // Hace que el contenedor sea desplazable
        }}
      >
        {filteredMarcas.map((marca, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              padding: '10px',
              backgroundColor: colores.azulDecor[700],
              borderRadius: '8px',
              cursor: 'pointer',  // Cambia el cursor para indicar que es clickeable
              '&:hover': {
                backgroundColor: colores.azulDecor[800],  // Cambia el color al hacer hover
              }
            }}
            onClick={() => handleBoxClick(marca)}  // Llamar a la función cuando se haga clic
          >
            <Box>
              <Typography variant="h4" color="textPrimary">
                {marca.Marca}
              </Typography>
            </Box>
            <Box>
              <img
                src={`data:image/jpeg;base64,${marca.Logo}`}
                alt="Logo"
                style={{ width: 100, height: 100 }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            {editing ? "Editar Marca" : "Agregar Nueva Marca"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="Marca"
              name="Marca"
              label="Marca"
              value={nuevaMarca.Marca}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Modelo"
              name="Modelo"
              label="Modelo"
              value={nuevaMarca.Modelo}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Linea"
              name="Linea"
              label="Linea"
              value={nuevaMarca.Linea}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Edicion"
              name="Edicion"
              label="Edicion"
              value={nuevaMarca.Edicion}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              {editing ? "Guardar Cambios" : "Agregar Marca"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Marcas;
