const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@hero-one.z3ku6ig.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

async function run() {
  try {
    const porductCollection = client.db("emajon").collection("products");

    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      const query = {};
      const coursor = porductCollection.find(query);
      const products = await coursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await porductCollection.estimatedDocumentCount();
      res.send({ count, products });
    });

    app.get("/productsByIds", async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map((id) => ObjectId(id));
      const query = {
        _id: {
          $in: objectIds,
        },
      };
      const coursor = porductCollection.find(query);
      const products = await coursor.toArray();
      res.send(products);
    });
  } finally {
  }
}

run().catch((error) => {
  console.log(error);
});

app.listen(port, () => {
  console.log(`Server running on port:${port} `);
});
