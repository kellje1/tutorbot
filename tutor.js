var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv");
var connectDB = require("./db");

dotenv.config();
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
console.log("RAW KEY CHECK: ", process.env.GEMINI_API_KEY);
console.log("KEY LENGTH: ", process.env.GEMINI_API_KEY?.length);
console.log("KEY START: ", process.env.GEMINI_API_KEY?.slice(0, 6));
connectDB();
var path = require("path");

const app = express(); 
const port = 4000; 
const User = require("./user");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(cors());
app.use(express.json());

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/search.html", (req, res) => {
    res.sendFile(path.join(__dirname, "search.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

app.get("/tutor.css", (req, res) => {
    res.sendFile(path.join(__dirname, "tutor.css"));
});

app.post('/signup', async (req, res) => {
    console.log("Signup Route Works"); 
    console.log("Request Body:", req.body);
    try {
        const {firstname, lastname, email, username, password} = req.body;

        const user = new User({
            firstname,
            lastname,
            email,
            username,
            password
        });

        const savedUser = await user.save();

        console.log("User signed up", savedUser);
        
        res.send("User signed up successfully!");
    } catch (error) {
        console.error("Error signing up user:", error.message);
        res.status(500).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    console.log("Login Route Works");
    console.log("Request Body:", req.body);
    try {
        const {username, password } = req.body; 

        const recentUser = await User.findOne({username});

        if(!recentUser) {
            return res.status(400).send("Invalid username or password");
        }

        if(recentUser.password !== password) {
            return res.status(400).send("Incorrect password");
        }
        
        res.send("User logged in successfully!");
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).send(error.message);
    }
});

app.post('/generate', async (req, res) => {
    try {
        const { question } = req.body;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: question }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).send(data.error?.message || "Gemini API error");
        }

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from Gemini";

        res.json({ answer: text });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);    
});