const express = require('express')
const app =express();
const morgan = require('morgan')
const path = require('path')
const methodOverride = require('method-override');
const dotenv = require('dotenv').config({path:'./Config/server.env'});
const flash = require('connect-flash')
const session = require('express-session')
const PORT =process.env.PORT || 5000;
const passport = require('passport')
const expressLayouts = require('express-ejs-layouts');
const mysql = require('mysql')

//Using morgan (' whenever a request  is made on  any route the route path is consoled on the terminal')
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//adding a body parser middleware 
app.use(express.json());


//adding a form handling data middleware
app.use(express.urlencoded({extended:false}));


//Using method-Override since we cannot make PUT or DELETE requests when submitting forms.

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))



 //Express session Middleware
 app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  maxAge:60000,
}))

   //Connect- Flash middleware 

   app.use(flash());

   // NOTE : We now have access to the req.flash.
 
   //Global variables (declared by the use of a Middleware)
 
   app.use((req , res , next)=>{
 
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error = req.flash('error');
 
 
 next();
 
 
   })

//Using a template engine  

app.set('view engine' , 'ejs');
// app.set('views' , 'backend/views');
app.set('views', path.join(__dirname, 'Views'));
// ejs layouts 
app.use (expressLayouts);
app.set('layout','./Layouts/main' );

// Creating a Database Connection
const db = mysql.createConnection({
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    port: process.env.DB_PORT,

})

db.connect((err)=>{
    if(err) throw err;
    console.log('MYSQL connected ...')

})
//Public static folder
app.use(express.static(path.join(__dirname, 'Public')))

//Routing
const userRouting =  require('./Routes/userRoutes');

app.use('/', userRouting);


app.listen (PORT, ()=>{
console.log(`server started in ${process.env.NODE_ENV} mode on port ${PORT}`)

})