import { Box, Typography } from "@mui/material";
import Viewer from "./components/Viewer";

function App() {
  return (
    <>
      <Box m="2.5rem 2.5rem">
        <Box>
          <Typography
            variant="h2"
            color="primary"
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            FMCSA Viewer
          </Typography>
          <Typography variant="h5" color="white">
            Federal Motor Carrier Safety Administration
          </Typography>
        </Box>

        <Viewer />
      </Box>
    </>
  );
}

export default App;
