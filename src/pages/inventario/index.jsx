import { Box, Button, IconButton, TextField, Typography, useTheme, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../tema";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { repuestos } from "../../data/data.js";  // Importar los repuestos desde el archivo data.js
import config from '../../config';

const Inventario = () => {
  const tema = useTheme();
  const colores = tokens(tema.palette.mode);
  const { id } = useParams();

  const columnas = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "repuesto",
      headerName: "Repuesto",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "ingresados",
      headerName: "Ingresados",
      flex: 0.5,
    },
    {
      field: "vendidos",
      headerName: "Vendidos",
      flex: 0.5,
    },
    {
      field: "existencia",
      headerName: "Existencia",
      flex: 0.5,
    },
    {
      field: "precio_unitario",
      headerName: "Precio",
      flex: 0.5,
    },
    {
      field: "acciones",
      headerName: "Agregar a Orden",
      flex: 0.5,
      renderCell: (params) => {
        // Check the existencia value in the current row
        const { existencia } = params.row;
  
        // Render nothing if existencia is 0 or less
        if (existencia <= 0) {
          return null;
        }
  
        // Otherwise, render the action buttons
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => agregarAlCarrito(params.row)}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const [repuestos, setRepuestos] = useState([]);
  const [filteredInventario, setFilteredInventario] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nuevoCarro, setNuevoCarro] = useState({
    Repuesto: "",
    Ingresados: "",
    Vendidos: "",
    Existencia: "",
  });

  const datos = async () => {
    // Fetch data from the API
    const info = await axios.get(`${config.API_BASE_URL}/inventarios`);
  
    let fetchedRepuestos = info.data;
  
    // Filter by marca_id if available in the URL
    if (id) {
      fetchedRepuestos = fetchedRepuestos.filter(
        (inventario) => inventario.id_carro === parseInt(id)
      );
    }
  
    // Sort alphabetically by "Repuesto"
    fetchedRepuestos.sort((a, b) =>
      a.repuesto.localeCompare(b.repuesto, undefined, { sensitivity: "base" })
    );
  
    setRepuestos(fetchedRepuestos);
  };
  
  // Initial fetch of data when the component mounts or when `id` changes
  useEffect(() => {
    datos();
  }, [id]);  // Runs when the URL id changes

  // Filtrar repuestos por término de búsqueda
  useEffect(() => {
    const searchFiltered = repuestos.filter((repuesto) =>
      Object.values(repuesto)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredInventario(searchFiltered);
  }, [searchTerm, repuestos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCarro({ ...nuevoCarro, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (carro) => {
    setNuevoCarro(carro);
    setEditing(true);
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    // Aquí puedes agregar la funcionalidad de eliminar
    console.log("Eliminar el item con id:", id);
  };

  // function agregarAlCarrito(repuesto) {
  //   let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  //   // Push the entire repuesto object directly
  //   carrito.push(repuesto);
  //   localStorage.setItem('carrito', JSON.stringify(carrito));
  // }

  const agregarAlCarrito = (repuesto) => {
    console.log('Datos del repuesto:', repuesto);
    console.log('Carro asociado:', repuesto.carro);
    console.log('Marca del carro:', repuesto.carro.marca);
  
    // Aquí puedes implementar la lógica para agregar el repuesto al carrito
    const itemCarrito = {
      id: repuesto.id,
      repuesto: repuesto.repuesto,
      precio: repuesto.precio_unitario,
      modelo: repuesto.carro.modelo,
      linea: repuesto.carro.linea,
      marca: repuesto.carro.marca.Marca
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    // Push the entire repuesto object directly
    carrito.push(itemCarrito);
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };
  
  
  
  // Obtener el carrito
  function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  }
  // Call obtenerCarrito to get the cart contents
  const carrito = obtenerCarrito();
  console.log("Contenido del carrito:", carrito);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      // Actualizar el carro en repuestos
      const index = repuestos.findIndex((car) => car.id === nuevoCarro.id);
      repuestos[index] = nuevoCarro;
    } else {
      // Agregar nuevo carro a repuestos
      repuestos.push(nuevoCarro);
    }
    setNuevoCarro({
      Marca: "",
      Modelo: "",
      Año: "",
      Repuesto: "",
      Ingresados: "",
      Vendidos: "",
      Existencia: ""
    });
    setOpen(false);
    setEditing(false);
  };

  return (
    <Box m="20px">
      <Header titulo="" subtitulo="Página de Inventario" />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Buscar Item"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Agregar Item
        </Button>
      </Box>
      <Box
        m="40px 0 20px 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colores.verdeDecor[300],
          },
          "& .MuiDataGrid-withBorderColor": {
            backgroundColor: colores.azulDecor[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colores.primario[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colores.azulDecor[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colores.verdeDecor[200]} !important`,
          },
        }}
      >
        <DataGrid 
          rows={filteredInventario} 
          columns={columnas} 
          pageSize={filteredInventario.length} // Match the total number of  s
          rowsPerPageOptions={[filteredInventario.length]} // Remove pagination controls
          paginationMode="server" // Explicitly manage pagination on your side
          disableColumnMenu // Optional: Disable column menu for a cleaner UI
          hideFooter={true} // This hides the footer completely
        />
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
              id="Marca"
              name="Marca"
              label="Marca"
              value={nuevoCarro.Marca}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
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
              id="Repuesto"
              name="Repuesto"
              label="Repuesto"
              value={nuevoCarro.Repuesto}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Ingresados"
              name="Ingresados"
              label="Ingresados"
              value={nuevoCarro.Ingresados}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Vendidos"
              name="Vendidos"
              label="Vendidos"
              value={nuevoCarro.Vendidos}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Existencia"
              name="Existencia"
              label="Existencia"
              value={nuevoCarro.Existencia}
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

export default Inventario;
