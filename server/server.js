
import app from './app.js'
import {config} from 'dotenv';//considers contents of env file and execute it
config();

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`App is running at http:localhost:${PORT}`);
});