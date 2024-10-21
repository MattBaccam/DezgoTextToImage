import express, { response } from "express";
import { rateLimit } from "express-rate-limit";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import {createDezgoError} from "./public/js/createDezgoRequestError.js";

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
dotenv.config();

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3, 
    handler: (req, res) => {
        res.status(429).json({
            maxRequests: 3, 
            windowMs: 1 * 60 * 1000,
            message: `Too many requests, please try again later. Limited to 3 per 1 minute.`,
            timeUntilReset: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
        });
    }
});

//Home Page
app.get("/", (req, res) =>{
        res.render("index.ejs");
});

//Home Page
app.get("/models", (req, res) =>{
    res.render("models.ejs");
});

//Endpoint for generating images
app.use("/generate-image", rateLimiter);//rate limits this post request
app.post("/generate-image", async (req, res) =>{
    try {
        var resolutionSplit = req.body.resolution.split("x");
        const response = await axios.post(`https://api.dezgo.com/text2image`, {
            height: resolutionSplit[0],
            width: resolutionSplit[1],
            prompt: req.body.prompt,
            negative_prompt: req.body.negative_prompt,
            guidance: req.body.guidance,
            steps: req.body.steps,
            upscale: req.body.upscale,
            model: req.body.model
    }, {
        headers:{
            "X-Dezgo-Key": process.env.DEZGO_API_KEY
        },
        responseType: "arraybuffer"
    });
    const imageData = `data:image/png;base64,${Buffer.from(response.data, "binary").toString("base64")}`;
    res.json({imageData});
    } catch (error) {
        const formattedError = createDezgoError(error);
        res.status(formattedError.statusCode).json({ customMessage: formattedError.customMessage });
    }
});

// Catch-all route handler for undefined routes (redirect home page)
app.use((req, res, next) => {
    res.redirect("/");
});

app.listen(port);