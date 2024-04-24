//Boucle de la méthode Map & forEach
let data = {},
  li,
  matchingRecipes,
  filteredRecipes;
let allIngredients = [],
  allAppliances = [],
  allUtensils = [],
  array = [],
  deviceList,
  searchInput,
  searchTerm,
  searchBool = false,
  selectedLabels = [];
let tagTab = [];
let totalPillsCreated = 0;
let matchingRecipe;
const dropdown_ingredient = document.getElementById("dropdown_ingredient");
const dropdown_app = document.getElementById("dropdown_app");
const dropdown_device = document.getElementById("dropdown_device");

/**
 * Remove the duplicates in the list
 * @param {*} arr
 * @returns
 */
const removeDuplicate = (arr) => {
  return [...new Set(arr)];
};

/**
 * Display all cards
 */
const displayCards = () => {
  displayRecipe().then((card) => {
    cards.innerHTML = card;
  });
};
/**
 * Extract the elements ingredients, appliances and utensils
 */
const extractElements = async () => {
  const tabTab = await tagTab;
  allIngredients = [];
  allAppliances = [];
  allUtensils = [];

  if (totalPillsCreated > 0) {
    matchingRecipe = tabTab[0];
  } else {
    matchingRecipe = matchingRecipes ? matchingRecipes : await data.recipes;
  }

  matchingRecipe &&
    matchingRecipe.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const { ingredient: name } = ingredient;
        allIngredients.push(name);
      });
      const { appliance } = recipe;
      allAppliances.push(appliance);

      recipe.ustensils.forEach((utensil) => {
        allUtensils.push(utensil);
      });
    });

  applyFilters();
  click_Element_In_The_Dropdown("dropdown_device", "ustensil");
  click_Element_In_The_Dropdown("dropdown_ingredient", "ingredient");
  click_Element_In_The_Dropdown("dropdown_app", "appliance");
};

/**
 * Search the recipes in the search bar
 */
form_search_recipe.addEventListener("submit", (e) => {
  e.preventDefault();
  searchTerm = searchRecipe.value.trim().toLowerCase();

  // Vérifier si le terme de recherche contient des balises HTML
  if (containsHTML(searchTerm)) {
    deleteSearch.classList.add("flex");
    deleteSearch.classList.remove("hidden");

    displayErrorMessage("La recherche ne doit pas contenir de code HTML.");
    return;
  }

  if (searchTerm.length >= 3) {
    deleteSearch.classList.add("flex");
    deleteSearch.classList.remove("hidden");
    searchBool = true;

    matchingRecipes = data.recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(searchTerm)
        ) ||
        recipe.ustensils.some((ustensil) =>
          ustensil.toLowerCase().includes(searchTerm)
        ) ||
        recipe.appliance.toLowerCase().includes(searchTerm)
      );
    });

    if (matchingRecipes.length > 0) {
      extractElements();
    } else {
      cards.innerHTML =
        "<p class='text-black mb-12'>Aucune recette trouvée.</p>";
      quantity.innerHTML = "0 recette";
    }
  } else if (searchTerm.length === 0) {
    displayCards();
  } else {
    console.log("La recherche doit contenir au moins 3 lettres.");
  }
});

// Fonction pour vérifier si une chaîne contient des balises HTML
const containsHTML = (str) => {
  const htmlPattern = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
  return htmlPattern.test(str);
};

// Fonction pour afficher un message d'erreur
const displayErrorMessage = (message) => {
  // Remplacez ceci par votre propre logique pour afficher le message d'erreur à l'utilisateur
  alert(message);
};

/**
 * Sort the elements in the dropdown (A-Z)
 * @param {*} data
 * @param {*} searchTerm
 * @returns
 */
const sortData = (data, searchTerm) => {
  return data.filter((item) => item.toLowerCase().includes(searchTerm)).sort();
};
/**
 * Put the element in the each dropdown
 */
const dataRecipe = async (dataType, searchTerm) => {
  try {
    const response = await fetch("api/recipes.json");
    // const data = !ingredientAlreadySelected ? await response.json() : tagTab[0];
    const data = await response.json();
    let array = [];
    let sortedData = [];
    if (dataType === "ingredients") {
      data.recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          array.push(ingredient.ingredient.toLowerCase());
        });
      });
      sortedData = sortData(array, searchTerm);
    } else if (dataType === "appliance") {
      data.recipes.forEach((recipe) => {
        array.push(recipe.appliance);
      });
      sortedData = sortData(array, searchTerm);
    } else if (dataType === "ustensils") {
      data.recipes.forEach((recipe) => {
        recipe.ustensils.forEach((ustensil) => {
          array.push(ustensil.toLowerCase());
        });
      });
      sortedData = sortData(array, searchTerm);
    } else {
      console.error("Type de données non pris en charge.");
    }
    //Delete the duplicates in the lists
    return removeDuplicate(sortedData);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des données:",
      error
    );
    return [];
  }
};
/**
 * Delete the search bar
 */
