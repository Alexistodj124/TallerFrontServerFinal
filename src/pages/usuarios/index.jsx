import { Box, Typography, useTheme, TextField, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../tema";
import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Usuarios = () => {
  const tema = useTheme();
  const colores = tokens(tema.palette.mode);
  
  const handleEditar = ({id}) => {
    window.location.href = `/editarUsuario/${id}`
  }

  const handleEliminar = async ({id}) => {
    setUsuariosConRoles(prevState => prevState.filter(usuario => usuario.id !== id));
    setFilteredUsuarios(prevState => prevState.filter(usuario => usuario.id !== id));
    await axios.delete(`http://localhost:5000/usuarios/${id}`);
  }

  const columnas = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "password",
      headerName: "Contraseña",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return (
          <Box display="flex" justifyContent="center">
            <EditOutlinedIcon
              sx={{ cursor: "pointer", mr: 1, marginTop: "15px" }}
              onClick={() => handleEditar(params.row)}
            />
            <DeleteOutlineOutlinedIcon
              sx={{ cursor: "pointer", marginRight: "80px", marginTop: "15px" }}
              onClick={() => handleEliminar(params.row)}
            />
          </Box>
        );
      },
    },
    {
      field: "rol",
      headerName: "Rol",
      flex: 1,
      renderCell: ({ row: { rol } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="10px"
            backgroundColor={
              rol === "admin"
                ? colores.verdeDecor[600]
                : rol === "manager"
                ? colores.verdeDecor[700]
                : colores.verdeDecor[700]
            }
            borderRadius="4px"
          >
            {rol === "Admin" && <AdminPanelSettingsOutlinedIcon />}
            {rol === "cliente" && <SecurityOutlinedIcon />}
            {rol === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colores.gris[100]} sx={{ ml: "5px" }}>
              {rol}
            </Typography>
          </Box>
        );
      },
    },
    
  ];

  const [usuarios, setUsuarios] = useState([]);
  const [usuariosConRoles, setUsuariosConRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    password: "",
    id_rol: ""
  });

  const datos = async () => {
    const info = await axios.get("http://localhost:5000/usuarios");
    setUsuarios(info.data);
  };

  useEffect(() => {
    setFilteredUsuarios(
      usuariosConRoles.filter((usuario) =>
        Object.values(usuario)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, usuariosConRoles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const usuarioConRolConvertido = {
      ...nuevoUsuario,
      id_rol: parseInt(nuevoUsuario.id_rol, 10),
    };
    try {
        await axios.post("http://localhost:5000/usuarios", usuarioConRolConvertido);
      datos();
      setNuevoUsuario({
        username: "",
        password: "",
        id_rol: 0,
      }); 
      setOpen(false); 
      setEditing(false); 
    } catch (error) {
      console.error("Error al agregar carro:", error);
    }
  };

  

  const obtenerRolesParaUsuarios = async (usuarios) => {
    const usuariosConRoles = await Promise.all(
      usuarios.map(async (usuario) => {
        const { id_rol } = usuario;
        const rolResponse = await axios.get(
          `http://localhost:5000/roles/${id_rol}`
        );
        const info = rolResponse.data;
        const rolInfo = info.map((data) => {
          const datos = data.Rol;
          return datos;
        });
        const rol = rolInfo[0];
        return { ...usuario, rol };
      })
    );
    setUsuariosConRoles(usuariosConRoles);
    setFilteredUsuarios(usuariosConRoles);
  };

  useEffect(() => {
    datos();
  }, []);

  useEffect(() => {
    if (usuarios.length > 0) {
      obtenerRolesParaUsuarios(usuarios);
    }
  }, [usuarios]);

  return (
    <Box m="20px">
      <Header titulo="USUARIOS" subtitulo="Pagina de usuarios" />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Buscar Usuario"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
          Agregar Usuario
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
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
          "& .MuiDataGrid-scrollbarFiller--header": {
            backgroundColor: colores.azulDecor[700],
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            marginRight: "none",
          },
        }}
      >
        <DataGrid rows={filteredUsuarios} columns={columnas} />
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
            {"Agregar Nuevo Usuario"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="Usuario"
              name="username"
              label="Usuario"
              value={nuevoUsuario.username}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Contraseña"
              name="password"
              label="Contraseña"
              value={nuevoUsuario.password}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="Rol"
              name="id_rol"
              label="Rol"
              value={nuevoUsuario.id_rol}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              {"Agregar Usuario"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Usuarios;
