const songService = require('./song.service')
const logger = require('../../services/logger.service')

async function getSong(req, res) {
    const song = await songService.getById(req.params.id)
    res.json(song)
}


async function getSongs(req, res) {
    try {
        const songs = await songService.query(req.query)
        res.send(songs)
    } catch (err) {
        throw err;
    }
}

async function deleteSong(req, res) {
    try {
        await songService.remove(req.params.id)
        res.end()
    } catch (err) {
        console.log('f', { err });
        throw err
    }

}

async function updateSong(req, res) {
    const song = req.body;
    try {
        await songService.update(song)
        res.json(song)
    } catch (err) {
        console.log({ err });
        throw err
    }
}

async function addSong(req, res) {
    const song = req.body;
    try {
        await songService.add(song)
        res.json(song)
    } catch (err) {
        console.log({ err });
        throw err

    }
}


module.exports = {
    getSong,
    getSongs,
    deleteSong,
    updateSong,
    addSong,
}