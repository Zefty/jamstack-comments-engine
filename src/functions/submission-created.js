'use strict';

var request = require("request");
const { json } = require("stream/consumers");

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
  var slackURL = process.env.SLACK_WEBHOOK_URL

  console.log(slackURL)

  var slackPayload = {
    "text": "New comment on " + URL,
    "attachments": [
      {
        "fallback": "New comment on the comment example site",
        "color": "#444",
        "author_name": body.payload.data.email,
        "title": body.payload.data.path,
        "title_link": URL + body.payload.data.path,
        "text": body.payload.data.comment
      },
      {
        "fallback": "Manage comments on " + URL,
        "callback_id": "comment-action",
        "actions": [
          {
            "type": "button",
            "text": "Approve comment",
            "name": "approve",
            "value": body.payload.id
          },
          {
            "type": "button",
            "style": "danger",
            "text": "Delete comment",
            "name": "delete",
            "value": body.payload.id
          }
        ]
      }]
  };

  console.log(slackPayload)

  // post the notification to Slack
  console.log("Posting to Slack")

  const response = await fetch(
    slackURL,
    {
      method: 'POST',
      headers: {
        // Authorization: `Token ${EMAIL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackPayload),
    }
  );
  let responseText = await response.text();
  console.log('response:', responseText);
  console.log("Done posting to Slack")
  return {
    statusCode: response.status,
    body: responseText,
  };

  // request.post({ url: slackURL, body: JSON.stringify(slackPayload), headers: { 'content-type': 'application/json' } }, function (err, httpResponse, body) {
  //   var msg;
  //   if (err) {
  //     msg = 'Post to Slack failed:' + err;
  //   } else {
  //     msg = 'Post to Slack successful!  Server responded with:' + body;
  //   }
  //   // callback(null, {
  //   //   statusCode: 200,
  //   //   body: msg
  //   // })
  //   console.log(msg);
  // });

  // console.log("Done posting to Slack")

}
