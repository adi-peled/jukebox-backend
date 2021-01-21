const express = require('express');
const { io } = require('../../server');
const boxService = require('../box/box.service')
const router = express.Router()
console.log(' socket routes');

var boxMap = {}
function createBoxStatus() {
    return {
        userList: [],
        currSong: ''
    }
}

function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus();
    return boxMap[boxId];
}

function leaveBox(socket, io, user, boxId) {
    const newUsersList = boxMap[boxId].userList.filter(u => u._id !== user._id)
    boxMap[boxId].userList = newUsersList;
    console.log(boxMap[boxId].userList);
    io.to(boxId).emit('user leave', boxMap[boxId].userList)
    // if (boxMap[socket.myBox].connectedUsers.length === 0) boxMap[socket.myBox] = null;
    // else io.to(socket.myBox).emit('joined new box', newConnectedUsers);
    socket.leave(boxId);
}

io.on('connection', (socket) => {
    console.log('connected ', socket.id);
    socket.emit('get data')
    socket.on('got data', ({ user, boxId }) => {
        socket.join(boxId)
        const boxStatus = getBoxStatus(boxId)
        const userInBox = boxStatus.userList.find(u => u._id === user._id)
        console.log(boxStatus.userList.length);
        if (boxStatus.userList.length === 0) {
            socket.emit('set song')
        } else {
            socket.emit('set song', boxMap[boxId].currSong)
        }
        if (!userInBox) {
            boxStatus.userList.push({ username: user.username, _id: user._id })
        }
        boxMap[boxId] = boxStatus
        console.log({ boxMap });
        io.to(boxId).emit('user joined', { username: user.username, userList: boxStatus.userList })
        socket.on('typing', (box, username) => {
            socket.broadcast.to(box._id).emit('user is typing', username)
        })
        socket.on('update song', (song) => {
            boxMap[boxId].currSong = song
            socket.broadcast.to(boxId).emit('set song', boxMap[boxId].currSong)
        })
        socket.on('get song', () => {
            socket.broadcast.to(boxId).emit('got song', boxMap[boxId].currSong)
        })

        socket.on('user left', (user) => {
            leaveBox(socket, io, user, boxId)
        })
    })
    socket.on('sendMsg', (data) => {
        box = data.currBox
        io.to(box._id).emit('msgSent', box)
    })
})

module.exports = router