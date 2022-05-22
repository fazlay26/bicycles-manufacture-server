const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000
require('dotenv').config()

//middleware
app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nkdwi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('bicycles_manufacturer').collection('parts');
        const orderCollection = client.db('bicycles_manufacturer').collection('orders');
        const reviewCollection = client.db('bicycles_manufacturer').collection('reviews');

        app.get('/part', async (req, res) => {
            const query = {}
            const cursor = partsCollection.find(query)
            const parts = await cursor.toArray()
            res.send(parts)
        })
        //single id data load
        app.get('/part/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const part = await partsCollection.findOne(query)
            res.send(part)
        })
        app.get('/myorder', async (req, res) => {
            const email = req.query.customerEmail
            console.log(email);
            const query = { customerEmail: email }
            const cursor = orderCollection.find(query)
            const parts = await cursor.toArray()
            res.send(parts)
        })
        //order place api:
        app.post('/part', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })
        //update api:
        app.put('/part/:id', async (req, res) => {
            const id = req.params.id
            const updatePart = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedoc = {
                $set: {
                    AvailableQuantity: updatePart.AvailableQuantity
                }
            }
            const result = await partsCollection.updateOne(filter, updatedoc, options)
            res.send(result)
        })
        //review post  backend api:
        app.post('/addreview', async (req, res) => {
            const newReview = req.body
            const result = await reviewCollection.insertOne(newReview)
            res.send(result)
        })
        //review  data load api:
        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

    }
    finally {

    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from bike manufacturer')
})

app.listen(port, () => {
    console.log(`bike manufacturer app listening on port ${port}`)
})