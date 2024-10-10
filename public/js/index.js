import {createAlert} from "./createAlert.js";
import {addLoadingToButton, removeLoadingFromButton} from "./buttonLoading.js";
import {getAiImageModels} from "./dezgoAiModels.js";


//This sets up the page for us after its fully loaded
window.addEventListener("load", function() {
    getAiImageModels();
    //Getting the sliders values & sliders labels
    var guidance = document.getElementById("guidance"); 
    var guidance_label = document.getElementById("guidance_label");
    var steps = document.getElementById("steps"); 
    var steps_label = document.getElementById("steps_label");
    
    //Assigning the values to the corresponding labels
    guidance_label.innerHTML = `Guidance (-20->20): ${guidance.value}`;
    steps_label.innerHTML = `Steps (10->150): ${steps.value}`;
    
    //Activating tooltips in for bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle='tooltip']"))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

//Once changed the designated label will be updated
document.getElementById("guidance").addEventListener("input", function() {
    document.getElementById("guidance_label").innerHTML = `Guidance (-20->20): ${this.value}`;
}); 
document.getElementById("steps").addEventListener("input", function() {
    document.getElementById("steps_label").innerHTML = `Steps (10->150): ${this.value}`;
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
                generateButton.innerText = `${timeUntilReset}s left`;
                timeUntilReset--;
                if(timeUntilReset < 0) {
                    clearInterval(countDownInterval);
                    generateButton.innerText = 'Generate Image';
                }
            }, 1000);

        }
        else if (error.response && error.response.data && error.response.data.requestError) {
            createAlert('requestError', 'alert-danger', error.response.data.requestError);
          }
        else {
            createAlert('unknownError', 'alert-danger', 'An unknown error occurred. Please try again.');
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
    const loading = document.createElement("div");
    loading.setAttribute("id", "loading");
    loading.style.maxWidth = "100%";
    loading.style.height = "auto";
    loading.innerHTML = `  <l-quantum
                                size="150"
                                speed="2" 
                                color="#313b4b" 
                                ></l-quantum>`;//Code from UIBall LDRS 

    if(document.getElementById("generatedImage")){
        removeGeneratedImage();
    }
    
    document.getElementById("generatedImageCol").appendChild(loading);
}

// Removes the loading animation where the picture goes
function removeUIBALLLoader(){
    if(loading) {
        document.getElementById("generatedImageCol").removeChild(loading);
    }
}

