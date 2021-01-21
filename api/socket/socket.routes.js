const express = require('express');
const { io } = require('../../server');
const boxService = require('../box/box.service')
const router = express.Router()
console.log(' socket routes');

const boxMap = {}
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

function leaveBox(socket, io, user) {
    const newUsersList = boxMap[socket.currBoxId].userList.filter(u => u._id !== user._id)
    boxMap[socket.currBoxId].userList = newUsersList;
    io.to(socket.currBoxId).emit('user leave', boxMap[socket.currBoxId].userList)
    // if (boxMap[socket.myBox].connectedUsers.length === 0) boxMap[socket.myBox] = null;
    // else io.to(socket.myBox).emit('joined new box', newConnectedUsers);
    socket.leave(socket.currBoxId);
}

io.on('connection', (socket) => {
    console.log('connected ', socket.id);
    socket.on('join box', ({ user, boxId }) => {
        console.log(socket.currBoxId, 'sockettttt curr box id');
        if (socket.currBoxId) {
            if (socket.currBoxId === boxId) return
            leaveBox(socket, io, user)
        }
        socket.currBoxId = boxId
        socket.join(socket.currBoxId)
        const boxStatus = getBoxStatus(boxId)
        const userInBox = boxStatus.userList.find(u => u._id === user._id)
        if (boxStatus.userList.length === 0) {
            socket.emit('set song')
        } else {
            socket.emit('set song', boxMap[boxId].currSong)
        }
        if (!userInBox) {
            boxStatus.userList.push({ username: user.username, _id: user._id })
        }
        boxMap[boxId] = boxStatus
        io.to(boxId).emit('user joined', { username: user.username, userList: boxStatus.userList })
        socket.on('typing', ({box, username}) => {
            console.log({ box, username });
            socket.broadcast.to(box._id).emit('user is typing', username)
        })
        socket.on('update song', (song) => {
            boxMap[socket.currBoxId].currSong = song
            socket.broadcast.to(socket.currBoxId).emit('set song', boxMap[socket.currBoxId].currSong)
        })
        socket.on('get song', () => {
            socket.broadcast.to(boxId).emit('got song', boxMap[boxId].currSong)
        })
    })
    socket.on('sendMsg', ({ currBox }) => {
        io.to(currBox._id).emit('msgSent')
    })
})

module.exports = router