import { Box, Button, IconButton, TextField, Typography, useTheme, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../tema";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Import useParams
import Header from "../../components/Header";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from "react-router-dom";  // Import useNavigate
import config from '../../config';


const Carros = () => {
  const tema = useTheme();
  const colores = tokens(tema.palette.mode);
  const { id } = useParams();  // Extract the id from the URL
  const navigate = useNavigate();  // Initialize the navigate function


  const columnas = [
    {
      field: "Marca",
      headerName: "Marca",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Modelo",
      headerName: "Modelo",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Linea",
      headerName: "Linea",
      flex: 1,
      cellClassName: "name-column--cell",
    },
  ];

  const [carros, setCarros] = useState([]);
  const [filteredCarros, setFilteredCarros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nuevoCarro, setNuevoCarro] = useState({
    Marca: "",
    Modelo: "",
    Linea: "",
    Edicion: ""
  });
  const MarcaDetail = () => {
    const { id } = useParams();  // Get the id from the URL
    const [marca, setMarca] = useState(null);  // Store the fetched marca data
  
    useEffect(() => {
      const fetchMarca = async () => {
        try {
          //const response = await axios.get(`http://3.140.209.59:8000/marcas/${id}`);
          const response = await axios.get(`${config.API_BASE_URL}/marcas/${id}`);
          setMarca(response.data);  // Set the marca data in state
          console.log(response);
        } catch (error) {
          console.error("Error fetching marca:", error);
        }
      };
  
      fetchMarca();
    }, [id]);  // Fetch marca when the component mounts or id changes
  
    if (!marca) {
      return <Header titulo='Carros' subtitulo="Pagina de carros" />;  // Display a loading message while fetching
    }
    return (
      <Header titulo={marca.marca} subtitulo="Pagina de carros" />
    );
  };

  // Fetch data from the backend
  const datos = async () => {
    //const info = await axios.get("http://3.140.209.59:8000/carros");
    const info = await axios.get(`${config.API_BASE_URL}/carros`);
    setCarros(info.data);
    // Filter by marca_id if available in the URL
    if (id) {
      const filteredByMarca = info.data.filter((carro) => carro.marca_id === parseInt(id));
      setCarros(filteredByMarca);
    } else {
      setCarros(info.data);  // Show all cars if no marca_id is present
    }
  };
  // Initial fetch of data when the component mounts or when `id` changes
  useEffect(() => {
    datos();
  }, [id]);  // Runs when the URL id changes

  // Handle search term changes to filter the displayed cars
  useEffect(() => {
    const searchFiltered = carros.filter((carro) =>
      Object.values(carro)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCarros(searchFiltered);
  }, [searchTerm, carros]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCarro({ ...nuevoCarro, [name]: value });
  };

  const handleCarroClick = (carro) => {
    navigate(`/inventario/${carro.id}`);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/carros/${id}`);
      datos(); // Refresh the list of cars
    } catch (error) {
      console.error("Error al eliminar el carro:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Structure the data for a new car, ensuring `Marca_id` is included
      const nuevoCarroData = {
        Modelo: nuevoCarro.Modelo,
        Linea: nuevoCarro.Linea,
        Marca_id: id  // Ensure Marca_id is properly set
      };

      // Send the POST request to add a new car
      await axios.post("${config.API_BASE_URL}/carros", nuevoCarroData);

      datos(); // Refresh the list of cars
      setNuevoCarro({
        Modelo: "",
        Linea: "",
      }); // Reset the form
      setOpen(false); // Close the modal
      setEditing(false); // Reset editing state
    } catch (error) {
      console.error("Error al agregar el carro:", error);
    }
  };



  return (
    <Box m="20px">
      <Header titulo='' subtitulo="Pagina de carros" />
      <Box display="flex" justifyContent="space-between" mb={2}>

        <TextField
          label="Buscar Carro"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Box display="flex" gap={1}>  {/* New Box to group the two buttons */}
          <Button variant="contained" color="secondary" onClick={() => {navigate("/marcas");}}>
            Marcas
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
            Agregar Carro
          </Button>
        </Box>
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
        {filteredCarros.map((carro, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              padding: '10px',
              backgroundColor: colores.azulDecor[700],
              borderRadius: '8px',
              cursor: 'pointer',  // Cambia el cursor para indicar que es clickeable
              '&:hover': {
                backgroundColor: colores.azulDecor[800],  // Cambia el color al hacer hover
              }
            }}
            onClick={() =>  handleCarroClick(carro)}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h2" color="textPrimary">
                {carro.linea}
              </Typography>
              <Typography variant="h3" color="textPrimary">
                {carro.modelo}
              </Typography>
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
            {editing ? "Editar Carro" : "Agregar Nuevo Carro"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="Modelo"
              name="Modelo"
              label="Modelo"
              value={nuevoCarro.Modelo}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Linea"
              name="Linea"
              label="Linea"
              value={nuevoCarro.Linea}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              {editing ? "Guardar Cambios" : "Agregar Carro"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Carros;
