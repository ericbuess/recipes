"use strict";
// Library imports
const dotenv = require("dotenv");
const fs = require("fs");
var request = require("request");

// Environment variables
const env = dotenv.config();
if (env.error) {
	throw env.error;
}
const { parsed: envs } = env;
console.log(envs);
// module.exports = envs;

// Filesystem operations
const recipesDirectory = "../client/data/recipes/";

fs.readdirSync(recipesDirectory, { withFileTypes: true }).forEach((file) => {
	// console.log(file);

	// check to make sure it's not a directory reference
	if (file.isFile()) {
		// it's a file

		handleFile(
			recipesDirectory + file.name,
			recipesDirectory + "previous/" + file.name
		);
	}
});

function handleNutrients(filePath, nutrients) {
	console.log(filePath + "...\n" + JSON.stringify(nutrients));
	// let totalNutrients = nutrients.totalNutrients;
	// let calories = Math.round(totalNutrients.ENERC_KCAL.quantity / 1000) + " calories"; //+ totalNutrients.ENERC_KCAL.unit;
	// let fat = Math.round(totalNutrients.FAT.quantity) + " " + totalNutrients.FAT.unit;
	// let protein = Math.round(totalNutrients.PROCNT.quantity) + " " + totalNutrients.PROCNT.unit;
	// let carbs = Math.round(totalNutrients.CHOCDF.quantity) + " " + totalNutrients.CHOCDF.unit;

	let calories = nutrients.calories;

	// let totalNutrientsKCal = nutrients.totalNutrientsKCal;
	// let protein = Math.round(totalNutrientsKCal.PROCNT_KCAL.quantity);
	// let fat = Math.round(totalNutrientsKCal.FAT_KCAL.quantity);
	// let carbs = Math.round(totalNutrientsKCal.CHOCDF_KCAL.quantity);

	let totalNutrients = nutrients.totalNutrients;
	let protein = Math.round(totalNutrients.PROCNT.quantity);
	let fat = Math.round(totalNutrients.FAT.quantity);
	let carbs = Math.round(totalNutrients.CHOCDF.quantity);

	console.log(
		"total: " +
			calories +
			"\nfat: " +
			fat +
			"\nprotein: " +
			protein +
			"\ncarbs: " +
			carbs
	);

	// Write this to filePath
	const data = JSON.parse(fs.readFileSync(filePath));
	const nutrition = {
		calories: calories,
		fat: fat,
		protein: protein,
		carbs: carbs,
	};
	data.nutrition = nutrition;
	fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

function handleFile(filePath, previousPath) {
	const data = fs.readFileSync(filePath);
	let json = JSON.parse(data);

	var recipe = {
		title: "",
		yield: "",
		ingr: [],
	};

	recipe.title = json.title;
	recipe.yield = json.yield;
	json.ingredients.forEach(function (ingredient) {
		if (
			ingredient.hasOwnProperty("includeInMacros") &&
			ingredient.includeInMacros == false
		) {
			return; // skip this iteration of the loop
		}
		var ingr = "";
		if (ingredient.hasOwnProperty("quantity")) {
			ingr = ingredient.quantity;
		}
		if (ingredient.hasOwnProperty("unit")) {
			if (ingr.length > 0) {
				ingr += " ";
			}
			ingr += ingredient.unit;
		}
		if (ingredient.hasOwnProperty("name")) {
			if (ingr.length > 0) {
				ingr += " ";
			}
			ingr += ingredient.name;
		}
		recipe.ingr.push(ingr);
	});
	console.log("recipe: " + JSON.stringify(recipe));

	// recipe the last time the API was called
	if (fs.existsSync(previousPath)) {
		// the recipe file exists

		const previousJSON = JSON.stringify(
			JSON.parse(fs.readFileSync(previousPath))
		);
		const recipeString = JSON.stringify(recipe);
		// let previousJson = JSON.parse(data);
		if (previousJSON != recipeString) {
			// the recipe file exists but it was changed since the last time the API was called so call the API again
			callAPI(filePath, previousPath, recipe);
		}
	} else {
		// the recipe file does not exist so call callAPI which will create it
		callAPI(filePath, previousPath, recipe);
	}
}

// Recipe API
function callAPI(filePath, previousPath, recipe) {
	var headers = {
		"Content-Type": "application/json",
	};

	var dataString = JSON.stringify(recipe);

	// store recipe in a file so we can compare next time to see if the recipe has changed
	fs.writeFileSync(previousPath, JSON.stringify(recipe, null, 4));

	var options = {
		url: envs.API_URL + "?app_id=" + envs.API_ID + "&app_key=" + envs.API_KEY,
		method: "POST",
		headers: headers,
		body: dataString,
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			handleNutrients(filePath, JSON.parse(body));
		}
	}

	// Make the API request
	request(options, callback);
}

// Use test file
// fs.readFile('test.json', (err, data) => { // test.json
//     if (err) throw err;
//     handleNutrients(JSON.parse(data));
// });
