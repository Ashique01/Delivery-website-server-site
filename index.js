const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const { ObjectID } = require('bson');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbvkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('delivery_system');
        const databaseCollection = database.collection('delivery_services')
        const databaseCollectionWorker = database.collection('workers');
        const databaseOrderCollection = database.collection('orders')


        //get
        app.get('/services', async (req, res) => {
            const cursor = databaseCollection.find({});
            const services = await cursor.toArray();
            res.send(services);


        })
        app.get('/workers', async (req, res) => {
            const cursor = databaseCollectionWorker.find({});
            const workers = await cursor.toArray();
            res.send(workers);
        })

        //post method Confirm Order
        app.post('/confirmOrder', async (req, res) => {
            const newOrder = await databaseOrderCollection.insertOne(req.body)
            res.send(newOrder)

        })
        //my order
        app.get('/myOrders/:email', async (req, res) => {
            const myOrders = await databaseOrderCollection.find({ email: req.params.email }).toArray()
            res.send(myOrders);
        })
        //cancel order

        app.delete('/cancelOrder/:id', async (req, res) => {
            const cancelOrder = await databaseOrderCollection.deleteOne({
                _id: ObjectID(req.params.id)
            })
            res.send(cancelOrder);
        })
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('delivery system is running');
})
app.listen(port, () => {
    console.log('server is running at port ', port);
})