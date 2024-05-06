const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

//Redoy-Coffee-Expresso
//wBvBkQ6OHaRVgMWd

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster01.2xfw1xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    const userCollection = client.db("coffeeDB").collection("users");

    app.get("/coffee", async (req, res) => {
      const data = coffeeCollection.find();
      const result = await data.toArray();
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.post("/coffee", async (req, res) => {
      const data = req.body;
      // console.log(data);
      const result = await coffeeCollection.insertOne(data);
      res.send(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = req.body;
      const coffee = {
        $set: {
          name: updateCoffee.name,
          quantity: updateCoffee.quantity,
          supplier: updateCoffee.supplier,
          test: updateCoffee.test,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo,
        },
      };

      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // users Db
    app.get("/user", async (req, res) => {
      const data = userCollection.find();
      const result = await data.toArray();
      res.send(result);
    });
    app.post("/user", async (req, res) => {
      const userData = req.body;
      console.log(userData);
      const result = await userCollection.insertOne(userData);
      res.send(result);
    });
    app.patch('/user',async(req ,res) =>{
      const data = req.body
      const email = {email : data.email}
      const updatePatch = {
        $set:{
          
          lastLoggedAt : data.lastLoggedAt

        }
      }
      const result = await userCollection.updateOne(email , updatePatch)
      res.send(result)
    })
    app.delete('/user/:id', async (req , res)=>{
      const id = req.params.id
       console.log(id);
       const filter = {_id : new ObjectId(id)}
       const result = await userCollection.deleteOne(filter)
       res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee Shop");
});

app.listen(port, () => {
  console.log("port is running on:", port);
});
