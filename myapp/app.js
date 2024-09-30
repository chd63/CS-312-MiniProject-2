var express = require('express');
var app = express();
const bodyParser = require('body-parser');

// inlude the creation of axios
const axios = require('axios');

// set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies (form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// use the css file box-style
app.use(express.static('public'));

// array for jokes
jokeList = [];
idCount = 0;

// index page
app.get('/', function(req, res) {
  res.render('pages/index', {
  });
});


// add user joke
app.post('/joke/add',function(req,res){

  let newjoke = {};
  const jokeType = req.body['joke-type'];
  // make sure to add the flags to prevent inappropriate jokes
  const url = `https://v2.jokeapi.dev/joke/${jokeType}?blacklistFlags=nsfw,racist,sexist,explicit,political,religious`;

  // Make the GET request
  axios.get(url)
  .then(response => {
    const joke = response.data;

    if (joke.type === 'twopart') 
    {
      newjoke.data = `${joke.setup} - ${joke.delivery}`;
    } 
    else 
    {
      newjoke.data = `${joke.joke}`;
    }

    console.log(newjoke.data);
    newjoke.id = idCount;
    idCount += 1;
  
    jokeList.push(newjoke);

    res.render('pages/index', {
      jokeList: jokeList
    });
  })
  .catch(error => {
    console.error('Error fetching joke:', error);
    newjoke.data = "Invalid Joke";

    newjoke.id = idCount;
    idCount += 1;

    jokeList.push(newjoke);

    res.render('pages/index', {
      jokeList: jokeList
    });
  });


   
});


// delete a joke based on its id
app.post('/joke/delete', function(req, res)
{
  var postid = req.body.id;
  for(let i = 0; i < jokeList.length; i++)
  {
    if(jokeList[i].id ==  postid)
    {
      jokeList.splice(i, 1);
      break;
    }
  }
  res.render('pages/index', {
    jokeList: jokeList
  });
});


app.listen(8080);
console.log('Server is listening on port 8080');