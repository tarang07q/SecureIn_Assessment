require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Recipe = require('./models/recipe');

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipes_db';
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Helper function to parse numeric operators
function parseNumericFilter(value) {
  if (!value) return null;
  
  const trimmed = String(value).trim();
  
  // Match patterns: >=4.5, <=400, >4, <60, =5, or just 5
  const match = trimmed.match(/^(>=|<=|>|<|=)?(\d+(?:\.\d+)?)$/);
  
  if (!match) return null;
  
  const operator = match[1] || '=';
  const numValue = parseFloat(match[2]);
  
  if (!Number.isFinite(numValue)) return null;
  
  return { operator, value: numValue };
}

// Helper function to build MongoDB query for numeric field
function buildNumericQuery(operator, value) {
  switch (operator) {
    case '>=': return { $gte: value };
    case '<=': return { $lte: value };
    case '>': return { $gt: value };
    case '<': return { $lt: value };
    case '=': return value;
    default: return value;
  }
}

// GET /api/recipes - Get all recipes with pagination and sorting
app.get('/api/recipes', async (req, res) => {
  try {
    // Parse and validate pagination parameters
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    
    // Set defaults and boundaries
    if (!page || page < 1 || isNaN(page)) {
      page = 1;
    }
    
    if (!limit || limit < 1 || isNaN(limit)) {
      limit = 10;
    }
    
    // Max limit to prevent overload
    if (limit > 100) {
      limit = 100;
    }
    
    const skip = (page - 1) * limit;
    
    // Get total count and paginated data
    const total = await Recipe.countDocuments();
    const data = await Recipe.find()
      .sort({ rating: -1, _id: 1 }) // Sort by rating desc, then by id for consistency
      .skip(skip)
      .limit(limit)
      .select('-__v -createdAt -updatedAt')
      .lean();
    
    res.json({
      page,
      limit,
      total,
      data
    });
    
  } catch (error) {
    console.error('Error in /api/recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/recipes/search - Search recipes with filters
app.get('/api/recipes/search', async (req, res) => {
  try {
    const query = {};
    const allowedParams = ['title', 'cuisine', 'calories', 'rating', 'total_time'];
    
    // Validate that only allowed parameters are used
    const providedParams = Object.keys(req.query);
    const invalidParams = providedParams.filter(param => !allowedParams.includes(param));
    
    if (invalidParams.length > 0) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        invalidParams,
        allowedParams
      });
    }
    
    // Title filter - partial match, case-insensitive
    if (req.query.title) {
      const titleValue = String(req.query.title).trim();
      if (titleValue) {
        query.title = { $regex: titleValue, $options: 'i' };
      }
    }
    
    // Cuisine filter - exact match, case-insensitive
    if (req.query.cuisine) {
      const cuisineValue = String(req.query.cuisine).trim();
      if (cuisineValue) {
        query.cuisine = { $regex: `^${cuisineValue}$`, $options: 'i' };
      }
    }
    
    // Calories filter with operators
    if (req.query.calories) {
      const parsed = parseNumericFilter(req.query.calories);
      if (parsed) {
        query.calories_value = buildNumericQuery(parsed.operator, parsed.value);
      } else {
        return res.status(400).json({
          error: 'Invalid calories format. Use: >=400, <=300, >200, <500, =250, or just 250'
        });
      }
    }
    
    // Rating filter with operators
    if (req.query.rating) {
      const parsed = parseNumericFilter(req.query.rating);
      if (parsed) {
        query.rating = buildNumericQuery(parsed.operator, parsed.value);
      } else {
        return res.status(400).json({
          error: 'Invalid rating format. Use: >=4.5, <=3.0, >4, <5, =5, or just 4.5'
        });
      }
    }
    
    // Total time filter with operators
    if (req.query.total_time) {
      const parsed = parseNumericFilter(req.query.total_time);
      if (parsed) {
        query.total_time = buildNumericQuery(parsed.operator, parsed.value);
      } else {
        return res.status(400).json({
          error: 'Invalid total_time format. Use: >=60, <=30, >45, <90, =60, or just 60'
        });
      }
    }
    
    // Execute query
    const data = await Recipe.find(query)
      .select('-__v -createdAt -updatedAt')
      .lean();
    
    res.json({ data });
    
  } catch (error) {
    console.error('Error in /api/recipes/search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
