import cookieParser from 'cookie-parser';
//const express = require('express'); common js
import express from 'express' // module js
import cors from 'cors'
import morgan from 'morgan'
import userRoutes from './routes/user.routes.js'
import errorMiddleware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import miscRoutes from './routes/miscellaneous.routes.js';
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,
    
}));

app.use(express.json()) // for data parsing from frontend
app.use(express.urlencoded({extended:true}));//helps parsing the url



app.use(morgan('dev')); // keep track of url in log(in terminal)

app.use(cookieParser()); //parse token stored in cookie

// routes of User,Course,Payment module
app.use('/api/v1', miscRoutes);
app.use('/api/v1/user',userRoutes)//if error comes in this process then it moves down and check other processes
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 Page Not Found');
}); //to handle any unknown route

app.use(errorMiddleware);

export default app