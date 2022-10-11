const express = require("express");
  const stream= require('stream');
const { google } = require("googleapis");
const app = express();
const fs = require("fs");
const upload = require("express-fileupload");
const { file } = require("googleapis/build/src/apis/file");
const { pipeline } = require("stream");
app.use(upload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CLIENT_ID =
  "301993087061-3fkiu1iivnk47amk29904mp6rqofo91e.apps.googleusercontent.com";

const CLIENT_SECRET = "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";

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN =
  "1//043VTVtzXR9CCCgYIARAAGAQSNwF-L9IrNMywrYB3AlLXSyvOI_CMmlUKcKrBoET3WYxSWbD3COhn1-yV6HnbGj89Hi1YYvd-aYU";

const oauth = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth.setCredentials({refresh_token:REFRESH_TOKEN})

const drive = google.drive({
  version:'v3',
  auth:oauth
})

var uploadToDrive =async (data) =>{
try {
 const name = data.name;
 const mType = data.mimetype;
 const bufferStream = new stream.PassThrough();
 bufferStream.end(data.data);
 

const response = await drive.files.create({
  
  requestBody:{
    name:name,
    mimeType:mType,
    parents:['1wk8oJEG4sygefB4jygL1rnUmrvJ0Hk42']
  },
  media:{
    mimeType:mType,
    body:bufferStream
  }
})
console.log(response.data);
} catch (error) {
  console.log(error);
}
}

app.get("/files/:id",(req,res)=>{

 
  
  var fileId=req.params.id;
drive.files.get(
  {
    fileId: fileId,
    alt: "media"
  },
  { responseType: "arraybuffer" },
  async function(err, { data }) {
   await fs.writeFile(__dirname+"/tmp/its working.mp3",Buffer.from(data),(err)=>{console.log(err);
    res.sendFile(__dirname+"/tmp/its working.mp3",()=>{
  
})
    })
  }
);

})


app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/public/home.html")
})



app.post("/upload", (req, res) => {
  if (req.files) {
    
     uploadToDrive(req.files.file)
    
    
  }
});
app.get("/upload", (req, res) => {
  res.sendFile(__dirname + "/public/musicPlayer.html");
});

app.get('/music',(req,res)=>{
res.sendFile(__dirname+"/public/index2.html")
})
const PORT = process.env.PORT||80;
app.listen(PORT, () => console.log("SERVER ON"));
