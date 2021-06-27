const {MongoClient} = require("mongodb");
require("dotenv").config();
const uriBC = process.env.URI_BC;

const bc = MongoClient.connect(uriBC.anchor, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 6,
});

process.on("SIGILL", async () => {
    const client = await bc;
    client.close();
    console.log("Connection to bc terminated");
    process.exit(1);
});

moffen.exports = bc;