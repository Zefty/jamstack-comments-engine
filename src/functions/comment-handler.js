'use strict';

var request = require("request");

// populate environment variables locally.
require('dotenv').config()

const URL = "https://peaceful-pothos-a35bae.netlify.app";

/*
  Our serverless function handler
*/
exports.handler = async function (event, context, callback) {

  // get the arguments from the notification
  console.log(event.body)
  var body = JSON.parse(event.body);

  // prepare call to the Slack API
  var slackURL = process.env.SLACK_WEBHOOK_URL  // || "https://hooks.slack.com/services/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"

  console.log(slackURL)

  var slackPayload = {
    "text": "New comment on " + URL,
    "attachments": [
      {
        "fallback": "New comment on the comment example site",
        "color": "#444",
        "author_name": body.data.email,
        "title": body.data.path,
        "title_link": URL + body.data.path,
        "text": body.data.comment
      },
      {
        "fallback": "Manage comments on " + URL,
        "callback_id": "comment-action",
        "actions": [
          {
            "type": "button",
            "text": "Approve comment",
            "name": "approve",
            "value": body.id
          },
          {
            "type": "button",
            "style": "danger",
            "text": "Delete comment",
            "name": "delete",
            "value": body.id
          }
        ]
      }]
  };

  console.log(slackPayload)

  // post the notification to Slack
  request.post({ url: slackURL, json: slackPayload }, function (err, httpResponse, body) {
    var msg;
    if (err) {
      msg = 'Post to Slack failed:' + err;
    } else {
      msg = 'Post to Slack successful!  Server responded with:' + body;
    }
    callback(null, {
      statusCode: 200,
      body: msg
    })
    return console.log(msg);
  });

}
