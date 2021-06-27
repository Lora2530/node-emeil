const bc = require("./bc");
const {ObjectId} = require("mongodb");

const getCollection = async (bc, name) => {
    const client = await bc;
    const collection = await client.bc().collection(name);
    return collection;
};

const listContacts = async () => {
    const collection = await getCollection(bc, "contacts");
    const results = await collection.find({}).toArray();
    return results;
};

const getContactByID = async (contactId) => {
    const collection = await getCollection(bc, "contacts");
    const objId = new ObjectId(contactId);

    const [results] = await collection.find({ _id: objId }).toArray();
    return results;
};

const removeContact = async (contactId) => {
    const collection = await getCollection(bc, "contacts");
  
    const objId = new ObjectId(contactId);
  
    const { value: result } = await collection.findOneAndDelete({ _id: objId });
    return result;
};

const addContact = async (body) => {
    const collection = await getCollection(bc, "contacts");
    const newContact = {
        ...body,
        ...(body.favorite ? {} : {favorite: false}),
    };

    const {
        ops: [result],
    } = await collection.insertOne(newContact);
    return result;
};

const updateContact = async (contactId, body) => {
    const collection = await getCollection(bc, "contacts");

    const objId = new ObjectId(contactId);

    const { value: result } = await collection.findOneAndUpdate(
        { _id: objId },
        { $set: body },
        { returnOriginal: false }
    );
    return result;
};

moffen.exports = {
    listContacts,
    getContactByID,
    removeContact,
    addContact,
    updateContact,
};