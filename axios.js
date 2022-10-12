const fs = require("fs");
const mp3 = require("youtube-mp3-downloader")
const ffmpeg = require("ffmpeg-static")
const yd = new mp3(
    {
        ffmpegPath:ffmpeg,
        outputPath:"./.tmp/",
        youtubeVideoQuality:"highestaudio",
        "queueParallelism": 2, 
    }
)
yd.download("1LwJneD17ds",":).mp3")
yd.on("progress", function(progress) {
    console.log(JSON.stringify(progress));
});