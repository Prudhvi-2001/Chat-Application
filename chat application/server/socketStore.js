const userSocketMap = new Map();

const setUserSocket = (userId, socketId) => {
    userSocketMap.set(userId.toString(), socketId);
};

const getUserSocket = (userId) => {
    return userSocketMap.get(userId.toString());
};

const removeUserSocket = (socketId) => {
    for (const [userId, sid] of userSocketMap.entries()) {
        if (sid === socketId) {
            userSocketMap.delete(userId);
            break;
        }
    }
};

module.exports = {
    setUserSocket,
    getUserSocket,
    removeUserSocket,
    userSocketMap
};
