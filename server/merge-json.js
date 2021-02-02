"use strict";
const fs = require("fs");

const clientDataDirectory = "../client/data/";
const recipesDirectory = clientDataDirectory + "recipes/";
const recipesPath = clientDataDirectory + "recipes-generated.json";
const recipes = [];
fs.readdirSync(recipesDirectory, { withFileTypes: true }).forEach((file) => {
	// console.log(file);

	// check to make sure it's not a directory reference
	if (file.isFile()) {
		// it's a file
		const filePath = recipesDirectory + file.name;
		const recipe = fs.readFileSync(filePath);
		recipes.push(JSON.parse(recipe));
	}
});

console.log(recipes);

fs.writeFileSync(recipesPath, JSON.stringify(recipes, null, 4));
