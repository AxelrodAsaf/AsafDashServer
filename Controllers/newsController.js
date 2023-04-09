const axios = require('axios');

exports.getNews = function (req, res) {

  // The user needs to send:
  // Search input
  const userSearch = req.body.searchInput;
  if (!userSearch || userSearch.trim() === '') {
    return res.status(400).json({ error: "Missing or empty search input" });
  }

  // The server needs to already have defined:
  // NewsAPI keys
  const apiKeys = [
    process.env.NEWS_KEY_ONE,
    process.env.NEWS_KEY_TWO,
    process.env.NEWS_KEY_THREE,
    process.env.NEWS_KEY_FOUR,
  ];

  // The server needs to do:
  // Format today's date properly: "YYYY-MM-DD"
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1); // subtract 1 day
  let formattedDate = formatDate(currentDate);

  // Define a function to format a date object into a string in "YYYY-MM-DD" format
  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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

  // Define a function to get the previous day's date in "YYYY-MM-DD" format
  function getPreviousDay() {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1); // subtract 1 day
    return formatDate(currentDate);
  }

  // Set the attempt count to 0
  let newsAPITries = 0;

  // If the attempt count is less than 4, make the request to the NewsAPI
  async function getArticles() {
    if (newsAPITries < 4) {
      try {
        // Make the request (userSearch, formattedDate, and getNextNewsKey are included already)
        const response = await axios.get(searchUrl);
        return response.data.articles.length > 0 ? response.data.articles : await tryPreviousDay();
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

  // Define a function to try the previous day's date if there are no articles
  async function tryPreviousDay() {
    const previousDay = getPreviousDay();
    const previousSearchUrl = "https://newsapi.org/v2/everything?q=" +
      `${userSearch}` +
      "&language=en&from=" +
      `${previousDay}` +
      "&sortBy=popularity&apiKey=" +
      `${getNextNewsKey()}`;

    try {
      const response = await axios.get(previousSearchUrl);
      return response.data.articles;
    } catch (err) {
      newsAPITries++;
      return tryPreviousDay();
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
