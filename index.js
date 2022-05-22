const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/part', async (req, res) => {
            const query = {}
            const cursor = partsCollection.find(query)
            const parts = await cursor.toArray()
            res.send(parts)
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