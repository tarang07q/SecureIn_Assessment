
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Recipe = require('../src/models/recipe');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipes_db';

function toNumberOrNull(v) {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const s = String(v).trim();
  if (s === '' || s.toLowerCase() === 'nan' || s.toLowerCase() === 'n/a') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function extractCalories(nutrients) {
  if (!nutrients) return null;
  const c = nutrients.calories || nutrients.Calories || null;
  if (!c) return null;
  // expect formats like '389 kcal' or '389'
  const m = /([0-9]+(?:\.[0-9]+)?)/.exec(String(c));
  if (!m) return null;
  return parseFloat(m[1]);
}

async function main() {
  console.log('Connecting to MongoDB', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('Connected.');

  const filePath = path.resolve(__dirname, '..', 'US_recipes_null.json');
  console.log('Reading', filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);

  const docs = Object.keys(parsed).map(key => {
    const r = parsed[key];
    return {
      cuisine: r.cuisine || r.Cuisine || null,
      title: r.title || null,
      rating: toNumberOrNull(r.rating),
      prep_time: toNumberOrNull(r.prep_time),
      cook_time: toNumberOrNull(r.cook_time),
      total_time: toNumberOrNull(r.total_time),
      description: r.description || null,
      nutrients: r.nutrients || null,
      serves: r.serves || null,
      calories_value: extractCalories(r.nutrients)
    };
  });

  console.log('Inserting', docs.length, 'documents');
  await Recipe.deleteMany({});
  await Recipe.insertMany(docs, { ordered: false });
  console.log('Done inserting');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
