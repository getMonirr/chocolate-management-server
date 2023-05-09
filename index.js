import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 5000


// middle ware
app.use(cors())
app.use(express.json())


// routes
app.get('/', (req, res) => {
  res.send("chocolate server is running")
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5ku26o.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("chocolatesDB");
    const chocolateCollection = database.collection('chocolates')


    // chocolate server start

    // get all chocolate
    app.get('/chocolates', async (req, res) => {
      const result = await chocolateCollection.find().toArray()

      res.send(result)
    })

    // get a individual chocolate
    app.get('/chocolates/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) }
      const result = await chocolateCollection.findOne(query)

      res.send(result)
    })

    // add a chocolate
    app.post('/chocolates', async (req, res) => {
      const newChocolate = req.body;

      const result = await chocolateCollection.insertOne(newChocolate)

      res.send(result)
    })


    // delete a chocolate
    app.delete('/chocolates/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) }
      const result = await chocolateCollection.deleteOne(query)

      res.send(result)

    })

    // update a chocolate
    app.put('/chocolates/:id', async (req, res) => {
      const id = req.params.id;
      const updatedChocInfo = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updateChocolate = {
        $set: {
          name: updatedChocInfo.name,
          country: updatedChocInfo.country,
          category: updatedChocInfo.category
        }
      }

      const result = await chocolateCollection.updateOne(filter, updateChocolate, options)

      res.send(result)
    })



    // chocolate server end



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`chocolate management server is running on port ${port}`);
})


