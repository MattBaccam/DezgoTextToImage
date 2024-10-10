import {createAlert} from './createAlert.js'
// Get request to the dezgo info endpoint
// Used to get DEZGO AI MODELS with text2image capabilities.
export async function getAiImageModels(){
    const documentModel = document.getElementById('model');
    try {
        const response = await axios.get(`https://api.dezgo.com/info`);
        const filteredModels = response.data.models
        .filter(model => model.functions.includes('text2image'))
        .forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            documentModel.appendChild(option);
        });;
    } catch (error) {
        const defaultModel = document.createElement('option');
        defaultModel.value = 'realdream_12';
        defaultModel.textContent = 'realdream_12';
        documentModel.appendChild(defaultModel);
        createAlert('modelFetchError', 'alert-danger', `Error gathering models. Defaulting to realdream_12`);
    }
}