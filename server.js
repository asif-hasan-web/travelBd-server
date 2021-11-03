const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;

const app =express()
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.go6jz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
                try {
                          await client.connect();
                          const database = client.db("tour-bd");
                          const plans_collection = database.collection("plans");
                          const order_collection = database.collection("orderplan");
                        
                          //plans added
                        app.post("/plans",async(req,res)=>{
                            const resultplan = await plans_collection.insertOne(req.body);
                            res.send(resultplan.acknowledged)
                        })

                        //plans getted
                        app.get("/plans", async (req,res)=>{
                
                            const cursor = plans_collection.find({});      
                            const plans = await cursor.toArray();
                             res.json(plans)
                        })
                        
                        //booking page
                        app.post("/bookingplan",async(req,res)=>{
                        const result =await order_collection.insertOne(req.body);
                            res.send(result)
                        })
                        //mypackage
                        app.get( "/mypackage" , async (req,res)=>{
                            const result =await  order_collection.find({}).toArray()
                           res.send(result)
                        })
                        //booing single
                        app.get("/bookingplan/:id", async(req,res)=>{
                            const id = req.params.id;
                            console.log('getting specie', id)
                            const query = {_id:ObjectId(id)};
                            const bookingplan = await plans_collection.findOne(query);
                            res.json(bookingplan)
                        })

                        //delete api
                        app.delete('/delete/:id', async(req,res)=>{
                            const id = req.params.id;
                            const query = {_id:ObjectId(id)};
                            const deleteresult = await order_collection.deleteOne(query)
                            console.log('deteted user with id',deleteresult)
                            res.json( deleteresult)
                        })

                        //manage all api
                        app.get("/manageplan",async(req,res)=>{
                            const manageresult = await order_collection.find({}).toArray()
                            res.json( manageresult);
                        })

                        //confirmation put api
                        app.put("/confirmation/:id",async(req,res)=>{
                            const id = req.params.id;
                            const query = {_id:ObjectId(id)}
                            const plan = {
                                $set:{
                                    status:"Confirm"
                                },

                            };
                            const result = await order_collection.updateOne(query,plan)
                            res.json(result)
                            console.log(result)
                        })
                 }
                
                
                
                
             finally {
                //   await client.close();
           }
        }
    
    
    
    run().catch(console.dir);





app.listen(port,()=>{console.log("server is running this on port", port)})


