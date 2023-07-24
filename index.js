const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const studentCollection = client.db("collegeDB").collection("students");
    const reviewCollection = client.db("collegeDB").collection("reviews");

    /*--------------------------
       colleges collection apis
    ----------------------------*/

    // get all colleges data
    app.get("/colleges", async (req, res) => {
      const search = req.query.search;
      // console.log(search);
      const query = { collegeName: { $regex: search, $options: "i" } };
      const result = await collegeCollection.find(query).toArray();
      res.send(result);
    });

    // get specific college data
    app.get("/colleges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const college = await collegeCollection.findOne(query);
      res.send(college);
    });

    /*--------------------------
       students collection apis
    ----------------------------*/

    // post users to db
    app.post("/students", async (req, res) => {
      const userInfo = req.body;

      // const query = { email: userInfo.email };
      // const existingStudent = await studentCollection.findOne(query);
      // if (existingStudent) {
      //   return res.send({ message: "Student already admitted" });
      // }

      const result = await studentCollection.insertOne(userInfo);
      res.send(result);
    });

    /*--------------------------
       reviews collection apis
    ----------------------------*/

    // get review from db
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // post review to db
    app.post("/reviews", async (req, res) => {
      const testimonial = req.body;
      const result = await reviewCollection.insertOne(testimonial);
      res.send(result);
    });

    // get data with email specifically
    app.get("/student", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await studentCollection.find(query).toArray();
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
