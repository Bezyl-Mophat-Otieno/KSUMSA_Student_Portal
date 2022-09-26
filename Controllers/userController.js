const express = require ('express')
const app = express()
const mysql = require('mysql')

// Creating a Database Connection


const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    port: process.env.DB_PORT,

  })
  //global variable errors
  let alerts = [];
// render the member registration form
// route Get /registerForm
const registerForm = (req , res) =>{
res.status(200)
res.render('add_user')
}

// add a new member into the database
// route POST /addMember
const addMember = (req , res) =>{
const { reg_no,first_name, last_name, school , course , phone, status } = req.body;
const inputFields =  [ reg_no,first_name,last_name,school,course , phone , status ];
if(!reg_no | !first_name | !last_name | !school | !course | !phone | !status) {

  alerts.push({msg:'Kindly fill in all details '})
  res.render('add_user' , { errors , reg_no,first_name, last_name, school , course , phone, status})


} else {
  


    let sql = 'INSERT INTO Members SET Reg_No = ?, First_Name = ?, Last_Name = ?, School = ?, Course = ? , Phone_number = ?, Status = ?';
    db.query ( sql , inputFields, ( err , results) =>{
    if(!err){
    res.status(201)
  
  //Flash a message before redirecting 
  req.flash('success_msg', 'Member R e g i s t e r e d Successfully.')
  res.redirect('/dashboard');
  return
    } else{
      res.status(400)
    console.log(err)
    return
    }
    })
    }
}


//rendering the KSUMSA dashboard 
// route GET /dashboard

const dashboard = (req ,res) => {
let sql ='SELECT * FROM Members WHERE status = "active"';
db.query( sql , (err , results)=>{
if(!err){
res.status(200)
res.render('admin_Dashboard',{ results})
return

}else{
  res.status(400)
  console.log(err)
  return
}
})
}


//rendering the KSUMSA list of inactiveMembers
// route GET /inactiveMembers

const inactiveMembers = (req ,res) => {
  let sql ='SELECT * FROM Members WHERE status = "inactive"';
  db.query( sql , (err , results)=>{
  if(!err){
  res.status(200)
  res.render('inactiveMembers',{ results})
  return
  
  }else{
    res.status(400)
    console.log(err)
    return
  }
  })
  }
//View  member's information
// GET /memberInfo/:id

const memberInfo = (req , res ) =>{
  let sql = 'SELECT * FROM Members WHERE ID = ? ';
  db.query( sql , [ req.params.id] , (err , results )=>{
if(!err){
res.status(200)
res.render('user_info', {results} )
let test = results.forEach((result)=>{
console.log(result.First_Name)
});
return
}else{
  res.status(400)
console.log(err)
return
}
  })
}

// rendering the members update form
// GET /editMemberForm/:id

const editMemberForm = (req,res )=>{
  let sql = 'SELECT * FROM Members WHERE ID = ? ';

 db.query( sql , [ req.params.id] , (err , results )=>{
if(!err){
res.status(200)
res.render('edit_user', {results} )
console.log
return
}else{
  res.status(400)
console.log(err)
return
}
  })
}

//Updating member information
//POST /editMemberInfo

const editMemberInfo = (req , res )=>{

  const { reg_no,first_name, last_name, school , course , phone, status } = req.body;
  const inputFields =  [ reg_no,first_name,last_name,school,course , phone , status , req.params.id ];
  
  let sql = 'UPDATE Members SET Reg_No = ?, First_Name = ?,Last_Name = ?,School = ?,Course = ? ,Phone_number = ?,Status = ? WHERE ID = ?';
  db.query ( sql , inputFields, ( err , results) =>{
  if(!err){
  res.status(201)
  req.flash('success_msg', "Member's Info U p d a t e d Successfully.")
  res.redirect('/dashboard')
  return
  } else{
    res.status(400)
  console.log(err)
  return
  }
  })
  }
  
  //permanently remove a member
  // DELETE /deleteMember/:id
  const deleteMember = (req, res )=>{

    let sql = 'DELETE FROM Members WHERE ID = ?'
    db.query ( sql ,[req.params.id],( err , results) =>{
    if(!err){
    res.status(201)
    req.flash('success_msg', 'Member Permanently  D e l e t e d.')
    res.redirect('/dashboard')
    return
    } else{
      res.status(400)
    console.log(err)
    return
    }
    })
    }
    
    // deactivate a member    
     // POST /deactivateMember/:id
    const deactivateMember = (req,res)=>{
      let sql = 'UPDATE Members SET status = ? WHERE ID = ?'
    db.query( sql, ['inactive',req.params.id] , ( err , result)=>{
 if(!err){
res.status(200)
req.flash('success_msg', 'Member  Successfully d e a c t i v a t e d.')
res.redirect('/dashboard')
return
 }else{
res.status(400)
console.log(err)
return
 }
    })
    }

        // deactivate a member    
     // POST /deactivateMember/:id
     const activateMember = (req,res)=>{
      let sql = 'UPDATE Members SET status = ? WHERE ID = ?'
    db.query( sql, ['active',req.params.id] , ( err , result)=>{
 if(!err){
res.status(200)
req.flash('success_msg', 'Member  Successfully  a c t i v a t e d.')
res.redirect('/dashboard')
return
 }else{
res.status(400)
console.log(err)
return
 }
    })
    }

    
// Searching for a registered active member
// route POST /search 
    const searching = (req  , res )=>{
    let searchTerm = req.body.search;
    let sql = 'SELECT * FROM Members WHERE First_Name LIKE ? OR Last_Name LIKE ? OR Reg_No LIKE ?'
    let searchField = ['%' + searchTerm + '%', '%' + searchTerm + '%','%' + searchTerm + '%']
 db.query(sql , searchField , (err , results)=>{
if(!err){
  res.status(200)
  if(results.length === 0){

    req.flash('error_msg', 'No Results Found')
    res.redirect('/dashboard')

  } else{
    res.status(200)
    res.render('admin_Dashboard', {results} )
  }
    
  return
} else {
  res.status(400)
alerts.push({msg : 'No Results Found '})
return

}



 })



  }


module.exports = { registerForm , addMember , dashboard ,memberInfo , editMemberForm , editMemberInfo ,deleteMember , deactivateMember, activateMember, inactiveMembers ,searching};
