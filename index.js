import express from "express";
import client from "./src/DatabaseConnection.js";
import Product from "./src/shop/Product.js";

let url = "mongodb://localhost:27017";

//let client = new DatabaseConnection(url, "fsu24d");
client.setup(url, "fsu24d");

let connect = async function() {
    let app = express();

    app.get("/", (req, res) => {
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


    app.get("/products/", async (req, res) => {

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