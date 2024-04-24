const express = require('express')

const cors = require('cors')

const app = express()

const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
 app.use(cors())

 app.use(express.json())

 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster01.2xfw1xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01`;




 const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const database= client.db('mangoDB');
    const userCollection = database.collection('mango')

    app.get('/mangos' , async(req,res)=>{
           
           const query = userCollection.find()
           const result = await query.toArray()
           res.send(result)
    })

    app.get('/mangos/:id', async(req,res)=>{
      const id = req.params.id
      // console.log(id);
      const query = {_id : new ObjectId(id)}
      const mango = await userCollection.findOne(query)
      res.send(mango)
    })
    
    app.post('/mangos', async(req,res)=>{
      const mango = req.body
      // console.log(mango);
      const data = await userCollection.insertOne(mango)
      res.send(data)
    })


    app.put('/mangos/:id' , async (req  , res)=> {
     const id = req.params.id
     const data = req.body
     console.log( 'id is',id);
     console.log(data);
     const filter = {_id : new ObjectId(id)}
     const option = {upsert:true}
     const updatedUser = {
      $set:{
        name:data.name,
        email:data.email,
        pass:data.pass
      }
     }
     const result = await userCollection.updateOne(filter, updatedUser, option)
     res.send(result)
    })


  app.delete('/mangos/:id', async(req , res)=>{
    const id = req.params.id
    console.log(id);
    const query = {_id : new ObjectId(id)}
    const results = await userCollection.deleteOne(query)
    res.send(results)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


 app.get('/' , (req , res)=>{
  res.send('hello world')
 })

 app.listen(port , ()=>{
  console.log(`port is running on : ${port}`);
 })
