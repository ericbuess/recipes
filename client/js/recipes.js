$.getJSON("../data/recipes-generated.json", function (recipes) {
	// TODO: add https://www.becomingfullyhuman.ca/breakfast/2020/5/26/sweet-potato-ginger-cacao-smoothie
	console.log(recipes);
	var recipeDOMTemplate = $("#recipe-template").clone().removeAttr("id");
	var recipesContainer = $("#recipes-container");
	recipesContainer.empty();
	recipeDOMTemplate.show();

	recipes.forEach(addRecipeToDOM);

	$("#recipes-container input[type='checkbox']").click(function () {
		$(this).parent().find("label").toggleClass("item-checked");
		//            $("#item-" + req).toggleClass("item-select");
	});

	// function plural(ingredient) {
	//     if (ingredient["quantity"] != 1) {
	//         if (ingredient.hasOwnProperty("unit") && ingredient["unit"] != "") {
	//             ingredient["unit"] = ingredient["unit"] + "s";
	//         } else {
	//             ingredient["name"] = ingredient["name"] + "s";
	//         }
	//     }
	//     return ingredient;
	// }

	function addRecipeToDOM(recipe, index) {
		var recipeDOM = recipeDOMTemplate.clone();
		var recipeID = recipe.id;
		var title = recipe.title;
		var imageURL = recipe.imageURL;
		var tags = recipe.tags;
		var tagsString = "";
		var time = recipe.time;
		var totalTime = time.ingredients + time.preparation + time.instruction;
		var calories = recipe.nutrition.calories;
		var fat = recipe.nutrition.fat;
		var protein = recipe.nutrition.protein;
		var carbs = recipe.nutrition.carbs;
		var ingredients = recipe.ingredients;
		var preparations = recipe.preparations;
		var instructions = recipe.instructions;

		tags.forEach(function (tag, index) {
			if (index > 0) {
				tagsString += ", ";
			}
			tagsString = tagsString + tag;
		});

		recipeDOM.attr("id", recipeID);
		recipeDOM.find(".imageURL").attr("src", imageURL);
		recipeDOM.find(".recipe-title").html(title);
		recipeDOM.find(".recipe-tags").html(tagsString);
		recipeDOM
			.find(".recipe-total-time")
			.html("&asymp; " + totalTime + " minutes");
		recipeDOM
			.find(".recipe-nutrition")
			.html(
				calories +
					" calories (carbs: " +
					carbs +
					" g, fat: " +
					fat +
					" g, protein: " +
					protein +
					" g)"
			);
		recipeDOM
			.find(".ingredients-time")
			.html("&asymp; " + time.ingredients + " minutes");
		recipeDOM
			.find(".preparation-time")
			.html("&asymp; " + time.preparation + " minutes");
		recipeDOM
			.find(".instruction-time")
			.html("&asymp; " + time.instruction + " minutes");

		var ingredientDOMTemplate = recipeDOM
			.find("#ingredient-item-template")
			.removeAttr("id");
		var ingredientListDOM = recipeDOM.find(".ingredient-list").first();
		ingredients.forEach(function (ingredient, index) {
			// check if the property/key is defined in the object itself, not in parent
			// if (ingredients.hasOwnProperty(key)) {
			// console.log(ingredient);
			// ingredientsHTML += key + ": " + ingredients[key] + "<br>";
			// ingredient = plural(ingredient);
			var ingredientDOM = ingredientDOMTemplate.clone();
			var checkboxID = recipeID + "-" + "ingredient" + "-" + index;
			ingredientDOM.find("input").attr("id", checkboxID);
			ingredientDOM.find("input").attr("name", checkboxID);
			ingredientDOM.find("label").attr("for", checkboxID);
			ingredientDOM.find(".ingredient-name").html(ingredient["name"]);
			if (ingredient.hasOwnProperty("quantity")) {
				ingredientDOM.find(".ingredient-quantity").html(ingredient["quantity"]);
			} else {
				ingredientDOM.find(".ingredient-quantity").remove();
			}
			if (ingredient.hasOwnProperty("unit")) {
				ingredientDOM.find(".ingredient-unit").html(" " + ingredient["unit"]);
			} else {
				ingredientDOM.find(".ingredient-unit").remove();
			}
			ingredientListDOM.append(ingredientDOM);
		});
		ingredientDOMTemplate.remove();

		if (typeof preparations !== "undefined") {
			var preparationDOMTemplate = recipeDOM
				.find("#preparation-item-template")
				.removeAttr("id");
			var preparationListDOM = recipeDOM.find(".preparation-list").first();
			preparations.forEach(function (preparation, index) {
				var preparationDOM = preparationDOMTemplate.clone();
				var checkboxID = recipeID + "-" + "preparation" + "-" + index;
				preparationDOM.find("input").attr("id", checkboxID);
				preparationDOM.find("input").attr("name", checkboxID);
				preparationDOM.find("label").attr("for", checkboxID).html(preparation);
				preparationListDOM.append(preparationDOM);
			});
			preparationDOMTemplate.remove();
		} else {
			recipeDOM.find(".preparation-container").remove();
		}

		var instructionDOMTemplate = recipeDOM
			.find("#instruction-item-template")
			.removeAttr("id");
		var instructionListDOM = recipeDOM.find(".instruction-list").first();
		instructions.forEach(function (instruction, index) {
			var instructionDOM = instructionDOMTemplate.clone();
			var checkboxID = recipeID + "-" + "instruction" + "-" + index;
			instructionDOM.find("input").attr("id", checkboxID);
			instructionDOM.find("input").attr("name", checkboxID);
			instructionDOM.find("label").attr("for", checkboxID).html(instruction);
			instructionListDOM.append(instructionDOM);
		});
		instructionDOMTemplate.remove();

		recipesContainer.append(recipeDOM);

		// var ingredientsHTML = "";
		/*
        for (var key in ingredients) {
            // check if the property/key is defined in the object itself, not in parent
            if (ingredients.hasOwnProperty(key)) {
                // console.log(key, ingredients[key]);
                ingredientsHTML += key + ": " + ingredients[key] + "<br>";
            }
        }
        */

		// console.log(recipe.ingredients.keys);
	}
});
