const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('box')
    try {
        let boxes = await collection.find(criteria).toArray();
        return boxes
    } catch (err) {
        throw err;
    }
}

function _buildCriteria(filterBy) {
    let criteria = {}
    if (filterBy.genre) {
        criteria.genre = filterBy.genre
    }
    if (filterBy.name) {
        const filterName = new RegExp(filterBy.name, 'i');
        criteria.name = { $regex: filterName }
    }
    return criteria;
}


async function getById(boxId) {
    const collection = await dbService.getCollection('box')
    try {
        const box = await collection.findOne({ "_id": ObjectId(boxId) })
        return box
    } catch (err) {
        console.log(`ERROR: while finding box ${boxId}`)
        throw err;
    }
}

async function remove(boxId) {
    const collection = await dbService.getCollection('box')
    try {
        await collection.deleteOne({ "_id": ObjectId(boxId) })
    } catch (err) {
        console.log(`ERROR: cannot remove box ${boxId}`)
        throw err;
    }
}

async function update(box) {
    const collection = await dbService.getCollection('box')
    const boxId = box._id
    delete box._id
    try {
        await collection.replaceOne({ "_id": ObjectId(boxId) }, box)
        // await collection.updateOne({ _id: box._id }, { $set: box }, { upsert: true })
        return box
    } catch (err) {
        console.log(`ERROR: cannot update box ${box._id}`)
        throw err;
    }
}

async function add(box) {
    const collection = await dbService.getCollection('box')
    try {
        await collection.insertOne(box);
        return box;
    } catch (err) {
        console.log(`ERROR: cannot insert box`)
        throw err;
    }
}




