const express = require("express");
const { google } = require("googleapis");
const stream = require("stream")
const app = express();
const fs = require("fs");
const upload = require("express-fileupload");
// const { file } = require("googleapis/build/src/apis/file");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const router = require("./login.js");
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);
app.use(upload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
const CLIENT_ID =
  "301993087061-3fkiu1iivnk47amk29904mp6rqofo91e.apps.googleusercontent.com";

const CLIENT_SECRET = "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";

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN =
  "1//043VTVtzXR9CCCgYIARAAGAQSNwF-L9IrNMywrYB3AlLXSyvOI_CMmlUKcKrBoET3WYxSWbD3COhn1-yV6HnbGj89Hi1YYvd-aYU";

const oauth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth,
});

var uploadToDrive = async (data) => {
  try {
    const name = data.name;
    const mType = data.mimetype;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(data.data);

    const response = await drive.files.create({
      requestBody: {
        name: name,
        mimeType: mType,
        parents: ["1wk8oJEG4sygefB4jygL1rnUmrvJ0Hk42"],
      },
      media: {
        mimeType: mType,
        body: bufferStream,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

app.get("/files/:id", (req, res) => {
  var fileId = req.params.id;
  drive.files.get(
    {
      fileId: fileId,
      alt: "media",
    },
    { responseType: "arraybuffer" },
    async function (err, response) {
      const random = uuidv4();
      if (typeof response.data != undefined || null) {
        await fs.writeFile(
          __dirname + "/.tmp/" + random + ".mp3",
          Buffer.from(response.data),
          (err) => {
            if (err) {
              console.log(err);
            }
            res.sendFile(__dirname + "/.tmp/" + random + ".mp3", () => {
              fs.unlink(__dirname + "/.tmp/" + random + ".mp3", (err) => {
                if (err) {
                  throw err;
                }
              });
            });
          }
        );
      } else {
        res.statusCode(404);
      }
    }
  );
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
});
app.get("/local", (req, res) => {
  res.sendFile(`${__dirname}/public/middle.mp3`);
});

app.post("/upload", (req, res) => {
  if (req.files) {
    uploadToDrive(req.files.file);
  }
});
app.get("/upload", (req, res) => {
  res.sendFile(__dirname + "/public/musicPlayer.html");
});

app.get("/music", (req, res) => {
  res.sendFile(__dirname + "/public/index2.html");
});
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log("SERVER ON AT PORT "+PORT));
