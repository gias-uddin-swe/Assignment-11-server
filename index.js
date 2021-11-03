const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.texip.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const servicesCollection = client.db("travelWorld").collection("services");
  const bookingsCollection = client.db("travelWorld").collection("bookings");

  // add Services
  app.post("/addServices", async (req, res) => {
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);
  });

  //get servicesCollection

  app.get("/services", async (req, res) => {
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
  });

  // get single service
  app.get("/details/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    console.log(result);
    res.send(result[0]);
  });

  // confirm booking service

  app.post("/confirmBooking", async (req, res) => {
    const result = bookingsCollection.insertOne(req.body);
    res.send(result);
  });

  /// get my booking
  app.get("/myBooking/:email", async (req, res) => {
    const result = await bookingsCollection
      .find({
        email: req.params.email,
      })
      .toArray();
    res.send(result);
  });
});

app.listen(process.env.PORT || port);
