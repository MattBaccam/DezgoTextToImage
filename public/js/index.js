import {createAlert} from "./createAlert.js";
import {addLoadingToButton, removeLoadingFromButton} from "./buttonLoading.js";
import {getAiImageModels} from "./dezgoAiModels.js";
import {createDezgoError} from "./createDezgoRequestError.js";

//This is going to setup the stuff that can be setup after dom has been loaded
document.addEventListener("DOMContentLoaded", function() {
    //Getting the sliders values & sliders labels
    var guidance = document.getElementById("guidance"); 
    var guidance_label_span = document.querySelector("#guidance_label span"); 
    var steps = document.getElementById("steps"); 
    var steps_label_span = document.querySelector("#steps_label span"); 


    guidance_label_span.textContent = `Guidance (-20 -> 20): ${guidance.value}`;
    steps_label_span.textContent = `Steps (10 -> 150): ${steps.value}`;

    // Once changed, the designated label will be updated
    guidance.addEventListener("input", function() {
        guidance_label_span.textContent = `Guidance (-20 -> 20): ${this.value}`;
    }); 

    steps.addEventListener("input", function() {
        steps_label_span.textContent = `Steps (10 -> 150): ${this.value}`;
    });
});

//This sets up the page for us after its fully loaded (including external resources)
window.addEventListener("load", function() {
    var typed = new Typed('h1', {
        strings: ['Ai', 'AI', 'AI Image Generator'],
        typeSpeed: 60,
        smartBackspace: true,
    });

    const generateButton = document.getElementById("generateButton");
    generateButton.disabled = true;

    addLoadingToButton('modelLabel');

    getAiImageModels()
    .then(models => {
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            select.appendChild(option);
        })
    })
    .catch(error =>{
        const dezgoError = createDezgoError(error);
        const defaultModel = document.createElement('option');
        defaultModel.value = 'realdream_12';
        defaultModel.textContent = 'realdream_12';
        select.appendChild(defaultModel);
        createAlert('modelFetchError', 'alert-danger', `${dezgoError.customMessage}. Defaulting to realdream_12.`);
    })
    .finally(() => {
        removeLoadingFromButton('modelLabel');
        generateButton.disabled = false;
    });

    const select = document.createElement('select');
    select.setAttribute("id", "model");
    select.setAttribute('name', 'model');
    select.classList.add('w-75');
    document.getElementById('modelLabel').appendChild(select);
    
    //Activating tooltips in for bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='tooltip']"))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

//Handles the users form submission
//Allows us to update the image asynchronusly without having to reload the page everytime
document.getElementById("ai_image_form").addEventListener("submit", async function(event){
    event.preventDefault(); // Prevents the default form submission so it can only be handled by JS
    
    try {
        addLoadingToButton("generateButton");
        generateUIBALLLoader();
        const generateButton = document.getElementById("generateButton");
        const form = event.target;
        const response = await axios.post(`/generate-image`, {
            resolution: form.resolution.value,
            prompt: form.prompt.value,
            negative_prompt: form.negative_prompt.value ? form.negative_prompt.value : "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, blurry, bad anatomy, blurred, watermark, grainy, signature, cut off, draft",
            guidance: form.guidance.value,
            steps: form.steps.value,
            upscale: form.upscale.value,
            model: form.model.value
        },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded" 
            }
        });

        if(response.data.imageData) {
            addGeneratedImage(response);
        }
    } catch (error) {
        if(error.response && error.response.status === 429){//Rate limit error
            const generateButton = document.getElementById("generateButton");
            let timeUntilReset = error.response.data.timeUntilReset;
            createAlert('rateLimitAlert', 'alert-danger', `${error.response.data.message}`);
            // Repeat every 1 second
            generateButton.innerText = `${timeUntilReset}s left`;//setting this here so its more on sync with the notification
            const countDownInterval = setInterval(() => {
                generateButton.innerHTML = `${timeUntilReset}s left`;
                timeUntilReset--;
                if(timeUntilReset < 0) {
                    clearInterval(countDownInterval);
                    generateButton.innerHTML = '&emsp;Generate Image&emsp;';
                }
            }, 1000);

        }
        else {
            createAlert('unknownError', 'alert-danger', createDezgoError(error).customMessage);
        }
    }
    finally{
        removeLoadingFromButton("generateButton");
        removeUIBALLLoader();
    }
});

// Updates the generated image and displays it 
function addGeneratedImage(response){
    const generatedImage = document.createElement("img");
    generatedImage.setAttribute("id", "generatedImage");
    generatedImage.classList.add("img-fluid");
    generatedImage.style.maxWidth = "100%";
    generatedImage.style.height = "auto";
    document.getElementById("generatedImageCol").appendChild(generatedImage);
    generatedImage.innerHTML = "";
    generatedImage.src = response.data.imageData;
}

// Removes the generated image col and everything in it
function removeGeneratedImage(){
    document.getElementById("generatedImage").remove();
}

// Creates loading animation where picture goes
function generateUIBALLLoader(){
    let generatedImageCol = document.getElementById("generatedImageCol");
    let loading = document.getElementById("loading");
    if(!generatedImageCol){
        generatedImageCol = document.createElement("div");
        generatedImageCol.setAttribute("id", "generatedImageCol");
        generatedImageCol.classList.add("col-lg-6", "col-12");
    }
    if(!loading){
        loading = document.createElement("div");
        loading.setAttribute("id", "loading");
        loading.style.maxWidth = "100%";
        loading.style.height = "auto";
        loading.innerHTML = `  <l-quantum
                                    size="150"
                                    speed="2" 
                                    color="#313b4b" 
                                    ></l-quantum>`;//Code from UIBall LDRS 
    }

    if(document.getElementById("generatedImage")){
        removeGeneratedImage();
    }
    
    document.getElementById("row1").appendChild(generatedImageCol);
    generatedImageCol.appendChild(loading);
}

// Removes the loading animation where the picture goes
function removeUIBALLLoader(){
    if(document.getElementById("loading")) {
        document.getElementById("generatedImageCol").removeChild(loading);
    }
}

