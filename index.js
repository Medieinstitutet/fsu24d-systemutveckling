import express from "express";
import { MongoClient, ObjectId } from 'mongodb';

let url = "mongodb://localhost:27017";

let dbConnection = new MongoClient(url);

let connect = async function() {

  await dbConnection.connect();
  let database = dbConnection.db("fsu24d");

    let app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
        res.send({"test": "test"});
    });

    app.get("/api/", (req, res) => {
      res.send({"test": "test"});
  });

  app.get("/api/products", async (req, res) => {
    let collection = database.collection("products");

    let results = await collection.find().toArray();

    res.send(results);
});

app.post("/api/products/add", async (req, res) => {
  let collection = database.collection("products");

  let insertObject = {
    name: "Test 2",
    price: 456
  };
  let result = await collection.insertOne(insertObject);
  let object = await collection.findOne({_id: result.insertedId});

  res.send(object);
});

app.get("/api/products/:id/edit", async (req, res) => {
  let collection = database.collection("products");

  let editData = {
    name: "Test 3",
    price: 678
  };
  
  let id = new ObjectId(req.params.id);
  let filter = {_id: id};
  let operation = {$set: editData};

  let result = await collection.updateOne(filter, operation);
  let object = await collection.findOne({_id: id});

  res.send(object);
});

app.get("/api/products/:id/delete", async (req, res) => {
  let collection = database.collection("products");

  let id = new ObjectId(req.params.id);
  let filter = {_id: id};

  let result = await collection.deleteOne(filter);

  res.send(result);
});

app.get("/api/checkout", async (req, res) => {

  let collection = database.collection("orders");
  let productCollection = database.collection("products");

  let items = [
    {id: "68147189687b137ada4e4f64", quantity: 1},
    {id: "681473ce2ede5ba0fd3b015c", quantity: 2},
  ];

  let customer = {
    firstName: "M",
    lastName: "E",
    email: "m@example.com",
    street: "",
    city: ""
  }

  let encodedItems = [];
  
  for(let i = 0; i < items.length; i++) {
    let item = items[i];
    let returnObject = {...item};
    let id = new ObjectId(item.id);
    returnObject.id = id;

    let product = await productCollection.findOne({_id: id});
    returnObject.itemPrice = product.price;
    encodedItems.push(returnObject);
  }

  let result = await collection.insertOne({"items": encodedItems, "customer": customer});
  let object = await collection.findOne({_id: result.insertedId});
  
  res.send(object);
});

app.get("/api/orders", async (req, res) => {
  let collection = database.collection("orders");
  
  let pipeline = [
    {
      $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$items"
        }
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "products",
          localField: "items.id",
          foreignField: "_id",
          as: "items.product"
        }
    },
    {
      $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$items.product"
        }
    },
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          "items.id": 0
        }
    },
    {
      $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: "$_id",
          item: {
            $push: "$items"
          },
          customer: {
            $first: "$customer"
          }
        }
    }
  ];
  let results = await collection.aggregate(pipeline).toArray();

  res.send(results);
});

    app.listen(4000, () => {
        console.log("Server started");
    });
}

connect();