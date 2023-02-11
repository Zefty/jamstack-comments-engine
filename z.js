const request = require('request');

const slackPayload = {
    "payload": {
        "data": {
            "email": "jaime.wu011@gmail.com",
            "path": "/",
            "comment": "test"
        },
        "id": 123241234
    }
};

// request.post({ url: "https://peaceful-pothos-a35bae.netlify.app/.netlify/functions/submission-created", json: slackPayload }, function (err, httpResponse, body) {
//     console.log(err);
// })

// request.post({ url: "http://localhost:9999/.netlify/functions/submission-created", json: slackPayload }, function (err, httpResponse, body) {
//     console.log(err);
// })

// request.post({ url: "http://localhost:9999/.netlify/functions/comment-action", json: slackPayload }, function (err, httpResponse, body) {
//     console.log(err);
// })
const URL = "https://peaceful-pothos-a35bae.netlify.app/";
var url = `https://api.netlify.com/api/v1/submissions/63c7e0cc845c4e004e96a4a0?access_token=3g3fzUo1shDzbAng7dZ4xBiLz4lOGFQfNqljNgO384Y`;
console.log(url);
request(url, async function (err, response, body) {
    if (!err && response.statusCode === 200) {
        var data = JSON.parse(body).data;

        // now we have the data, let's massage it and post it to the approved form
        var payload = {
            'form-name': "approved-comments",
            'path': data.path,
            'received': new Date().toString(),
            'email': data.email,
            'name': data.name,
            'comment': data.comment
        };
        var approvedURL = URL;

        console.log("Posting to", approvedURL);
        console.log(payload);
    }
})

