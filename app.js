const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongo = require ('mongodb');
const MongoClient = mongo.MongoClient
// const mongourl = "mongodb://localhost:27017";
const mongourl = "mongodb+srv://mah43:mongo123@cluster0.x2ats.mongodb.net/mark42?retryWrites=true&w=majority"
let db;
const cors = require('cors');
const bodyParser = require('body-parser');


//middleware

app.use(cors());
//use in post call to pass the data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 


app.get('/',(req,res) => {
    res.send('Hi to server')
})

app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err,result) =>{
        res.send(result)
    }) 
})

/// rest info ///

app.get('/rest/:id',(req,res)=> {
    var {id} = req.params;  // which is called destructuring
    //// var id = req.params.id
    ///databse query
    db.collection('restaurant').find({_id:id}).toArray((err,result)=> {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurant',(req,res)=> {
    var condition = {};
    let sortcondition = {cost:1}
    //// sorting /////
    if(req.query.sort){
        sortcondition={cost:Number(req.query.sort)} 
    }
    ///city   +   mealtype/////
    if(req.query.city && req.query.mealtype){
        condition= {$and:[{city:req.query.city},{"type.mealtype":req.query.mealtype}]}
    } 
    ////city   +   cuisine  ////
    else if(req.query.city && req.query.cuisine){
        condition= {$and:[{city:req.query.city},{"Cuisine.cuisine":req.query.cuisine}]}
    }
    ///// city  /////
    else if(req.query.city){
        condition = {city:req.query.city}
    }
    /// mealtype  ////
    else if(req.query.mealtype){
        condition = {"type.mealtype":req.query.mealtype}
    }
    ///// cost  ////
  else if (req.query.lcost && req.query.hcost){
      condition = {$and:[{cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}]}
  }
    //// cuisine  /////
    else if(req.query.cuisine){
        condition = {"Cuisine.cuisine":req.query.cuisine}
    }
    db.collection('restaurant').find(condition).sort(sortcondition).toArray((err,result)=> {
        res.send(result)
    })
})
///   view booking  ///
app.get('/orders',(req,res)=> {
    db.collection('orders').find().toArray((err,result)=>{
        res.send(result)
    })
})
/// place orders
app.post('/placeOrder',(req,res)=>{
    db.collection('orders').insert(req.body,(err,result)=>{
        if(err) throw err;
        res.send('data added')
    })
})

//// mealtype
app.get('/mealtype',(req,res) =>{
    db.collection('mealtype').find().toArray((err,result)=>{
        res.send(result)
    })
})
///// Cuisine  
app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find().toArray((err,result)=>{
        res.send(result)
    })
})


///// MONGO CONNECTION
MongoClient.connect(mongourl,(err,connection) =>{
    if (err) console.log(err);
    db= connection.db('mark42')
})
app.listen(port,(err) => {
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})
