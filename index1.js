const axios = require("axios");
var express = require("express");
var app = express();

var x = 0;

app.use(express.static("public"));
app.get("/convert", (req, res) => {
  console.log(req.query);
  var filter = req.query.url.replace("https://www.youtube.com/watch?v=", "");
  filter = filter.replace("https://youtu.be/", "");

  if (filter !== "" && filter.length == 11) {
    const options = {
      method: "GET",
      timeout: 1000 * 5,
      url: "https://yt-api.p.rapidapi.com/dl",
      params: { id: filter },
      headers: {
        "X-RapidAPI-Key": "2fc6de6d37msh54fe8fe8bf30854p180c76jsnf813ffac76f5",
        "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        x++;
        console.log(x + "th url converted successfully");
        if (typeof(response.data.adaptiveFormats[17].url)!== "undefined") {
          res.json(response.data.adaptiveFormats[17].url);
        }
      })
      .catch(function (error) {
        console.error("error");
        res.sendStatus(404);
      });
  } else {
    res.sendStatus(404);
  }
});

var PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log("SERVER ON AT "+PORT);
});
