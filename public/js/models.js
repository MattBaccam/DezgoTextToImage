import {getAiImageModels} from "./dezgoAiModels.js";
import {createDezgoError} from "./createDezgoRequestError.js";
import {createAlert} from "./createAlert.js";

const modelList = [];

let fuse;
const fuseOptions = {
	isCaseSensitive: false,
	includeScore: true,
	shouldSort: true,
	includeMatches: false,
    keys: [
        "name",
        "description",
        "triggers",
        "categories",
        "nativeResolution.width",
        "nativeResolution.height"
    ]
};




//This sets up the page for us after its fully loaded (including external resources)
window.addEventListener("load", function() {
    getAiImageModels()
    .then(models => {
        modelList.push(... models);
        fuse = new Fuse(models, fuseOptions)
        createModelCards(models);
    })
    .catch(error =>{
        const dezgoError = createDezgoError(error);
        createAlert('modelFetchError', 'alert-danger', `${dezgoError.customMessage}`);
    });
});

//Search bar functionality
document.getElementById('search').addEventListener("input", (function() {
    let debounceTimer;

    return function(e) {
        clearTimeout(debounceTimer); 
        debounceTimer = setTimeout(() => {
            clearContainer();
            const searchTerm = e.target.value;
            if (searchTerm === null || searchTerm === undefined || searchTerm.trim() === '') {
                createModelCards(modelList);
                return; 
            }
            const searchResults = fuse.search(searchTerm).map(result => ({
                name: result.item.name,
                description: result.item.description,
                triggers: result.item.triggers,
                categories: result.item.categories,
                nativeResolution: result.item.nativeResolution
              }));
            !searchResults || searchResults.length !== 0 ? createModelCards(searchResults) : createAlert('noSearchResults', 'alert-danger', 'No results could be found.');
        }, 300);
    };
})());

//Creates the cards for the models
function createModelCards(models){
    if (!Array.isArray(models) || models === null || models.length === 0) {
        createAlert('invalidInputParameters', 'alert-danger', 'Invalid models parameter: it is either null, empty, or not an array.');
        return;
    }

    models.forEach(model => {
            const card = document.createElement('div');
            card.classList.add('card');

            const cardBody = document.createElement('card-body');
            cardBody.classList.add('card-body');
            card.appendChild(cardBody);

            const cardTitle = document.createElement('h3');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = model.name;
            cardBody.appendChild(cardTitle);

            const cardText = document.createElement('p');
            cardText.classList.add('card-text');
            cardText.innerHTML = `${model.description}<br> ${model.triggers ? 'Trigger(s): ' + model.triggers.join(',') : 'Trigger(s): No triggers.'} ${model.categories ?'<br> Categorie(s): ' + model.categories.join(',') : 'Categorie(s): No categories.'} <br> Native Resolution: ${model.nativeResolution.width}X${model.nativeResolution.height}`; 
            cardBody.appendChild(cardText);

            document.getElementById('mainContainer').appendChild(card);
    });
}

//Clears for search
function clearContainer(){
    document.getElementById('mainContainer').innerHTML = '';
}