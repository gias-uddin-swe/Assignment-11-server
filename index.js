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

  // ad service

  app.post("/addServices", async (req, res) => {
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);
  });

  // get all service
  app.get("/allServices", async (req, res) => {
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });

  // get single product
  app.get("/singleProduct/:id", async (req, res) => {
    const result = await servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
  });

  // cofirm order
  app.post("/confirmOrder", async (req, res) => {
    const result = await bookingsCollection.insertOne(req.body);
    res.send(result);
  });

  // my confirmOrder

  app.get("/myOrders/:email", async (req, res) => {
    const result = await bookingsCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  /// delete order

  app.delete("/delteOrder/:id", async (req, res) => {
    const result = await bookingsCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  // all order
  app.get("/allOrders", async (req, res) => {
    const result = await bookingsCollection.find({}).toArray();
    res.send(result);
  });

  // update statuses

  app.put("/updateStatus/:id", (req, res) => {
    const id = req.params.id;
    const updatedStatus = req.body.status;
    const filter = { _id: ObjectId(id) };
    console.log(updatedStatus);
    bookingsCollection
      .updateOne(filter, {
        $set: { status: updatedStatus },
      })
      .then((result) => {
        res.send(result);
      });
  });
});

app.listen(process.env.PORT || port);
