import { Typography, Box, useTheme } from "@mui/material"
import { tokens } from "../tema"

const Header = ({titulo, subtitulo}) => {
    const tema = useTheme()
    const colores = tokens(tema.palette.mode)

    return <Box mb="30px" >
        <Typography variant="h2" color={colores.gris[100]} fontWeight="bold" sx={{mb: "5px"}} >
            {titulo}
        </Typography>
        <Typography variant="h5" color={colores.verdeDecor[400]} >
            {subtitulo}
        </Typography>
    </Box>
}

export default Header