const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000; // You can change this port if needed
const dataFilePath = path.join(__dirname, 'hyperlinks.json');

// Middleware to parse JSON data from requests
app.use(express.json());

// Serve the index.html page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// API endpoint to get all hyperlinks
app.get('/api/hyperlinks', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).json({ error: 'Something went wrong.' });
    }

    try {
      const hyperlinks = JSON.parse(data);
      res.json(hyperlinks);
    } catch (error) {
      console.error('Error parsing data:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  });
});

// API endpoint to add a new hyperlink
app.post('/api/hyperlinks', (req, res) => {
  const { link } = req.body;
  if (!isValidURL(link)) {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).json({ error: 'Something went wrong.' });
    }

    try {
      const hyperlinks = JSON.parse(data) || [];
      hyperlinks.push(link);

      fs.writeFile(dataFilePath, JSON.stringify(hyperlinks), 'utf8', (err) => {
        if (err) {
          console.error('Error writing data:', err);
          return res.status(500).json({ error: 'Something went wrong.' });
        }

        res.status(201).json({ message: 'Hyperlink added successfully.' });
      });
    } catch (error) {
      console.error('Error parsing data:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function isValidURL(url) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}
