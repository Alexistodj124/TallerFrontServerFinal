import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../tema";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { MenuOutlined } from "@mui/icons-material";

const Item = ({ titulo, to, icono, seleccionado, setSeleccionado }) => {
  const tema = useTheme();
  const colores = tokens(tema.palette.mode);
  return (
    <MenuItem
      active={seleccionado === titulo}
      style={{ color: colores.gris[100] }}
      onClick={() => setSeleccionado(titulo)}
      icon={icono}
    >
      <Typography>{titulo}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");

  // Detect if screen is small
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [collapsed, setCollapsed] = useState(isMobile);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle opening and closing of the drawer for mobile views
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  // Handle collapsing the sidebar on larger screens
  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const sidebarContent = (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primario[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={collapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={handleToggleCollapse}
            icon={collapsed ? <MenuOutlined /> : undefined}
            style={{ margin: "10px 0 20px 0", color: colors.gris[100] }}
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.gris[100]}>
                  Taller
                </Typography>
                <IconButton onClick={handleToggleCollapse}>
                  <MenuOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!collapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="perfil usuario"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.gris[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Nombre Usuario
                </Typography>
                <Typography variant="h5" color={colors.verdeDecor[500]}>
                  Puesto usuario
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={collapsed ? undefined : "10%"}>
            <Item
              titulo="Dashboard"
              to="/"
              icono={<HomeOutlinedIcon />}
              seleccionado={selected}
              setSeleccionado={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.gris[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Manejo
            </Typography>
            <Item
              titulo="Marcas"
              to="/marcas"
              icono={<DirectionsCarFilledOutlinedIcon />}
              seleccionado={selected}
              setSeleccionado={setSelected}
            />
            <Item
              titulo="Carros"
              to="/carros"
              icono={<DirectionsCarFilledOutlinedIcon />}
              seleccionado={selected}
              setSeleccionado={setSelected}
            />
            <Item
              titulo="Usuarios"
              to="/usuarios"
              icono={<PeopleOutlinedIcon />}
              seleccionado={selected}
              setSeleccionado={setSelected}
            />
            <Item
              titulo="Inventario"
              to="/inventario"
              icono={<ReceiptOutlinedIcon />}
              seleccionado={selected}
              setSeleccionado={setSelected}
            />
            <Item
              titulo="Orden"
              to="/orden"
              icono={<ReceiptOutlinedIcon />}
              seleccionado={selected}
              setSeleccionado={setSelected}
            />
            <Item
              titulo="Calendario"
              to="/calendario"
              icono={<CalendarTodayOutlinedIcon />}
              seleccionado={selected}
              setSeleccionado={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ position: "fixed", top: "10px", left: "10px", zIndex: 1300 }}
          >
            <MenuOutlined />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 250,
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        sidebarContent
      )}
    </>
  );
};

export default Sidebar;
