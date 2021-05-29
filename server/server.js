const express = require('express');
const morgan  = require('morgan');
const cors  = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();



const app = express();
// app.use()

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
    useFindAndModify : true,
    useUnifiedTopology : true,
    useCreateIndex : true
})
.then(()=> console.log('DB connected'))
.catch((err) => console.log(`DB connection error : ${err}`))

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Middlewares
app.use(morgan('dev'));
// app.use(cors()); //allows all orignins
if(process.env.NODE_ENV = 'development'){
    app.use(cors({origin : `http://localhost:3000`}))
}
app.use(express.json({extended: true}))






// Inital routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)


const port = process.env.PORT || 8000;
app.listen(port, ()=> {
    console.log(`API is runing on port ${port}`);
})
