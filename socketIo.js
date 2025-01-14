const express = require('express')
const {createServer} = require('node:http')
const {join} = require('node:path');
const {Server} = require('socket.io')
const app = express()
const server = createServer(app)
const cors = require('cors')
const io = new Server(server)
/*app.get('/', (req,res)=>{
    res.send('<h1>Hello World</h1>')
})*/

/*app.get('/', (req,res) =>{
    res.sendFile(join(__dirname, 'new jumbo4.html'))
})

io.on('connection', (socket)=>{
 socket.on('chat message',(msg)=>{
        console.log('message:' + msg)
        io.emit('chat message', msg)
    })
})

//io.emit('hello', 'world')

/*io.on('connection', (socket)=>{
    socket.broadcast.emit('hi')
})*/


let storedData = [];
app.use(cors())
app.use(express.json())
// API endpoint to handle data upload
/*app.post('/api/upload', (req, res) => {
  try {
    const dailyData = req.body;

    // Validate the received data (optional, add checks as needed)
    if (!dailyData || typeof dailyData !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Process or store the data (e.g., save to database)
    storedData.push(dailyData);

    console.log('Received data:', dailyData);

    // Send a success response
    res.status(200).json({ message: 'Data received successfully', data: dailyData });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});*/








// Middleware to parse JSON
/*app.use(express.json());

// Endpoint to receive and store data
app.post('/api/upload', (req, res) => {
  try {
    const dailyData = req.body;

    // Validate the received data
    if (!dailyData || typeof dailyData !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Log received data and store it
    console.log('Received data:', dailyData);
    storedData.push(dailyData);

    // Send success response
    res.status(200).json({ message: 'Data received successfully' });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});*/


app.post('/api/upload', (req, res) => {
  try {
    const dailyData = req.body;

    // Validate the received data
    if (!dailyData || typeof dailyData !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Check if data for the same criteria (e.g., date) already exists
    const existingDataIndex = storedData.findIndex(
      (data) => data.date === dailyData.date // Replace `date` with a unique identifier key
    );

    if (existingDataIndex !== -1) {
      // Update the existing row
      storedData[existingDataIndex] = { ...storedData[existingDataIndex], ...dailyData };
    } else {
      // Add new row if no existing entry is found
      storedData.push(dailyData);
    }

    console.log('Updated stored data:', storedData);

    // Send success response
    res.status(200).json({ message: 'Data received and updated successfully' });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Serve dynamically created HTML table
app.get('/', (req, res) => {
  try {
    // Generate HTML table
    const htmlTable = `
      <html>
      <head>
        <title>Daily Data Table</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
          h1 {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>Daily Data Table</h1>
        <table>
          <thead>
            <tr>
              ${Object.keys(storedData[0] || {}).map((key) => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${storedData
              .map(
                (data) =>
                  `<tr>${Object.values(data).map((value) => `<td>${value}</td>`).join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Send the HTML table as the response
    res.send(htmlTable);
  } catch (error) {
    console.error('Error generating table:', error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});


