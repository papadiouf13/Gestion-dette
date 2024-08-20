import app from "./app";
import dotenv from "dotenv";
dotenv.config

const port = process.env.PORT ?? 5000;
app.server.listen(port,() => { 
    console.log(`Server is running on port ${port}`); 
});