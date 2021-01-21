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
    const collection = await dbService.getCollection('song')
    try {
        let songs = await collection.find(criteria).toArray();
        if (filterBy.sortByPrice === 'Low-To-High') {
            songs.sort((a, b) => a.price - b.price)
        } else if (filterBy.sortByPrice === 'High-To-Low') {
            songs.sort((a, b) => b.price - a.price)
        }
        return songs
    } catch (err) {
        throw err;
    }
}

function _buildCriteria(filterBy) {
    let criteria = {}
    if (filterBy.minPrice) {
        criteria = ({
            $and: [{ price: { $lte: Number(filterBy.maxPrice) } },
            { price: { $gte: Number(filterBy.minPrice) } }]
        })
    }
    if (filterBy.subcategory) {
        criteria.subcategory = filterBy.subcategory
    }
    if (filterBy.color) {
        const filterColor = new RegExp(filterBy.color, 'i')
        criteria.colors = { $regex: filterColor }
    }

    if (filterBy.category) {
        criteria.category = filterBy.category
    }
    if (filterBy.type) {
        criteria.type = filterBy.type
    }
    if (filterBy.name) {
        const filterName = new RegExp(filterBy.name, 'i');
        criteria.name = { $regex: filterName }
    }
    return criteria;
}


async function getById(songId) {
    const collection = await dbService.getCollection('song')
    try {
        const song = await collection.findOne({ "_id": ObjectId(songId) })
        return song
    } catch (err) {
        console.log(`ERROR: while finding song ${songId}`)
        throw err;
    }
}

async function remove(songId) {
    const collection = await dbService.getCollection('song')
    try {
        await collection.deleteOne({ "_id": ObjectId(songId) })
    } catch (err) {
        console.log(`ERROR: cannot remove song ${songId}`)
        throw err;
    }
}

async function update(song) {
    const collection = await dbService.getCollection('song')
    const songId = song._id
    delete song._id
    try {
        await collection.replaceOne({ "_id": ObjectId(songId) }, song)
        // await collection.updateOne({ _id: song._id }, { $set: song }, { upsert: true })
        return song
    } catch (err) {
        console.log(`ERROR: cannot update song ${song._id}`)
        throw err;
    }
}

async function add(song) {
    const collection = await dbService.getCollection('song')
    try {
        await collection.insertOne(song);
        return song;
    } catch (err) {
        console.log(`ERROR: cannot insert song`)
        throw err;
    }
}




