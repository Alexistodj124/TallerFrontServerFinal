import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  Paper,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Header from "../../components/Header";
import axios from "axios";
import { tokens } from "../../tema";
import config from '../../config';

const Ordenes = () => {
  const tema = useTheme();
  const colores = tokens(tema.palette.mode);

  const [orders, setOrders] = useState([]);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/orden`);
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha) // Sort by date descending
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const Row = ({ order }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow
          sx={{
            "&:nth-of-type(even)": {
              backgroundColor: colores.primario[400],
            },
            "&:nth-of-type(odd)": {
              backgroundColor: colores.azulDecor[1000],
            },
          }}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              sx={{
                color: colores.verdeDecor[300],
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell sx={{ color: colores.verdeDecor[300] }}>
            {order.fecha}
          </TableCell>
          <TableCell sx={{ color: colores.verdeDecor[300] }}>
            {order.id}
          </TableCell>
          <TableCell sx={{ color: colores.verdeDecor[300] }}>
            {order.vendedor.nombre}
          </TableCell>
          <TableCell sx={{ color: colores.verdeDecor[300] }}>
            {order.bodeguero.nombre}
          </TableCell>
          <TableCell sx={{ color: colores.verdeDecor[300] }}>
            {order.total}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box
                margin={1}
                sx={{
                  backgroundColor: colores.azulDecor[700],
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{ color: colores.verdeDecor[200] }}
                >
                  Inventarios
                </Typography>
                <Table size="small" aria-label="inventarios">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        ID
                      </TableCell>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        Marca
                      </TableCell>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        Línea
                      </TableCell>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        Modelo
                      </TableCell>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        Repuesto
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.inventarios.map((inventario) => (
                      <TableRow key={inventario.id}>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {inventario.id}
                        </TableCell>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {inventario.carro.marca.Marca}
                        </TableCell>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {inventario.carro.linea}
                        </TableCell>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {inventario.carro.modelo}
                        </TableCell>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {inventario.repuesto}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{
                    marginTop: "16px",
                    color: colores.verdeDecor[200],
                  }}
                >
                  Pagos
                </Typography>
                <Table size="small" aria-label="pagos">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        ID
                      </TableCell>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        Método
                      </TableCell>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        Referencia
                      </TableCell>
                      <TableCell sx={{ color: colores.verdeDecor[200] }}>
                        Cantidad
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.pagos.map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {pago.id}
                        </TableCell>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {pago.metodo}
                        </TableCell>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {pago.referencia || "Sin Referencia"}
                        </TableCell>
                        <TableCell sx={{ color: colores.verdeDecor[300] }}>
                          {pago.cantidad}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <Box m="20px">
      <Header titulo="Órdenes" subtitulo="Listado de órdenes con detalles" />
      <Box
        m="40px 0 20px 0"
        height="70vh" // Define height for the scrollable area
        component={Paper}
        sx={{
            overflowY: "auto", // Enable vertical scrolling
            borderRadius: "10px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        }}
        >
        <TableContainer>
            <Table>
            <TableHead>
                <TableRow
                sx={{
                    backgroundColor: colores.azulDecor[700],
                    position: "sticky",
                    top: 0, // Stick to the top
                    zIndex: 1, // Ensure it stays above other content
                }}
                >
                <TableCell />
                <TableCell sx={{ color: colores.verdeDecor[300] }}>Fecha</TableCell>
                <TableCell sx={{ color: colores.verdeDecor[300] }}>No. Orden</TableCell>
                <TableCell sx={{ color: colores.verdeDecor[300] }}>Vendedor</TableCell>
                <TableCell sx={{ color: colores.verdeDecor[300] }}>Bodeguero</TableCell>
                <TableCell sx={{ color: colores.verdeDecor[300] }}>Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orders.map((order) => (
                <Row key={order.id} order={order} />
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </Box>

    </Box>
  );
};

export default Ordenes;
