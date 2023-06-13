let mongo = require('mongodb');
let {MongoClient} = require('mongodb');
let mongoUrl = "mongodb+srv://mahendrasainathreddy8:KTQ4FVVri4sHEcwR@cluster0.onhcggu.mongodb.net/?retryWrites=true&w=majority";
let client = new MongoClient(mongoUrl)

async function dbConnect(){
    await client.connect();
}

let db=client.db('smallBasketData');

async function getData(collectionName, query){
    let output = [];
    try{
        const cursor = db.collection(collectionName).find(query);
        for await(const data of cursor){
            output.push(data);
        }
        cursor.closed;
    }
    catch(err){
        output.push({"Error" : "Error in getData"});
    }
    return output;
}

async function postData(collectionName,data){
    try{
        await db.collection(collectionName).insertOne(data);
        output = ({"response" : "order placed"});
    }
    catch(err){
        output = ({"Error" : "Error in postData"});
    }
    return output;
}

async function updateData(collectionName,condition,data){
    let output;
    try{
        output = await db.collection(collectionName).updateOne(condition,data);
    }
    catch(err){
        output = {"response":"Error in update data"};
    }
    return output;
}

async function deleteData(collectionName,condition){
    let output;
    try{
        output = await db.collection(collectionName).deleteOne(condition);
    }
    catch(err){
        output = {"response":"Error in Delete data"};
    }
    return output;
}

module.exports ={
    dbConnect,
    getData,
    postData,
    updateData,
    deleteData
}