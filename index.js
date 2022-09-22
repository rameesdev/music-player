const axios = require("axios");
var express = require("express")
var app = express()
var x = 0;
app.use(express.static("public"))
app.get("/convert",(req,res)=>{
console.log(req.query)
   var filter= req.query.url.replace("https://www.youtube.com/watch?v=","")
   filter = filter.replace("https://youtu.be/","")
   
 if(filter!==''){const options = {
  method: 'GET',
  url: 'https://yt-api.p.rapidapi.com/dl',
  params: {id: filter},
  headers: {
    'X-RapidAPI-Key': '2fc6de6d37msh54fe8fe8bf30854p180c76jsnf813ffac76f5',
    'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
    x++;
	console.log(x);
   if(response.data.formats[0].url){ res.send(response.data.formats[0].url)}else{res.send(error)}
   
}).catch(function (error) {
	console.error(error);
});}

})
app.listen(80)
