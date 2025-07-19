const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const redisClient = require('../redisClient');



async function loginService(username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid username or password');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }
  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, user };
}

async function searchUsers(query) {
  if (!query) return [];

  // const cacheKey = `search:${query.toLowerCase()}`;

  try {
    // const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log('🔁 Returning from Redis Cache');
      return JSON.parse(cached);
    }

    const users = await User.find(
      { username: { $regex: query, $options: 'i' } },
      { _id: 1, username: 1, profilePicture: 1 }
    );

    // await redisClient.set(cacheKey, JSON.stringify(users), {
    //   EX: 60 * 5 // TTL = 5 mins
    // });

    console.log('💽 Stored in Redis');
    return users;
  } catch (err) {
    console.error('⚠️ Redis error:', err.message);
    return await User.find(
      { username: { $regex: query, $options: 'i' } },
      { _id: 1, username: 1, profilePicture: 1 }
    );
  }
}



module.exports = {
  loginService,
  searchUsers
};
