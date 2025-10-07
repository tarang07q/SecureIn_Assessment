# Recipe Data Collection and API Development

## Objective

To parse the JSON file, insert the data in a database(I chose NO SQL mongodb database)insert or populate the database and then create Endpoints as per the pdf given.

## Task Overview

1. **Parse the JSON Data**: Read and pardint the JSON file given named by US_recipes_null.json
2. **Store Data in a Database**: Store the relevant information from the JSON into a MongoDB database(npm run import alias for node scripts/import_recipes.js)

3. **Developint the Endpoint**:
   - GET request to -> Expose an endpoint to get all recipes in a paginated and sorted manner
   - GET request to -> Expose an endpoint to search for recipes based on various fields

## Database Design

Design a database schema to store the following fields from the recipe data:

1. cuisine (VARCHAR)
2. title (VARCHAR)
3. rating (FLOAT)
4. prep_time (INT)
5. cook_time (INT)
6. total_time (INT)
7. description(TEXT)
8. nutrients (JSONB)
9. serves (VARCHAR)


## Handling NaN Values

When parsing the JSON file and storing data in the database:

- If any numeric fields (like `rating`, `prep_time`, `cook_time`, or `total_time`) contain **NaN** values or invalid data, set those values to **NULL** before storing them in the database.

For example:
- If the `rating` is `"NaN"`, set it as `NULL`
- If `prep_time` or `cook_time` is `"NaN"`, set those as `NULL`


## API Development

Developing a RESTful API to display the data from the recipes table.

### API Endpoint 1: Get All Recipes (Paginated and Sorted by Rating)

**URL**: `/api/recipes`

**Method**: `GET`

**Query Parameters** (these params can be optional as well):
- `page`: Page number for pagination (default is 1)
- `limit`: Number of recipes per page (default is 10)

**Response**: A list of recipes sorted by rating in descending order.

### API Endpoint 2: Search Recipes

**URL**: `/api/recipes/search`

**Method**: `GET`

**Query Parameters**:
- **calories**: Filter by calories (greater than, less than, or equal to a specific value)
- **title**: Search by recipe title (partial match)
- **cuisine**: Filter by cuisine
- **total_time**: Filter by total time (greater than, less than, or equal to a specific value)
- **rating**: Filter by rating (greater than, less than, or equal to a specific value)

## Setup and Running

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
   ```powershell
   npm install
   ```

2. Configure environment:
   ```powershell
   # Copy .env.example to .env and update MONGO_URI
   cp .env.example .env
   ```

3. Import recipe data:
   ```powershell
   npm run import
   ```

4. Start the server:
   ```powershell
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Testing the API

#### Test Endpoint 1: Get All Recipes using Postman
- http://localhost:3000/api/recipes?page=1&limit=10 -Method GET

#### Test Endpoint 2: Get the Search based query output using Postman
- http://localhost:3000/api/recipes/search?title=pie&rating=>=4.5 -Method GET

