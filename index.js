const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.puu64.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const visaCollection = client.db('visaDB').collection('visa')


    app.get('/visa', async(req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/visa', async(req, res) => {
      const newVisa = req.body;
      const result = await visaCollection.insertOne(newVisa);
      res.send(result);
    })

    app.get('/visa/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await visaCollection.findOne(query);
      res.send(result)
    })

    app.put('/visa/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {upsert : true}
      const updatedVisa = req.body;
      const visa = {
        $set: {
          countryImageUrl: updatedVisa.countryImageUrl,
          countryName: updatedVisa.countryName,
          visaType: updatedVisa.visaType,
          processingTime: updatedVisa.processingTime,
          validPassport: updatedVisa.validPassport,
          visaApplicationForm: updatedVisa.visaApplicationForm,
          passportPhoto: updatedVisa.passportPhoto,
          bio: updatedVisa.bio,
          ageRestriction: updatedVisa.ageRestriction,
          fee: updatedVisa.fee,
          validity: updatedVisa.validity,
          applicationMethod: updatedVisa.applicationMethod
      }
      }
      const result = await visaCollection.updateOne(query, visa, options)
      res.send(result)
    })
    
    app.delete('/visa/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await visaCollection.deleteOne(query);
      res.send(result)
    })


    // Visa Application
    const visaApplicationCollection = client.db('visaDB').collection('visaApplications')
    app.get('/visa-application', async(req, res) => {
      const cursor = visaApplicationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/visa-application', async(req, res) => {
      const visaApplication = req.body;
      const result = await visaApplicationCollection.insertOne(visaApplication);
      res.send(result);
    })
    app.delete('/visa-application/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await visaApplicationCollection.deleteOne(query);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('server running');
})

app.listen(port, ()=> {
    console.log(`server is running on port ${port}`)
})