deleteSearch.addEventListener("click", () => location.reload());
//Display the dropdown, with the arrows of all the elements
const dropdowns = [
  {
    arrow: arrow_up,
    id: "dropdown_ingredient",
    search: "dropdown_ingredient",
    item1: "search_ingredient",
    item2: "Rechercher un ingrédient...",
    item3: "ingredients",
  },
  {
    arrow: arrow_up_zero,
    id: "dropdown_app",
    search: "dropdown_app",
    item1: "search_app",
    item2: "Rechercher un appareil...",
    item3: "appliance",
  },
  {
    arrow: arrow_up_deux,
    id: "dropdown_device",
    search: "dropdown_device",
    item1: "search_ingredient",
    item2: "Rechercher un ustensile...",
    item3: "ustensils",
  },
];
/**
 * Close all the dropdowns
 */
const closeAllDropdowns = () => {
  dropdowns.forEach((dropdown) => {
    const dropdownIngredient = document.getElementById(dropdown.id);
    dropdownIngredient.innerHTML = "";
    dropdown.arrow.setAttribute("src", "./assets/img/arrow-down.webp");
  });
};
/**
 *
 * @param {*} arrow
 * @param {*} id
 * @param {*} search
 * @param {*} item1
 * @param {*} item2
 * @param {*} item3
 */
const arrow_dropDown = (arrow, id, search, item1, item2, item3) => {
  const dropdownIngredient = document.getElementById(id);

  const closeDropdown = () => {
    dropdownIngredient.innerHTML = "";
    arrow.setAttribute("src", "./assets/img/arrow-down.webp");
  };

  arrow.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (!dropdownIngredient.classList.contains("open")) {
      closeAllDropdowns();
      await new Promise((resolve) => setTimeout(resolve, 0));
      dropDownElement(search, item1, item2, item3);
      dropdownIngredient.classList.add("open");
      arrow.setAttribute("src", "./assets/img/arrow-up.webp");
      dropdownIngredient.style.display = "block";
      dropdownIngredient.style.backgroundColor = "#fff";
    } else {
      closeDropdown();
      dropdownIngredient.classList.remove("open");
    }
  });

  window.addEventListener("click", (event) => {
    if (
      dropdownIngredient.classList.contains("open") &&
      !dropdownIngredient.contains(event.target)
    ) {
      closeDropdown();
      dropdownIngredient.classList.remove("open");
    }
  });
};

dropdowns.forEach(({ arrow, id, search, item1, item2, item3 }) => {
  arrow_dropDown(arrow, id, search, item1, item2, item3);
});

/**
 * Create a design a dropdown for each element
 * @param {*} id
 * @param {*} id_search
 * @param {*} search
 * @param {*} dataType
 */
const dropDownElement = async (id, id_search, search, dataType) => {
  const searchTerm = searchRecipe.value.trim().toLowerCase(); //Delete the spaces and putting the string in lowercase in the function search bar
  const sortedData = await dataRecipe(dataType, searchTerm);
  const uniqueRecipe = await removeDuplicate(sortedData);

  const dropDown = document.getElementById(id);
  dropDown.innerHTML = "";
  searchInput = document.createElement("input");
  searchInput.setAttribute("type", "search");
  searchInput.classList.add(
    "border",
    "mb-1",
    "flex",
    "h-9",
    "justify-center",
    "mx-auto",
    "rounded-xs",
    "focus:outline-none",
    "font-['Manrope','sans-serif']",
    "relative"
  );
  searchInput.id = id_search;

  const listItems = document.querySelectorAll(
    ".flex.xl\\:justify-between.lg\\:flex-row.flex-col > ul > li"
  );
  listItems.forEach((item) => {
    item.classList.add("relative", "overscroll", "h-12", "z-50", "rounded-md");
  });
  searchInput.placeholder = search;
  dropDown.appendChild(searchInput);

  deviceList = document.createElement("ul");
  deviceList.setAttribute("role", "listbox");
  deviceList.classList.add(
    "overflow-y-auto",
    "scrollbar-hide",
    "w-[12.7rem]",
    "overflow-hidden",
    "max-h-40",
    "h-40"
  );

  if (tagTab.length > 0) {
    globalElement(dataType, deviceList, searchInput);
  } else if (tagTab.length === 0) {
    populateDropdown(uniqueRecipe, deviceList, searchInput);
  }
  dropDown.appendChild(deviceList);
};

