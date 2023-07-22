const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://collegeUser:y3CdzjbJQnEOgPk0@cluster0.mjja2r0.mongodb.net/?retryWrites=true&w=majority`;

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

    /*----------------------
        All Collection here
    -----------------------*/

    const collegeCollection = client.db("collegeDB").collection("colleges");

    /*--------------------------
       colleges collection apis
    ----------------------------*/

    // get all colleges data
    app.get("/colleges", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });

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
  res.send("College is running!!");
});

app.listen(port, () => {
  console.log(`College is running on port: ${port}`);
});
