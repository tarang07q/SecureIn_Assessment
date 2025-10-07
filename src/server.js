require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Recipe = require('./models/recipe');

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipes_db';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

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

app.get('/api/recipes', async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    
    if (!page || page < 1 || isNaN(page)) {
      page = 1;
    }
    
    if (!limit || limit < 1 || isNaN(limit)) {
      limit = 10;
    }
    if (limit > 50) {
      limit = 50;
    }
    
    const skip = (page - 1) * limit;

    const total = await Recipe.countDocuments();
    const data = await Recipe.find()
      .sort({ rating: -1, _id: 1 })
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

app.get('/api/recipes/search', async (req, res) => {
  try {
    const query = {};
    const allowedParams = ['title', 'cuisine', 'calories', 'rating', 'total_time'];

    const providedParams = Object.keys(req.query);
    const invalidParams = providedParams.filter(param => !allowedParams.includes(param));
    
    if (invalidParams.length > 0) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        invalidParams,
        allowedParams
      });
    }
    
    if (req.query.title) {
      const titleValue = String(req.query.title).trim();
      if (titleValue) {
        query.title = { $regex: titleValue, $options: 'i' };
      }
    }

    if (req.query.cuisine) {
      const cuisineValue = String(req.query.cuisine).trim();
      if (cuisineValue) {
        query.cuisine = { $regex: `^${cuisineValue}$`, $options: 'i' };
      }
    }
    

    if (req.query.calories) {
      const parsed = parseNumericFilter(req.query.calories);
      if (parsed) {
        query.calories_value = buildNumericQuery(parsed.operator, parsed.value);
      } else {
        return res.status(400).json({
          error: 'Invalid calories format. Use: >=400, <=300, >200, <500, =250, or just 250'
        });0
      }
    }
    
    if (req.query.rating) {
      const parsed = parseNumericFilter(req.query.rating);
      if (parsed) {
        query.rating = buildNumericQuery(parsed.operator, parsed.value);
      } else {
        return res.status(400).json({
          error: 'Invalid rating format'
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
          error: 'Invalid total_time format.'
        });
      }
    }

    const data = await Recipe.find(query)
      .select('-__v -createdAt -updatedAt')
      .lean();
    
    res.json({ data });
    
  } catch (error) {
    console.error('Error in /api/recipes/search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