let originalDropdownList = [];

const populateDropdown = (uniqueRecipe, deviceList, searchInput) => {
  originalDropdownList = uniqueRecipe.slice();

  updateDropdown(deviceList, originalDropdownList);
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();

    if (searchTerm === "") {
      updateDropdown(deviceList, originalDropdownList);
    } else {
      const filteredList = originalDropdownList.filter((item) =>
        item.toLowerCase().includes(searchTerm)
      );
      if (containsHTML(searchTerm)) {
        displayErrorMessage("La recherche ne doit pas contenir de code HTML.");
        return;
      }

      filterElement(searchTerm, uniqueRecipe, deviceList);
      updateDropdown(deviceList, filteredList);
    }
  });
};

/**
 * Create the design of the dropdown
 * @param {*} deviceList
 * @param {*} list
 */
const updateDropdown = (deviceList, list) => {
  list.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = item;
    li.classList.add(
      "hover:bg-[#FFD15B]",
      "flex",
      "justify-between",
      "cursor-pointer",
      "py-[0.6rem]",
      "px-2",
      "font-['Manrope','sans-serif']"
    );
    li.setAttribute("role", "option");
    deviceList.appendChild(li);
  });
};
/**
 * Create element for the dropdown
 * @param {*} dataType
 * @param {*} deviceList
 */
const globalElement = (dataType, deviceList) => {
  switch (dataType) {
    case "ingredients":
      populateDropdown(
        removeDuplicate(allIngredients),
        deviceList,
        searchInput
      );
      break;
    case "appliance":
      populateDropdown(removeDuplicate(allAppliances), deviceList, searchInput);

      break;
    case "ustensils":
      populateDropdown(removeDuplicate(allUtensils), deviceList, searchInput);

      break;
    default:
      console.error("Type de données non pris en charge.");
  }
  extractElements();
};

/**
 * Filter the element in the dropdown
 * @param {*} search
 * @param {*} limited
 * @param {*} list
 */
const filterElement = (search, limited, list) => {
  list.innerHTML = "";
  limited.forEach((item) => {
    if (item.toLowerCase().startsWith(search)) {
      const li = document.createElement("li");
      list.appendChild(li);
    }
  });
};

/**
 * Fonction pour filtrer les recettes en fonction des étiquettes sélectionnées
 * @returns
 */
const filterRecipes = () => {
  const recipesToFilter = searchBool ? matchingRecipes : data.recipes;

  let filteredRecipes = recipesToFilter.filter((recipe) => {
    return selectedLabels.every((label) => {
      return (
        recipe.ingredients.some(
          (ingredientObj) =>
            ingredientObj.ingredient.toLowerCase() === label.toLowerCase()
        ) ||
        recipe.appliance.toLowerCase() === label.toLowerCase() ||
        recipe.ustensils.some((u) => u.toLowerCase() === label.toLowerCase())
      );
    });
  });

  tagTab = [filteredRecipes];
  return filteredRecipes;
};

// Fonction pour appliquer tous les filtres sélectionnés
const applyFilters = () => {
  filteredRecipes = filterRecipes();
  updateRecipeList(filteredRecipes);
};

let ingredientAlreadySelected = false;
// delete  element in the dropdown
const click_Element_In_The_Dropdown = (id, type) => {
  const dropdown = document.getElementById(id);
  dropdown.addEventListener("click", async (event) => {
    if (event.target.tagName === "LI") {
      const selected = event.target.textContent.trim().toLowerCase();
      const existingPills = document.querySelectorAll(".delete-pill");

      existingPills.forEach((pill) => {
        if (pill.textContent.trim().toLowerCase() === selected) {
          ingredientAlreadySelected = true;
        } else {
          pill.classList.remove("selected");
        }
      });

      if (!ingredientAlreadySelected) {
        if (type === "ingredient") {
          selectedLabels.push(selected);
        } else if (type === "appliance") {
          selectedLabels.push(selected);
        } else if (type === "ustensil") {
          selectedLabels.push(selected);
        }

        applyFilters();
        closeAllDropdowns();

        createAndAddPill(selected);
      }

      extractElements();
    }
  });
};

click_Element_In_The_Dropdown("dropdown_device", "ustensil");
click_Element_In_The_Dropdown("dropdown_ingredient", "ingredient");
click_Element_In_The_Dropdown("dropdown_app", "appliance");

let deleteMyPill = false,
  existingPills;
