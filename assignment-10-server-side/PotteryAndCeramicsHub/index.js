const express = require('express')
const cors = require('cors');
// const cors = require("cors");
require('dotenv').config();
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
// app.use(cors())


app.use(cors({
  origin:['http://localhost:5173' ,'https://a-10-potteryandcraft.web.app','*']
  }))

app.use(express.json())




// mongo db 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster01.2xfw1xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01`;

console.log(process.env.DB_USER);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
    const craftItemCollection = client.db('CraftItemDB').collection('craftItem')

    const clientReviewCollection = client.db('ReviewDB').collection('review')

    const artAndCraftCollection = client.db('artAndCraftDB').collection('artAndCraft')

    const allArtAndCraftCollection = client.db('allArtAndCraftDB').collection('allArtAndCraft')

    

  app.get('/craftItem', async(req,res)=>{
     const crafts = craftItemCollection.find()
     const result = await crafts.toArray()
     res.send(result)
  })
  app.get('/craftItem/:id', async(req , res)=>{
    const id = req.params.id
    console.log(id);
    const filter = {_id : new ObjectId(id)}
    const result = await craftItemCollection.findOne(filter)
    res.send(result)
  })

  app.post('/craftItem' , async(req, res)=>{
    const data = req.body
    const result = await craftItemCollection.insertOne(data)
    res.send(result)
  })
  

  // client review 

  app.get('/review' , async(req, res)=>{
    const client = clientReviewCollection.find()
    const result = await client.toArray()
    res.send(result)
  })
  app.post('/review',async(req , res)=>{
    const client = req.body
    const result = await clientReviewCollection.insertOne(client)
    res.send(result)
  })

  // art and craft 

  app.get('/artAndCraft' , async(req, res)=>{
    const client = artAndCraftCollection.find()
    const result = await client.toArray()
    res.send(result)
  })
  app.post('/artAndCraft',async(req , res)=>{
    const client = req.body
    const result = await artAndCraftCollection.insertOne(client)
    res.send(result)
  })
  // user art and craft 

  app.get('/allArtAndCraft' , async(req, res)=>{
    const client = allArtAndCraftCollection.find()
    const result = await client.toArray()
    res.send(result)
  })
  app.post('/allArtAndCraft',async(req , res)=>{
    const client = req.body
    const result = await allArtAndCraftCollection.insertOne(client)
    // res.send(result)
  })


  app.get("/allArtAndCraft/:id", async(req, res)=>{
    const id = req.params.id
    // console.log(id)

    const filter = {_id : new ObjectId(id)}

   const result= await allArtAndCraftCollection.findOne(filter)
    // console.log(result);
    res.send(result)
  })

  app.put( '/allArtAndCraft/:id' , async(req, res)=>{
    const id= req.params.id
     const filter = {_id : new ObjectId(id)}
     const craftData = req.body
     console.log('id:', id , 'data=', craftData);
     const options= { upsert: true }
     const update = {
      $set:{
        photoURL: craftData.photoURL,
        item_name: craftData.item_name,
        subcategory: craftData.subcategory,
        descriprtion:craftData.descriprtion,
        price:craftData.price,
        rating:craftData.rating,
        customization: craftData.customization,
         stockStatus:craftData.stockStatus,
         proccesing_time:craftData.proccesing_time
      }
     }
     const result = await allArtAndCraftCollection.updateOne(filter,update ,options)
     res.send(result)
  })

  app.delete("/allArtAndCraft/:id", async(req,res)=>{
    const id = req.params.id
    const filter  = {_id : new ObjectId(id)}
    const result = await allArtAndCraftCollection.deleteOne(filter)
    res.send(result)
  })


  
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/' , (req , res)=>{
  res.send('Pottery and Ceramic Hub Is running')
})

app.listen(port , ()=>{
  console.log('server running on port:', port);
})