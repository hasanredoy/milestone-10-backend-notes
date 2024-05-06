const express = require('express');

const cors = require('cors');

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

const port = process.env.PORT ||5000;

app.use(cors())

app.use(express.json())


const user =[
  {id:1 , name:'hossain' , email:"hossain@gmail.com"},
  {id:2 , name:'hasan' , email:"hasan@gmail.com"},
  {id:3 , name:'redoy' , email:"redoy@gmail.com"},
]


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster01.2xfw1xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01`

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
    await client.connect();


    const database = client.db('usersDB')
    const userCollection = database.collection('users')

    app.get('/users', async(req,res)=>{
      const cursor  = userCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })




    app.post('/users' , async(req , res )=>{
       const user = req.body
       console.log('users are ' , user);
       const results = await userCollection.insertOne(user)
       res.send(results)
    })

 
    

    app.get("/users/:id" , async(req , res)=>{
      const id = req.params.id
      console.log('user id = ',id);
      const query = {_id: new ObjectId(id) }
      const user = await userCollection.findOne(query)
      res.send(user)
    })

  app.put('/users/:id' , async(req,res)=>{
    const id = req.params.id
    const user = req.body
    console.log('updating user',user);
    const filter = {_id : new ObjectId(id)}
    const option = {upsert:true}

    const updatedUser={
      $set:{

      name: user.name,
      email: user.email
      }
    }

    const result = await userCollection.updateOne(filter,updatedUser ,option)
    res.send(result)
  })

    app.delete('/users/:id' , async (req, res)=>{
      const id = req.params.id

      console.log('deleting id :', id);
      const query = {_id : new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' ,(req,res)=>{
  res.send('server is running')
} );
app.get('/user' ,(req,res)=>{
  res.send(user)
} );

app.listen(port, ()=>{
  console.log(`port is running on ${port}`);
})