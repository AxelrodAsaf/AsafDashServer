const User = require("../models/User");

// When the client calls '/getInfo' using the 'GET' method, the server responds with a JSON array of all the relevant info from the database
exports.getInfo = async (req, res) => {
  var topicArray = [];
  var userObject = {};

  // If there isn't an email in the request...
  if (req.user === undefined) {

    // Get the default user from the User Schema
    const defaultUser = User.schema.obj;

    // Define the 'topic' as the params topic given
    topic = req.params.topic.toLowerCase();

    // Set topicArray as the defaultUser's topic wanted
    topicArray = defaultUser[topic]
    if (topicArray !== undefined) {
      topicArray = topicArray.default
    }

    userObject = { email: null, ...defaultUser };
  }

  // If an email is in the request, try to find the user in the database and retrieve the news array
  else {

    // Using the email given in the request, find the user
    try {
      const user = await User.findOne({ email: req.user });
      topic = req.params.topic.toLowerCase();
      topicArray = user[topic];
      userObject = user;
    }

    // There was an email in the request, but the user was not found in the database, or another error occurred
    catch (error) {
      // Get the default user from the User Schema (to return default data)
      const defaultUser = User.schema.obj;
      topic = req.params.topic.toLowerCase();
      topicArray = defaultUser[topic];
      if (topicArray !== undefined) {
        topicArray = topicArray.default
      }
      userObject = { email: req.user, ...defaultUser };
    }
  }

  // If the client sends a 'topic' that doesn't exist in the schema, return an error
  if (topicArray === undefined) {
    console.log(`\x1b[31m%s\x1b[0m`, `Topic not found in schema: ${topic}`);
    console.log('\x1b[32m%s\x1b[0m', `+----------------------------+`);
    return res.status(404).json({ message: "Topic not found" });
  }

  // Send the data to the client
  console.log(`\x1b[35m%s\x1b[0m`, `'${topic}' data sent to user: '${req.user}'`);
  res.status(200).json({ user: userObject, topicData: topicArray });
}

// When the client calls '/getInfo' using the 'GET' method, the server responds with a JSON array of all the relevant info from the database
exports.getAllInfo = async (req, res) => {
  var userObject = {};

  // If there isn't an email in the request...
  if (req.user === undefined) {
    // Get the default user from the User Schema
    const defaultUser = User.schema.obj;
    userObject = { email: null, ...defaultUser };
  }

  // If an email is in the request, try to find the user in the database and retrieve the news array
  else {
    // Using the email given in the request, find the user
    try {
      const user = await User.findOne({ email: req.user });
      userObject = user;
    }

    // There was an email in the request, but the user was not found in the database, or another error occurred
    catch (error) {
      // Get the default user from the User Schema (to return default data)
      const defaultUser = User.schema.obj;
      userObject = { email: req.user, ...defaultUser };
    }
  }

  // Send the data to the client
  console.log(`\x1b[35m%s\x1b[0m`, `User data sent to user: '${req.user}'`);
  res.status(200).json({ user: userObject });
}

// When the client calls '/updateInfo' using the 'POST' method, the server updates the data in the database
exports.updateInfo = async (req, res) => {
  // If there isn't a user's email in the request, return an error
  if (req.user === undefined) {
    console.error("No user's email in the request while trying to update info");
    return res.status(404).json({ message: "No user found" });
  }

  // Retrieve the 'topic' variable from the request headers
  var topic = req.headers.topic;
  if (topic === undefined) {
    console.error("No topic in the request while trying to update info");
    return res.status(400).json({ message: "No topic specified" });
  }
  topic = topic.toLowerCase();

  // Retrieve the 'updateArray' variable from the request body
  let updateArray = req.body.data[topic];
  console.log(updateArray);
  if ((updateArray === undefined) || (updateArray.length === 0)) {
    if (topic !== 'todolist') {
      console.error("No updateArray in the request while trying to update info");
      return res.status(400).json({ message: "No updateArray specified" });
    }
    // Get the default user from the User Schema
    const defaultUser = User.schema.obj;
    updateArray = defaultUser.todolist.default;
  }


  try {
    // Find the user in the database using their email
    const user = await User.findOne({ email: req.user });
    topic = topic.toLowerCase();

    // Update the user's data in the database with the new 'updateArray' array under the key 'topic'
    user[topic] = updateArray;

    // Save the user to the database
    user.save((err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      console.log(`\x1b[33m%s\x1b[0m`, `'${topic}' updated for user: ${user.email}`);
      return res.status(200).json({ message: `Topic '${topic}' updated for user: ${user.email}` });
    });
  }

  catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
