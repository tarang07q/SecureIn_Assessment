import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Rating,
  CircularProgress,
  Alert,
  Toolbar,
  Grid,
  InputAdornment,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { recipeService } from '../services/recipeService';
import RecipeDetailDrawer from './RecipeDetailDrawer';

const RecipeTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [total, setTotal] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    title: '',
    cuisine: '',
    rating: '',
    calories: '',
    total_time: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchRecipes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (Object.keys(appliedFilters).length > 0) {
        // Use search endpoint with filters
        data = await recipeService.searchRecipes(appliedFilters);
      } else {
        // Use regular pagination endpoint
        data = await recipeService.getAllRecipes(page + 1, rowsPerPage);
      }

      setRecipes(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, appliedFilters]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (recipe) => {
    setSelectedRecipe(recipe);
    setDrawerOpen(true);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].trim() !== '') {
        activeFilters[key] = filters[key].trim();
      }
    });
    setAppliedFilters(activeFilters);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      cuisine: '',
      rating: '',
      calories: '',
      total_time: ''
    });
    setAppliedFilters({});
    setPage(0);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3}>
        {/* Header */}
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Recipe Management System
          </Typography>

          {/* Filters */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Filters</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Title"
                  value={filters.title}
                  onChange={(e) => handleFilterChange('title', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cuisine"
                  value={filters.cuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Rating (e.g., >=4.5)"
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  placeholder=">=4.5"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Calories (e.g., <=400)"
                  value={filters.calories}
                  onChange={(e) => handleFilterChange('calories', e.target.value)}
                  placeholder="<=400"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Total Time (e.g., <=60)"
                  value={filters.total_time}
                  onChange={(e) => handleFilterChange('total_time', e.target.value)}
                  placeholder="<=60"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
              <Button variant="outlined" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Box>
          </Box>
        </Toolbar>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* No Results */}
        {!loading && !error && recipes.length === 0 && (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search criteria. Nice to Have!
            </Typography>
          </Box>
        )}

        {/* Table */}
        {!loading && !error && recipes.length > 0 && (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Cuisine</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Rating</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Total Time</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>No. of People Serves</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipes.map((recipe, index) => (
                    <TableRow
                      key={recipe._id || index}
                      hover
                      onClick={() => handleRowClick(recipe)}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell sx={{ maxWidth: 300 }}>
                        {truncateText(recipe.title, 50)}
                      </TableCell>
                      <TableCell>{recipe.cuisine || 'N/A'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={recipe.rating || 0} precision={0.1} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {recipe.rating ? recipe.rating.toFixed(1) : 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{recipe.total_time || 0} min</TableCell>
                      <TableCell>{recipe.serves || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[15, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Detail Drawer */}
      <RecipeDetailDrawer
        recipe={selectedRecipe}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Container>
  );
};

export default RecipeTable;
