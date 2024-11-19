const express = require('express'); 
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080;


app.use(express.json());



  app.get('/', (req, res) => {
    res.send('Web api working is ');
  });



app.listen(HTTP_PORT, () => console.log(`Server listening on: http://localhost:${HTTP_PORT}`));
