# Family Recipes website

## Easily resume cooking after returning from a distraction

Tap to check off each ingredient you set out and each preparation or cooking step

## See estimated cooking time as well as nutritional information

Ingredients for each recipe are sent to the Edamam Nutritional Analysis API. The response contains macro information and each recipe lists the total calories as well as the number of grams of fat, carbs and protein.

## How to use the Edamam APIs to get nutrient information

1. Get an API_ID, API_KEY, and API_URL from Edamam's Nutrional Analysis API. Save these in a .env file in the root of the server directory.
2. From the server directory run...
   ```
   npm start
   ```

## How to add recipes

Once API information is in the .env file as described above you can create new recipes.

1. Duplicate and rename one of the recipe .json files from client/data/recipes and modify it as necessary.
2. From the server directory run...
   ```
   npm start
   ```
