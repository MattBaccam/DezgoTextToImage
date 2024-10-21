import {createDezgoError} from './createDezgoRequestError.js'
// Get request to the dezgo info endpoint
// Used to get DEZGO AI MODELS with text2image capabilities.
export async function getAiImageModels(){
    try {
        const response = await axios.get(`https://api.dezgo.com/info`);
        const filteredModels = response.data.models.filter(model => model.functions.includes('text2image'));
        return filteredModels;
    } catch (error) {
        throw createDezgoError(error);
    }
}