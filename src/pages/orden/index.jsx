import { Box, Button, IconButton, TextField, Typography, useTheme, Modal, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../tema";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Import useParams
import Header from "../../components/Header";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { Refresh } from "@mui/icons-material";
import config from '../../config';


const Ordenes = () => {
  const tema = useTheme();
  const colores = tokens(tema.palette.mode);
  const { id } = useParams();  // Extract the id from the URL
  const navigate = useNavigate();  // Initialize the navigate function


  //Inventarios
  const [inventariosID, setInventariosID] = useState([]);

  //Carros
  const [marcas, setMarcas] = useState([]);
  const [carros, setCarros] = useState([]);
  const [filteredCarros, setFilteredCarros] = useState([]);

  //Modals
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [openModalConfirmar, setOpenModalConfirmar] = useState(false);
  const handleOpenModalConfirmar = () => setOpenModalConfirmar(true);
  const handleCloseModalConfirmar = () => setOpenModalConfirmar(false);
  const [openModalPago, setOpenModalPago] = useState(false);
  const handleOpenModalPago = () => setOpenModalPago(true);
  const handleCloseModalPago = () => setOpenModalPago(false);

  //Orden
  const [nuevaOrden, setNuevaOrden] = useState({
    origen: "",
    vendedor: null,
    bodeguero: null,
    total: 0.00,
    pagos: [], 
  });

  //Pagos
  const [nuevoPago, setNuevoPago] = useState({
    metodo: "",
    cantidad: 0.0, 
    referencia: "",
  });  
  const [totalRestante, setTotalRestante] = useState([]);


  //PRUEBAS
  const origenes = ["WA Publicidad", "WA Cliente", "Llamada", "Mostrador"];

  const [empleados, setEmpleados] = useState([]);

  const metodos = ["Tarjeta", "Transferencia", "Efectivo"];


  const columnas = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "marca",
      headerName: "Marca",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "linea",
      headerName: "Carro",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "modelo",
      headerName: "Año",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "repuesto",
      headerName: "Repuesto",
      flex: 1,
      cellClassName: "name-column--cell",
      
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 1,
      cellClassName: "name-column--cell",
      
    },

      {
        field: "precio_unitario",
        headerName: "Precio",
        type: "number",
        headerAlign: "left",
        align: "left",
        flex: 1,
        renderCell: (params) => (
            <input
              type="number"
              value={params.row.precio_unitario}  // Default value
              onChange={(event) => handleInputChange(event, params.row.id, 'precio_unitario')}
              style={{ width: "80%" }}
            />
          ),
      },
      {
        field: "subtotal",
        headerName: "Subtotal",
        type: "number",
        headerAlign: "left",
        align: "left",
        flex: 1,
        valueGetter: (params) => {
          // Ensure params and params.row exist before accessing properties
          if (params && params.row) {
            const quantity = parseFloat(params.row.quantity) || 0; // Default to 0 if undefined or NaN
            const precioUnitario = parseFloat(params.row.precio_unitario) || 0; // Default to 0 if undefined or NaN
            return quantity * precioUnitario;
          }
          return 0;
        },
        renderCell: (params) => {
          // Ensure params and params.row exist before rendering
          if (params && params.row) {
            const quantity = parseFloat(params.row.quantity) || 0;
            const precioUnitario = parseFloat(params.row.precio_unitario) || 0;
            const subtotal = quantity * precioUnitario;
            return (
              <Typography>
                {"Q " + subtotal.toFixed(2)}
              </Typography>
            );
          }
          return (
            <Typography>Q 0.00</Typography>
          );
        },
      }       
  ];
  
  
  //Repuestos
  const [repuestos, setRepuestos] = useState([]);
  const [filteredRepuestos, setFilteredRepuestos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    Marca: "",
    ModeloLinea: "",
    modelo: '',
    linea: '',
    Repuesto: "",
    precio: 0,
    id_carro: null,
  });

  const initialRepuesto = {
    Marca: "",
    ModeloLinea: "",
    modelo: '',
    linea: '',
    Repuesto: "",
    precio: 0,
  }

  const fetchEmpleados = async () => {
    try {
      
      // const response = await axios.get(`http://127.0.0.1:5000/empleados`);
      const response = await axios.get(`${config.API_BASE_URL}/empleados`);
  
      // `response.data` contiene los datos devueltos por la API
      const data = response.data;
      console.log("Datos recibidos:", data);
  
      // Actualiza el estado con los empleados de la BDD
      setEmpleados(data.map(emp => ({
        id: emp.id,
        nombre: `${emp.nombre} ${emp.apellido}`,
      })));
    } catch (error) {
      console.error("Error al cargar empleados:", error.message);
    }
  };
  

  // Fetch data from the backend
  const datos = async () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Asignar quantity: 1 a cada elemento del carrito
    const updatedCarrito = carrito.map((item) => ({
      ...item,
      quantity: 1, // Fijar la cantidad a 1 para cada elemento
    }));
  
    if (JSON.stringify(carrito) !== JSON.stringify(repuestos)) {
      setRepuestos(updatedCarrito);
    }
  };
  

  // Initial fetch of data when the component mounts or when `id` changes
  // Run the effect when `carros` changes
    useEffect(() => {
        // Perform any action when `carros` updates
        fetchEmpleados();
        datos();  // Fetch new data
        // limpiarCarrito()
    }, [editing]);  // Add `carros` as a dependency to trigger the effect on change
    // Runs when the URL id changes

  // Handle search term changes to filter the displayed cars
  useEffect(() => {
    const searchFiltered = repuestos.filter((carro) =>
      Object.values(carro)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredRepuestos(searchFiltered);
  }, [searchTerm, repuestos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const marcasRes = await axios.get("http://3.140.209.59:8000/marcas");
        // const carrosRes = await axios.get("http://3.140.209.59:8000/carros");
        const marcasRes = await axios.get(`${config.API_BASE_URL}/marcas`);
        const carrosRes = await axios.get(`${config.API_BASE_URL}/carros`);
        setMarcas(marcasRes.data);
        setCarros(carrosRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  },[Refresh])

  // Handle Marca selection and filter carros
  const handleMarcaChange = (e) => {
    const selectedMarca = e.target.value;
    setNuevoRepuesto({ ...nuevoRepuesto, Marca: selectedMarca, ModeloLinea: "" });

    const filtered = carros.filter((carro) => carro.marca_id === selectedMarca);
    setFilteredCarros(filtered);
  };

  // Handle Carro selection (Linea + Modelo)
  const handleCarroSelect = (e) => {
    const selectedCarro = filteredCarros.find(carro => carro.id === e.target.value);
    setNuevoRepuesto({ 
      ...nuevoRepuesto, 
      ModeloLinea: `${selectedCarro.linea} - ${selectedCarro.modelo}`,
      modelo: selectedCarro.modelo,
      linea: selectedCarro.linea,
      id_carro: selectedCarro.id
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (event, id, field) => {
    const { value } = event.target;
  
    console.log("Value:", value);
    console.log("ID:", id);
    console.log("Field:", field);
    console.log("Repuestos:", repuestos);
  
    // Find the index of the item to update
    const indexToUpdate = repuestos.findIndex((carro) => carro.id === id);
    console.log("Index:", indexToUpdate);
  
    if (indexToUpdate !== -1) {
      // Create a copy of the repuestos array to avoid mutating the original state
      const updatedRepuestos = [...repuestos];
  
      // Update the specific field for the repuesto
      updatedRepuestos[indexToUpdate] = {
        ...updatedRepuestos[indexToUpdate],
        [field]: value, // Update the field with the new value
      };
  
      // Update the repuestos state
      setRepuestos(updatedRepuestos);
  
      // Calculate the new total
      const newTotal = updatedRepuestos.reduce((sum, carro) => {
        const quantity = parseFloat(carro.quantity) || 0;
        const precioUnitario = parseFloat(carro.precio_unitario) || 0;
        return sum + quantity * precioUnitario;
      }, 0);
  
      // Update nuevaOrden.total with the new total
      setNuevaOrden((prevOrden = {}) => ({ ...prevOrden, total: newTotal }));
      setTotalRestante(newTotal);
  
      // Log for debugging
      console.log("Updated Repuestos:", updatedRepuestos);
      console.log("New Total:", newTotal);
      console.log("Total Restante:", totalRestante);
    } else {
      console.error("No se encontró el carro con ID:", id);
    }
  };
  

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/carros/${id}`);
      datos(); // Refresh the list of cars
    } catch (error) {
      console.error("Error al eliminar el carro:", error);
    }
  };
  function limpiarCarrito() {
    localStorage.removeItem('carrito');
    window.location.reload();
  }


  const agregarAlCarrito = (repuesto) => {
    console.log('Datos del repuesto:', repuesto);

    const itemCarrito = {
      id: repuesto.id || Date.now(),  // Use timestamp if no id provided
      repuesto: repuesto.Repuesto,
      precio: repuesto.precio_unitario || 0,  // Add default value if missing
      modelo: repuesto.modelo,
      linea: repuesto.linea,
      marca: repuesto.Marca,
      id_carro: repuesto.id_carro,
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(itemCarrito);
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  // Modificar Vendidos
  const incrementarVendidos = async (idInventario) => {
    try {
      // Primero intentamos obtener los datos del inventario actual
      const response = await fetch(`${config.API_BASE_URL}/inventarios/${idInventario}`);
  
      // Si el inventario no existe
      if (!response.ok) {
        console.log("Inventario no encontrado o ID inválido. Se intentará agregar el inventario.");
        
        // Busca los datos del repuesto en el array `repuestos`
        const repuestoData = repuestos.find((item) => item.id === idInventario);
  
        if (!repuestoData) {
          console.error(`Repuesto con ID ${idInventario} no encontrado en el array.`);
          return null;
        }
  
        // Realiza un POST para agregar el inventario
        const responsePost = await fetch("${config.API_BASE_URL}/inventarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_carro: repuestoData.id_carro || 0,
            repuesto: repuestoData.repuesto || "Desconocido",
            ingresados: 1,
            vendidos: 0,
            precio_unitario: 0.0,
          }),
        });
  
        if (!responsePost.ok) {
          throw new Error("Error al agregar el inventario.");
        }
  
        const responseData = await responsePost.json();
        const nuevoInventario = responseData.inventario;
  
        if (!nuevoInventario || !nuevoInventario.id) {
          console.error("El servidor no devolvió un ID válido para el nuevo inventario:", nuevoInventario);
          return null;
        }
        setInventariosID((prevInventariosID) => [...prevInventariosID, nuevoInventario.id]);
        await new Promise((resolve) => setTimeout(resolve, 10000)); // 500 ms de espera
  
        console.log("Inventario agregado exitosamente:", nuevoInventario);
        console.log("Inventario Nuevo ID:", nuevoInventario.id);
  
        // Incrementa los vendidos del inventario recién creado
        return await incrementarVendidos(nuevoInventario.id);
      }
  
      // Si el inventario ya existe
      const inventario = await response.json();
  
      // Incrementamos en 1 el valor de vendidos
      const nuevosVendidos = inventario.vendidos + 1;
  
      // Actualizamos el inventario con la nueva cantidad de vendidos
      const updateResponse = await fetch(`${config.API_BASE_URL}/inventarios/${idInventario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendidos: nuevosVendidos,
        }),
      });
  
      if (!updateResponse.ok) {
        throw new Error("Error al actualizar los vendidos");
      }
  
      const inventarioActualizado = await updateResponse.json();
      console.log("Inventario actualizado con éxito:", inventarioActualizado);
      return inventarioActualizado;
    } catch (error) {
      console.error("Error al incrementar vendidos:", error);
    }
  };
  

  


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    agregarAlCarrito(nuevoRepuesto);  // Add the repuesto to the cart
    setNuevoRepuesto(initialRepuesto);
    datos();
    handleCloseModal();  // Close the modal after submission
  };

  const handleSubmitConfirmar = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Validate the form data
    if (!nuevaOrden.origen) {
      alert("Por favor selecciona un origen.");
      return;
    }
    if (!nuevaOrden.vendedor) {
      alert("Por favor selecciona un vendedor.");
      return;
    }
    if (!nuevaOrden.bodeguero) {
      alert("Por favor selecciona un bodeguero.");
      return;
    }
    if (nuevaOrden.total <= 0) {
      alert("El total debe ser mayor a 0.");
      return;
    }
  
    // Check if we're editing an existing order or creating a new one
    const updatedOrder = {
      ...nuevaOrden,
      origen: nuevaOrden.origen,
      vendedor: nuevaOrden.vendedor,
      bodeguero: nuevaOrden.bodeguero,
    };
  
    setEditing(false);
    handleCloseModalConfirmar();
    handleOpenModalPago();
    console.log(nuevaOrden)
    const extractedIds = repuestos.map((repuesto) => repuesto.id);

    // Update the state with the extracted IDs
    setInventariosID(extractedIds);

    console.log("Inventarios seleccionados (IDs):", extractedIds);
  };

  const handleSubmitPago = (metodo, cantidad, referencia) => {
    setNuevaOrden((prevOrden) => {
      const nuevosPagos = [
        ...(prevOrden.pagos || []),
        { 
          metodo, 
          cantidad, 
          referencia: referencia || null // Explicitly set referencia to null if it's empty
        }
      ];
      const nuevoTotalRestante = totalRestante - cantidad;
  
      if (nuevoTotalRestante === 0) {
        console.log("Total Completado");
        setTotalRestante(0);
        handleSubmitOrden({
          ...prevOrden,
          pagos: nuevosPagos, // Incluye los pagos actualizados directamente
        });
      } else {
        console.log("Total restante:", nuevoTotalRestante);
        setTotalRestante(nuevoTotalRestante);
        setTimeout(() => handleOpenModalPago(), 100);
      }
  
      return {
        ...prevOrden,
        pagos: nuevosPagos,
      };
    });
  };
  

  const handleSubmitOrden = async (ordenData) => {
    const data = ordenData || nuevaOrden; // Usa `ordenData` si se pasa, o el estado actual
  
    // Verifica si `inventariosID` contiene datos
    if (!inventariosID || inventariosID.length === 0) {
      alert("No se han seleccionado inventarios para la orden.");
      return;
    }
  
    try {   
      let updatedInventariosID = [...inventariosID]; 
      // Log the current inventory IDs
      console.log("Inventarios en tiempo real antes de procesar:", inventariosID);

      // Process each inventory ID before proceeding
      for (const idInventario of inventariosID) {
        try {
          await incrementarVendidos(idInventario); // Increment 'vendidos' for each inventory
          console.log(`Incrementado 'vendidos' para inventario ID: ${idInventario}`);
        } catch (error) {
          console.error(`Error al incrementar 'vendidos' para inventario ID: ${idInventario}`, error);
        }
      }

      setInventariosID((prev) => {
        const newIDs = [...prev]; // Get the most up-to-date IDs
        updatedInventariosID = newIDs; // Synchronize with the local variable
        return newIDs; // Update state to ensure consistency
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("Enviando los siguientes inventarios:", updatedInventariosID);
      
      // Paso 1: Crear la orden
      const ordenResponse = await fetch(`${config.API_BASE_URL}/orden`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen: data.origen,
          total: data.total,
          vendedor_id: data.vendedor,
          bodeguero_id: data.bodeguero,
          inventarios: updatedInventariosID, // Enviar los IDs de inventarios
        }),
      });
  
      if (!ordenResponse.ok) {
        throw new Error('Error al crear la orden');
      }
  
      const nuevaOrdenCreada = await ordenResponse.json();
      console.log('Orden creada con éxito:', nuevaOrdenCreada);
  
      // Paso 2: Agregar los pagos
      for (const pago of data.pagos) {
        const pagoResponse = await fetch(`${config.API_BASE_URL}/orden/${nuevaOrdenCreada.id}/pago`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pago),
        });
  
        if (!pagoResponse.ok) {
          throw new Error(`Error al agregar el pago: ${pago.metodo}`);
        }
  
        const nuevoPago = await pagoResponse.json();
        console.log('Pago agregado con éxito:', nuevoPago);
      }

      
  
      // Notificación de éxito
      alert('Orden, pagos y actualizaciones de inventarios realizados con éxito.');
  
      // Limpia el estado después de enviar
      setNuevaOrden({
        origen: "",
        vendedor: null,
        bodeguero: null,
        total: 0.0,
        pagos: [],
      });
      setInventariosID([]);
      setNuevoPago({ metodo: "", cantidad: 0.0 });
      limpiarCarrito();
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar la orden o los pagos.');
    }
  };
  
  
  
  
  
  

  const handlePrint = async () => {
    try {
      // Simula obtener las órdenes del día desde el backend
      
      const response = await fetch(`${config.API_BASE_URL}/orden/dia`);
      if (!response.ok) throw new Error('Error al obtener las órdenes del día');
      const ordenesDelDia = await response.json();
  
      // Calcula el total general del día
      const totalDia = ordenesDelDia.reduce((total, orden) => total + orden.total, 0);
  
      // Crear una ventana imprimible
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
  
      // Genera el contenido HTML para la impresión
      let contenidoHTML = `
        <html>
          <head>
            <title>Reporte de Órdenes del Día</title>
            <style>
              @page { size: auto; margin: 0; }
              body { font-family: Arial, sans-serif; margin: 20px; font-size:10pt; }
              .header { text-align: center; margin-bottom: 20px; }
              .header img { max-width: 100px; }
              .header h1 { font-size: 30px; }
              .total-dia { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size:8pt; }
              th, td { border: 1px solid #000; padding: 5px; text-align: center; }
              th { background-color: #f2f2f2; }
              .orden-header { margin-top: 15px; font-size: 25px; font-weight: bold; }
              .hr-separator {
                border: 0; /* Elimina bordes predeterminados */
                border-top: 4px solid #000; /* Ajusta el grosor y color */
                margin: 10px 0; /* Espaciado */
              }

            </style>
          </head>
          <body>
            <div class="header">
              <h1>Reporte de Órdenes del Día</h1>
            </div>
            <div class="total-dia">Total del Día: Q ${totalDia.toFixed(2)}</div>
      `;
  
      // Agregar cada orden al contenido
      ordenesDelDia.forEach((orden) => {
        contenidoHTML += `
          <div class="orden-header">ORDEN NO: ${orden.id}</div>
          <table> 
            <thead>
              <tr>
                <th>ID</th>
                <th colspan="3" style="text-align: center; font-weight: bold;">Repuesto</th>
              </tr>
            </thead>
            <tbody>
        `;
  
        orden.inventarios.forEach((inventario) => {
          contenidoHTML += `
            <tr>
              <td>${inventario.id}</td>
              <td colspan="3" style="text-align: center;">${inventario.repuesto}</td>
            </tr>
          `;
        });
  
        contenidoHTML += `
            </tbody>
            <tfoot>
              <tr>
                <td colspan="1.5" style="text-align: center; font-weight: bold;">Total Orden:</td>
                <td colspan="0.5" style="text-align: center; font-weight: bold;">Q ${orden.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <div class="orden-header">PAGOS</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Método</th>
                <th>Referencia</th>
                <th>Monto</th>
                
              </tr>
            </thead>
            <tbody>
        `;
  
        orden.pagos.forEach((pago) => {
          contenidoHTML += `
            <tr>
              <td>${pago.id}</td>
              <td>${pago.metodo}</td>
              <td>${pago.referencia}</td>
              <td>Q ${pago.cantidad.toFixed(2)}</td>
              
            </tr>
          `;
        });
  
        contenidoHTML += `
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Total PAGOS:</td>
                <td>Q ${orden.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <tr>
            <td><hr class="hr-separator" /></td>
          </tr>
          
        `;
      });
  
      contenidoHTML += `
          </body>
        </html>
      `;
  
      // Escribe el contenido en la ventana de impresión
      printWindow.document.write(contenidoHTML);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      alert('Hubo un error al generar el reporte.');
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
          <Button variant="contained" color="secondary" onClick={handleOpenModal}>
            Otro Repuesto
          </Button>
          <Button variant="contained" color="secondary" onClick={() => {navigate("/marcas");}}>
            Agregar Repuesto
          </Button>
          <Button variant="contained" color="secondary" onClick={limpiarCarrito}>
            Limpiar Orden
          </Button>
          <Button variant="contained" color="secondary" onClick={handleOpenModalConfirmar}>
            Confirmar Orden
          </Button>
          <Button variant="contained" color="secondary" onClick={handlePrint}>
            Reporte de Ordenes
          </Button>
        </Box>
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
            rows={filteredRepuestos}
            columns={columnas}
            getRowId={(row) => row.id}  // Use the nested id from repuesto_id as the row id
        />
      </Box>


      {/* Modal Orden*/}
      <Modal
        open={openModalConfirmar}
        onClose={handleCloseModalConfirmar}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            {editing ? "Guardar Cambios en la Orden" : "Crear Nueva Orden"}
          </Typography>
          <Box component="form" onSubmit={handleSubmitConfirmar}>
            {/* Origen Dropdown */}
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="origen-label">Origen</InputLabel>
              <Select
                labelId="origen-label"
                id="Origen"
                value={nuevaOrden.origen}
                onChange={(e) =>
                  setNuevaOrden({ ...nuevaOrden, origen: e.target.value })
                }
              >
                {origenes.map((origen) => (
                  <MenuItem key={origen} value={origen}>
                    {origen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Vendedor Dropdown */}
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="vendedor-label">Vendedor</InputLabel>
              <Select
                labelId="vendedor-label"
                id="Vendedor"
                value={nuevaOrden.vendedor}
                onChange={(e) =>
                  setNuevaOrden({ ...nuevaOrden, vendedor: e.target.value })
                }
              >
                {empleados.map((empleado) => (
                  <MenuItem key={empleado.id} value={empleado.id}>
                    {empleado.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Bodeguero Dropdown */}
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="bodeguero-label">Bodeguero</InputLabel>
              <Select
                labelId="bodeguero-label"
                id="Bodeguero"
                value={nuevaOrden.bodeguero}
                onChange={(e) =>
                  setNuevaOrden({ ...nuevaOrden, bodeguero: e.target.value })
                }
              >
                {empleados.map((empleado) => (
                  <MenuItem key={empleado.id} value={empleado.id}>
                    {empleado.nombre}
                  </MenuItem>
                ))}
              </Select>
              <h1>
                {nuevaOrden.total}
              </h1>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">
              {editing ? "Guardar Cambios" : "Crear Orden"}
            </Button>
          </Box>
        </Box>
      </Modal>




      {/* Modal Pago*/}
      <Modal
        open={openModalPago}
        onClose={handleCloseModalPago}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Agregar Pago
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitPago(nuevoPago.metodo, nuevoPago.cantidad, nuevoPago.referencia); // Use the function to add the payment
              setNuevoPago({
                metodo: "",
                cantidad: 0.0,
                referencia: "",
              }); // Reset the new payment state
              handleCloseModalPago(); // Close the modal
            }}
          >
            {/* Método de Pago */}
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="metodo-label">Método de Pago</InputLabel>
              <Select
                labelId="metodo-label"
                id="Metodo"
                value={nuevoPago.metodo}
                onChange={(e) =>
                  setNuevoPago((prevPago) => ({ ...prevPago, metodo: e.target.value }))
                }
              >
                {metodos.map((metodo) => (
                  <MenuItem key={metodo} value={metodo}>
                    {metodo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Cantidad */}
            <TextField
              required
              fullWidth
              id="Cantidad"
              name="Cantidad"
              label="Cantidad"
              type="number"
              value={nuevoPago.cantidad}
              onChange={(e) =>
                setNuevoPago((prevPago) => ({
                  ...prevPago,
                  cantidad: parseFloat(e.target.value) || 0,
                }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              required={nuevoPago.metodo !== "Efectivo"}
              fullWidth
              id="Referencia"
              name="Referencia"
              label="Referencia"
              type="text"
              value={nuevoPago.referencia}
              onChange={(e) =>
                setNuevoPago((prevPago) => ({
                  ...prevPago,
                  referencia: e.target.value || null,
                }))
              }
              sx={{ mb: 2 }}
            />
            <h1>
              Total Restante: {totalRestante}
            </h1>

            {/* Botón para agregar el pago */}
            <Button type="submit" variant="contained" color="primary">
              Agregar Pago
            </Button>
          </Box>
        </Box>
      </Modal>





      {/* Modal Otro Repuesto*/}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            {editing ? "Guardar Cambios" : "Agregar Repuesto"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Marca Dropdown */}
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="marca-label">Marca</InputLabel>
              <Select
                labelId="marca-label"
                id="Marca"
                value={nuevoRepuesto.Marca || ""}
                onChange={handleMarcaChange}
              >
                {marcas.map((marca) => (
                  <MenuItem key={marca.id} value={marca.id}>
                    {marca.Marca}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="carro-label">Modelo y Línea</InputLabel>
              <Select
                labelId="carro-label"
                id="ModeloLinea"
                value={
                  // Find the selected carro by matching the combined string with the filtered carros
                  filteredCarros.find(
                    (carro) => `${carro.linea} - ${carro.modelo}` === nuevoRepuesto.ModeloLinea
                  )?.id || ""
                }
                onChange={handleCarroSelect}
                disabled={!filteredCarros.length}  // Disable if no filtered carros available
              >
                {filteredCarros.map((carro) => (
                  <MenuItem key={carro.id} value={carro.id}>
                    {carro.linea} - {carro.modelo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            {/* Repuesto Input */}
            <TextField
              required
              fullWidth
              id="Repuesto"
              name="Repuesto"
              label="Repuesto"
              value={nuevoRepuesto.Repuesto}
              onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, Repuesto: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Button type="submit" variant="contained" color="primary">
              {editing ? "Guardar Cambios" : "Agregar Repuesto"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Ordenes;
