import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import RecipeTable from './components/RecipeTable';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecipeTable />
    </ThemeProvider>
  );
}

export default App;
