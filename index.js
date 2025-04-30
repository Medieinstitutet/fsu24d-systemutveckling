import express from "express";
import client from "./src/DatabaseConnection.js";
import Product from "./src/shop/Product.js";
import Order from "./src/shop/Order.js";
import Cart from "./src/shop/Cart.js";

let url = "mongodb://localhost:27017";

//let client = new DatabaseConnection(url, "fsu24d");
client.setup(url, "fsu24d");

let connect = async function() {
    let app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
        res.send({"test": "test"});
    });

    app.get("/api/", (req, res) => {
      res.send({"test": "test"});
  });

    app.get("/todo-list/:id/", async (req, res) => {

      let query = {list: client.toObjectId(req.params.id)};
      let items = await client.findAll("todoItems", query);

      res.send(items);
    });

    app.post("/todo-list/:id/", async (req, res) => {
      let collection = await client.getCollection("todoItems");

      let item = await collection.insertOne({
        "description": req.query.description,
        "lastChangeBy": req.query.name,
        "status": "open",
        "list": client.toObjectId(req.params.id)
      })

      res.send(item);
    });

    app.get("/api/products", async (req, res) => {

      //MEDEBUG: hardcoded

      let products = await client.findAll("products");
      res.send(products);

      /*
      let products = [
        {
          "_id": "67f8ff85687b137ada4e4f29",
          "name": "Test product 1",
          "description": "Awsome product",
          "recommendedWith": "67f90924687b137ada4e4f2a",
          "price": 250
        }
      ];

      res.send(products);
      */
    });

    app.get("/api/c/:collectionName/:id", async (req, res) => {

      let collectionName = req.params.collectionName;

      let documentId;
      try{
        documentId = client.toObjectId(req.params.id);
      }
      catch(theError) {
        res.send(null);
        return;
      }

      let filter = {
        _id: documentId
      };

        let products = await client.findAll(collectionName, filter);
        res.send(products[0]);
    });

    app.post("/api/products", async (req, res) => {
      let productsCollection = await client.getCollection("products");

      console.log("body", req.body);

      let result1 = await productsCollection.insertOne({"name": req.body.name, "price": req.body.price});
      let result2 = await productsCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/api/oop/products/add/", async (req, res) => {
        let newProduct = new Product();

        newProduct.name = "Test OOP";
        newProduct.price = 123;

        await newProduct.save();

        /*
        newProduct.name = "Test OOP 2";
        newProduct.price = 456;

        await newProduct.save();

        res.send({"id": newProduct.id});

        let order = new Order();

        let lineItem = order.addProduct(newProduct, 3);

        lineItem.remove();
        lineItem.setAmount(5);

        order.save();
        */
    });

    app.get("/api/oop/products/", async (req, res) => {

      /*
        let minPrice = 1*req.query.minPrice;

        let query = {price: {$gt: minPrice}};
        let products = await client.findAll("products", query);
*/
        let products = await Product.getAll();
        console.log(products);

        let returnArray = products.map((product) => {
          return {
            id: product.id,
            name: product.getName(),
            price: product.getPrice()
          }
        })

        res.send(returnArray);
    });

    app.post("/cart/:id", async (req, res) => {

        let cart = await Cart.getById(req.params.id);

        let product = await Product.getById(req.body.productId);

        let lineItem = cart.addProduct(product, req.body.amount);

        await cart.save();

        res.send(lineItem.id);
    });

    app.post("/cart/:id/:lineItemId", async (req, res) => {
      let cart = awaitCart.getById(req.params.id);

      let lineItem = cart.getLineItem(req.params.lineItemId);
      lineItem.setAmount(req.body.amount);
      cart.save();

    });

    app.delete("/cart/:id/:lineItemId", async (req, res) => {
      let cart = awaitCart.getById(req.params.id);

      let lineItem = cart.getLineItem(req.params.lineItemId);
      lineItem.remove();
      cart.save();
      
    });

    app.get("/products/:id", async (req, res) => {
        let product = new Product();

        product.id = client.toObjectId(req.params.id);

        await product.load();
        
        res.send({
          id: product.id,
          name: product.getName(),
          price: product.getPrice()
        });
    });

    app.get("/reviews/", async (req, res) => {

        let reviewsCollection = await client.getCollection("reviews");

        /*
        let productsCollection = database.collection("products");
        let usersCollection = database.collection("users");

        let query = {};
        let reviews = await reviewsCollection.find(query).toArray();

        for(let i = 0; i < reviews.length; i++) {
            let review = reviews[i];

            {
                let productId = review.product;

                let query = {_id: productId};
                let products = await productsCollection.find(query).toArray();
    
                review.product = products[0];
            }
            
            {
                let query = {_id: review.user};
                let users = await usersCollection.find(query).toArray();

                let user = users[0];

                delete user["_id"];
    
                review.user = user;
            }
            
        }
        */

        let reviews = await reviewsCollection.aggregate(
            [
              {
                $match: {
                  product: client.toObjectId(
                    '67f90924687b137ada4e4f2a'
                  )
                }
              },
              {
                $lookup: {
                  from: 'products',
                  localField: 'product',
                  foreignField: '_id',
                  as: 'product'
                }
              },
              { $unwind: { path: '$product' } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'user'
                }
              },
              { $unwind: { path: '$user' } },
              { $project: { 'user._id': 0 } }
            ],
            { maxTimeMS: 60000, allowDiskUse: true }
          ).toArray();

        res.send(reviews);
    });

    app.listen(4000, () => {
        console.log("Server started");
    });

    /*
    

    
    console.log("result", products);

    //await productsCollection.insertOne({name: "Test product 4", price: 400})

    products.map((item) => {
        console.log(item.name);
    })*/
}

connect();