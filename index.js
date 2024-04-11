const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express()
app.use(express.static("public"));
const port = 3000

app.set('view engine', 'ejs')
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const message = 'Select Your Candidate!'
  res.render('index', {
    message: message
  })
})

// Define a single route handler function
app.get("/:page", (req, res) => {
  const page = req.params.page; // Extract the page parameter from the request

  // Check the page parameter and render the corresponding template
  switch (page) {
    case "hostel":
    case "general":
    case "cultural":
    case "sports":
      res.render(page); // Render the corresponding template
      break;
    default:
      res.status(404).send("Page not found"); // Handle invalid page requests
  }
});



mongoose.connect('mongodb://0.0.0.0:27017/pollbooth').then(() => {
    console.log('database connected')
  }).catch(err => {
    console.log('error while connecting to database', err)
  })

const itemsSchema = new mongoose.Schema({
  candidates: String,
  vote: Number
}, { collection: 'results' });

const Item = mongoose.model('results', itemsSchema);

app.post('/submit', (req, res) => {
  const selectedValue = req.body.selectField // Assuming 'selectField' is the name of your select field

  const newArray = [
    { candidates: `${selectedValue}`, vote: 1 }
  ];
  
  async function insertArray() {
    try {
      const result = await Item.insertMany(newArray);
      console.log('Array inserted successfully');
    } catch (error) {
      console.error('Error inserting array:', error);
    }
  }
  
  insertArray();

  res.redirect("/");
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