// Fonction pour créer et ajouter une pastille
const createAndAddPill = async (ingredient) => {
  const pastillsContainer = document.getElementById("pastills");
  existingPills = pastillsContainer.querySelectorAll("li");
  const isAlreadyAdded = [...existingPills].some((pill) => {
    return pill.textContent.trim().toLowerCase() === ingredient.toLowerCase();
  });

  let pill = document.createElement("li");
  if (!isAlreadyAdded) {
    pill.classList.add("bg-[#FFD15B]", "px-2", "rounded-md");
    pill.innerHTML = `
    <div class="text-black px-4 lg:space-x-8 py-2 rounded-md flex justify-around items-center hover:font-bold">
    <p>${ingredient}</p>
    <img src="./assets/img/cross.png" alt="cross" class="w-3 h-3 cursor-pointer delete-pill">
    </div>`;
    pastillsContainer.appendChild(pill);
    totalPillsCreated++;

    const deleteButton = pill.querySelector(".delete-pill");
    pill.addEventListener("mouseenter", () => {
      deleteButton.src = "./assets/img/round-cross.png";
    });
    pill.addEventListener("mouseleave", () => {
      deleteButton.src = "./assets/img/cross.png";
    });
    pill.addEventListener("click", () => {
      deleteMyPill = true;
      totalPillsCreated--;
      pill.remove();
      removeFilter(ingredient);
      extractElements();
      applyFilters();
    });
  } else {
    console.log("L'ingrédient est déjà ajouté.");
    applyFilters();
  }
};

// Fonction pour supprimer le filtre d'ingrédient
const removeFilter = (dropdownElement) => {
  if (deleteMyPill) {
    selectedLabels = selectedLabels.filter(
      (label) => label !== dropdownElement
    );
  } else {
    console.log("L'élément avec l'ID 'search_ingredient' n'existe pas.");
  }
};

// Mettre à jour la liste des cartes avec les recettes filtrées
const updateRecipeList = (recipes) => {
  if (recipes && recipes.length > 0) {
    let matchingCards = recipes.map((recipe) => card(recipe)).join("");
    cards.innerHTML = matchingCards;
    quantity.innerHTML =
      recipes.length + (recipes.length > 1 ? " recettes" : " recette");
  } else {
    cards.innerHTML =
      "<p class='text-black'>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>";
    quantity.innerHTML = "0 recette";
    section_cards.classList.add("h-screen");
  }
};

/**
 * Create the card for each recipe
 * @param {*} recipe
 * @returns
 */
const card = (recipe) => {
  return ` <li class="card flex-6 font-['Manrope','sans-serif']">
        <div class="h-full max-w-sm overflow-hidden shadow-lg bg-white pb-6 rounded-xl">
       <div class="flex justify-end mr-5">
        <div class="text-black text-xs absolute z-40 rounded-xl bg-[#FFD15B] px-2 py-1 mt-3 ">${
          recipe.time
        }min</div></div>
          <img class="relative w-full bg-auto bg-center object-cover h-64  z-10" src="./assets/Recette${
            recipe.id
          }.webp" alt="${recipe.name}">
          <div class="px-6 py-4 text-black ">
            <div class="font-bold font-['Anton'] text-2xl mb-2">${
              recipe.name
            }</div>
            <p class="text-xs text-gray-500 py-4">RECETTE</p>
            <p class="text-gray-700 text-md overflow-y-auto scrollbar-hide h-12 my-6">${
              recipe.description
            }</p>
        
            <p class="text-md text-gray-500 font-bold py-4">INGRÉDIENTS</p>
            <ul class="ingredients-card grid grid-cols-2">
              ${recipe.ingredients
                .map((ingredient) => {
                  return `
                <li class="my-2">
             
                  <p class="">${ingredient.ingredient} </p>
                  <p class="text-gray-500 ">${
                    ingredient.quantity
                      ? ingredient.quantity +
                        " " +
                        (ingredient.unit ? ingredient.unit : "")
                      : ingredient.ingredient
                  }</p>
                </li>
              `;
                })
                .join("")}
            </ul>
          </div>
        </div>
      </li>`;
};

/**
 * Display of all the recipes
 * @returns
 */
const displayRecipe = async () => {
  try {
    const response = await fetch("api/recipes.json");
    data = await response.json();
    quantity.innerHTML = data.recipes.length + " recettes";
    const recipesList = data.recipes
      .map((recipe) => {
        return card(recipe);
      })
      .join("");
    return `${recipesList}`;
  } catch (error) {
    console.error(error);
    return "Erreur lors de la récupération des recettes.";
  }
};

displayCards();
