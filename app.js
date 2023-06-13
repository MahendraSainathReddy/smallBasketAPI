let express = require('express');
let app = express();
let port = process.env.port||9515;
let Mongo = require('mongodb');
let bodyParser = require('body-parser');

let {dbConnect,getData,postData,updateData,deleteData} = require('./controller/dbController')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('Small Basket');
})

app.get('/categories',async (req,res)=>{
    let query={};
    if(req.query.category_id){
        query={category_id : Number(req.query.category_id)};
    }
    else if(req.query.sub_category_id){
        query={"item_subcategories.sub_category_id" : Number(req.query.sub_category_id)};
    }
    else{
        query={};
    }
    let collection ="categories";
    let output = await getData(collection,query);
    res.send(output);
})

app.get('/products', async (req,res)=>{
    let query={};
    if(req.query.brand_id){
        query={brand_id : Number(req.query.brand_id)};
    }
    let collection="products";
    let output = await getData(collection,query);
    res.send(output);
})

app.get('/brands', async (req,res)=>{
    let query={};
    if(req.query.brand_id){
        query={brand_id : Number(req.query.brand_id)};
    }
    let collection="brands";
    let output = await getData(collection,query);
    res.send(output);
})

app.get('/dealsOfTheDay', async (req,res)=>{
    let query={};
    let collection="dealsOfTheDay";
    let output = await getData(collection,query);
    res.send(output);
})

app.get('/subcategories/:sub_category_name' , async(req, res)=>{
    let sub_category_name=req.params.sub_category_name;
    let query = {sub_category_name:sub_category_name};
    let collection = 'products';
    let output = await getData(collection, query);
    res.send(output);
})

app.get('/brands/:brand_name' , async(req, res)=>{
    let brand_name=req.params.brand_name;
    let query = {brand_name:brand_name};
    let collection = 'products';
    let output = await getData(collection, query);
    res.send(output);
})

app.get('/product-details/:id' , async(req, res)=>{
    let id = new Mongo.ObjectId(req.params.id);
    let query = {_id:id};
    let collection = 'products';
    let output = await getData(collection, query);
    res.send(output);
})

app.get('/orders',async(req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
   
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})

app.get('/my-basket',async(req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
   
    let collection = "mybasket";
    let output = await getData(collection,query);
    res.send(output)
})

app.post('/add-to-basket',async(req,res)=>{
    let data = req.body;
    let collection = "mybasket";
    let response = await postData(collection,data)
    res.send(response);
})

app.post('/orderDetails', async(req,res)=>{
    let query = {product_id:{$in:req.body.product_id}};
    let collection = 'menu';
    let output = await getData(collection,query);
    res.send(output);
})

app.delete('/remove-item',async (req,res)=>{
    let collection='mybasket';
    let condition={"_id":new Mongo.ObjectId(req.body._id)};
    let output = await deleteOrder(collection,condition);
    res.send(output);
})

app.listen(port,(err)=>{
    dbConnect();
    if(err) throw err;
})