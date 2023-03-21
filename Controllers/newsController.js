const axios = require('axios');

exports.getNews = function (req, res) {
  console.log(`Initializing attempt to get news...`);

  // The user needs to send:
  // Search input
  const userSearch = req.body.searchInput;
  if (!userSearch || userSearch.trim() === '') {
    return res.status(400).json({ error: "Missing or empty search input" });
  }

  console.log(`___________RECOGNIZED SEARCH INPUT: ${userSearch}`);
  // The server needs to already have defined:
  // NewsAPI keys
  const apiKeys = [
    "6b4371ea45744fdf87de113942f6b4f3",
    "034d8076f89846f0825e0597f0b86436",
    "0632572e209741d1ab2c411be921a1fc",
    "2023604cc05c4d5089f789c3e203cf04",
  ];

  // The server needs to do:
  // Format today's date properly: "YYYY-MM-DD"
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;


  // Swap between API keys if needed
  let currentKeyIndex = 0;

  const getNextNewsKey = () => {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    return apiKeys[currentKeyIndex];
  };

  // Build the URL properly using the user's search input, date, and API key
  let searchUrl = "https://newsapi.org/v2/everything?q=" +
    `${userSearch}` +
    "&language=en&from=" +
    `${formattedDate}` +
    "&sortBy=popularity&apiKey=" +
    `${getNextNewsKey()}`;

  // Set the attempt count to 0
  let newsAPITries = 0;

  // If the attempt count is less than 4, make the request to the NewsAPI
  async function getArticles() {
    if (newsAPITries < 4) {
      try {
        // Make the request (userSearch, formattedDate, and getNextNewsKey are included already)
        console.log("Attempting to make request...");
        const response = await axios.get(searchUrl);
        console.log("Returning response...");
        return response.data.articles;
      } catch (err) {
        newsAPITries++;
        searchUrl = searchUrl.replace(apiKeys[currentKeyIndex], getNextNewsKey());
        return getArticles();
      }
    } else {
      console.error(`AsafError: Error with search attempts. Response says too many requests.`);
      return res.status(500).json({ error: "Too many requests" });
    }
  }

  getArticles().then((articles) => {
    // Define a replacer function that removes circular references
    const replacer = (key, value) => {
      if (key === 'socket' || key === 'parser') {
        return undefined;
      }
      return value;
    }

    // Use the replacer function to stringify the response data
    const jsonString = JSON.stringify({ articles: articles }, replacer);

    // Send the response with the properly formatted JSON string
    return res.status(200).json(JSON.parse(jsonString));
  })
}
