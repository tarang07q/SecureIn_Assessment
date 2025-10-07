import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const RecipeDetailDrawer = ({ recipe, open, onClose }) => {
  const [expandedTime, setExpandedTime] = React.useState(false);
  const [expandedNutrition, setExpandedNutrition] = React.useState(false);

  if (!recipe) return null;

  const nutrients = recipe.nutrients || {};
  const nutritionData = [
    { label: 'Calories', value: nutrients.calories || 'N/A' },
    { label: 'Carbohydrate', value: nutrients.carbohydrateContent || 'N/A' },
    { label: 'Cholesterol', value: nutrients.cholesterolContent || 'N/A' },
    { label: 'Fiber', value: nutrients.fiberContent || 'N/A' },
    { label: 'Protein', value: nutrients.proteinContent || 'N/A' },
    { label: 'Saturated Fat', value: nutrients.saturatedFatContent || 'N/A' },
    { label: 'Sodium', value: nutrients.sodiumContent || 'N/A' },
    { label: 'Sugar', value: nutrients.sugarContent || 'N/A' },
    { label: 'Fat', value: nutrients.fatContent || 'N/A' }
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: '450px' } }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              {recipe.title}
            </Typography>
            <Chip label={recipe.cuisine} color="primary" size="small" />
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2">
            {recipe.description || 'No description available'}
          </Typography>
        </Box>

        {/* Total Time with Expand */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
              p: 1,
              borderRadius: 1
            }}
            onClick={() => setExpandedTime(!expandedTime)}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Total Time
              </Typography>
              <Typography variant="h6">
                {recipe.total_time || 0} minutes
              </Typography>
            </Box>
            <IconButton size="small">
              {expandedTime ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {expandedTime && (
            <Box sx={{ mt: 1, pl: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Cook Time: <strong>{recipe.cook_time || 0} min</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prep Time: <strong>{recipe.prep_time || 0} min</strong>
              </Typography>
            </Box>
          )}
        </Box>

        {/* Nutrition Section */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
              p: 1,
              borderRadius: 1,
              mb: 1
            }}
            onClick={() => setExpandedNutrition(!expandedNutrition)}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Nutrition
            </Typography>
            <IconButton size="small">
              {expandedNutrition ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {expandedNutrition && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  {nutritionData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {item.label}
                      </TableCell>
                      <TableCell align="right">{item.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Serves */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            No. of People Serves
          </Typography>
          <Typography variant="body1">
            {recipe.serves || 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RecipeDetailDrawer;
