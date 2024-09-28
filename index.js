'use strict';

const cakeRecipes = require("./cake-recipes.json");
const prompt = require('prompt-sync')();

let savedRecipes = []; 

//  alle recepten te loggen
function logRecipeNames(recipes) {
  if (!recipes || recipes.length === 0) {
    console.log('No recipes found.');
  } else {
    recipes.forEach(recipe => console.log(`Recipe name: ${recipe.Name}`));
  }
}

//  recepten te filteren op basis van auteur
function getRecipesByAuthor(recipes, author) {
  const filteredRecipes = recipes.filter(recipe => recipe.Author.toLowerCase() === author.toLowerCase());
  if (filteredRecipes.length === 0) {
    console.log(`No recipes found for: ${author}`);
  } else {
    console.log(`\nRecipes from: ${author}:`);
    filteredRecipes.forEach(recipe => console.log(`- ${recipe.Name}`));
  }
  return filteredRecipes;
}

//  recepten te filteren op basis van ingrediënt
function getRecipesByIngredient(recipes, ingredient) {
  return recipes.filter(recipe =>
    recipe.Ingredients.some(ing => ing.toLowerCase() === ingredient.toLowerCase())
  );
}

//  specifiek recept  op basis van de naam
function getRecipeByName(recipes, name) {
  const recipe = recipes.find(recipe => recipe.Name.toLowerCase().includes(name.toLowerCase()));

  if (!recipe) {
    console.log(`Geen recept gevonden met de naam: ${name}`);
  } else {
    console.log(`Gevonden recept: ${recipe.Name}`);
    console.log(`Auteur: ${recipe.Author}`);
    console.log(`Ingrediënten: ${recipe.Ingredients.join(', ')}`);
    
    // Vraag om opslaan recept
    const saveRecipe = prompt('Would you like to save this recipe? (yes/no): ').toLowerCase();
    if (saveRecipe === 'yes') {
      savedRecipes.push(recipe);
      console.log(`Recipe '${recipe.Name}' saved!`);
    }
  }

  return recipe;
}

//  lijst van recepten op te halen
function getAllIngredients(recipes) {
  return recipes.reduce((allIngredients, recipe) => {
    return allIngredients.concat(recipe.Ingredients);
  }, []); 
}

// Menu 
const displayMenu = () => {
  console.log("\nRecipe Management System Menu:");
  console.log("1. Show All Authors");
  console.log("2. Show Recipe names by Author");
  console.log("3. Show Recipe names by Ingredient");
  console.log("4. Get Recipe by Name");
  console.log("5. Get All Ingredients of Saved Recipes");
  console.log("0. Exit");
  const choice = prompt("Enter a number (1-5) or 0 to exit: ");
  return parseInt(choice);
}

let choice;

do {
  choice = displayMenu();

  switch (choice) {
    case 1:
      // Toon alle auteurs
      const authors = [...new Set(cakeRecipes.map(recipe => recipe.Author))];
      authors.forEach(author => console.log(`Author: ${author}`));
      break;
    case 2:
      // Recepten op basis van auteur tonen
      const authorName = prompt('Enter the name of the author: ');
      getRecipesByAuthor(cakeRecipes, authorName);
      break;
    case 3:
      // Recepten op basis van ingrediënt tonen
      const ingredient = prompt('Enter an ingredient: ');
      const recipesWithIngredient = getRecipesByIngredient(cakeRecipes, ingredient);
      
      if (recipesWithIngredient.length === 0) {
        console.log(`No recipes found with the ingredient: ${ingredient}`);
      } else {
        console.log(`Recipes with the ingredient '${ingredient}':`);
        recipesWithIngredient.forEach(recipe => console.log(`- ${recipe.Name}`));
      }
      break;
    case 4:
      // Specifiek recept op naam vinden
      const recipeName = prompt('Enter the name of the recipe: ');
      getRecipeByName(cakeRecipes, recipeName);
      break;
    case 5:
      // Alle ingrediënten van opgeslagen recepten weergeven
      if (savedRecipes.length === 0) {
        console.log("No saved recipes available.");
      } else {
        const allIngredients = getAllIngredients(savedRecipes);
        console.log("All ingredients from saved recipes:");
        console.log(allIngredients.join(', '));
      }
      break;
    case 0:
      console.log("Exiting...");
      break;
    default:
      console.log("Invalid input. Please enter a number between 0 and 5.");
  }
} while (choice !== 0);
