import Topbar from "./pages/global/Topbar";
import { ColorModeContext, useMode } from "./tema";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route} from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Sidebar from './pages/global/Sidebar'
import Carros from './pages/carros'
import Usuarios from './pages/usuarios'
import CrearUsuarios from './pages/crearusuarios'
import EditarUsuarios from './pages/editarusuarios'
import Inventario from "./pages/inventario";
import Calendar from "./pages/calendar";
import Marcas from "./pages/marcas";
import Orden from "./pages/orden";
import Ordenes from "./pages/ordenes";


function App() {
  const [tema, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={tema}>
        <CssBaseline />
        <div className="app">
        <Sidebar/>
          <main className="content">
          <Topbar/>
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/carros" element={<Carros/>} />
            <Route path="/carros/:id" element={<Carros />} />
            <Route path="/inventario" element={<Inventario/>} />
            <Route path="/inventario/:id" element={<Inventario/>} />
            <Route path="/usuarios" element={<Usuarios/>} />
            <Route path="/crearUsuario" element={<CrearUsuarios/>} />
            <Route path="/editarUsuario/:id" element={<EditarUsuarios/>} />
            <Route path="/calendario" element={<Calendar/>} />
            <Route path="/marcas" element={<Marcas/>} />
            <Route path="/marcas/:id" element={<Marcas/>} />
            <Route path="/orden" element={<Orden/>} />
            <Route path="/ordenes" element={<Ordenes/>} />
          </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
