const express = require("express");
var router = express.Router();

router.get("/login", (req, res) => {
  if (req.query.username == "admin" && req.query.pass == "admin") {
    req.session.username = "admin";
    res.end("username : " + req.session.username);
  } else {
    res.statusCode(403);
  }
});
router.get("/check", (req, res) => {
  if (typeof req.session.username != undefined) {
    res.end(req.session.username);
    console.log(req.session);
  } else {
    res.statusCode(403);
  }
});
router.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/public/music.gif");
});
router.get("/userdata",(req,res)=>{
    if(req.headers.accept=='*/*'){res.send( [
        {
          name: "Killers From The North Side",
          artist: "Saikudasai",
          src: "files/1eTAAKDB6NIAjuVcGEF6ktFralap2nM4F",
        },
        {
          name: "Secret That Nobody Knows (Slowed+Reverbed)",
          artist: "chris brown",
          src: "files/189G55tXwi8_G9GI0mqHqT9_oKNO4IMe5",
        },
        {
          name: "Murder In My Mind",
          artist: "Reverb",
          src: "files/1pMKrouOcm8Q1jIL-AIz2B5LnImAUqquy",
        },
        {
          name:"Middle Of The Night - VIOLIN",
          artist:"Elley Duhe",
          src:"/local"
        }
      ])}else{res.sendStatus(403)}

      console.log(req.headers)

})
module.exports = router;
