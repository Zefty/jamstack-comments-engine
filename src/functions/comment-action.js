var request = require("request");
const axios = require('axios');
const FormData = require('form-data');

// populate environment variables locally.
require('dotenv').config();
const {
  NETLIFY_AUTH_TOKEN
} = process.env;

// hardcoding this for a moment... TODO: replace request with somethign that follows redirects
const URL = "https://peaceful-pothos-a35bae.netlify.app/";

/*
  delete this submission via the api
*/
function purgeComment(id) {
  var url = `https://api.netlify.com/api/v1/submissions/${id}?access_token=${NETLIFY_AUTH_TOKEN}`;
  request.delete(url, function (err, response, body) {
    if (err) {
      return console.log(err);
    } else {
      return console.log("Comment deleted from queue.");
    }
  });
}


/*
  Handle the lambda invocation
*/
exports.handler = async function (event, context, callback) {
  console.log(event.body);

  // parse the payload
  var body = event.body.split("payload=")[1];
  var payload = JSON.parse(unescape(body));
  var method = payload.actions[0].name;
  var id = payload.actions[0].value;

  console.log(body)
  console.log(payload)
  console.log(method)
  console.log(id)


  if (method == "delete") {
    purgeComment(id);
    callback(null, {
      statusCode: 200,
      body: "Comment deleted"
    });
  } else if (method == "approve") {

    // get the comment data from the queue
    var url = `https://api.netlify.com/api/v1/submissions/${id}?access_token=${NETLIFY_AUTH_TOKEN}`;
    console.log(url);

    await axios.get(url).then(async function (response) {
      console.log(response)
      if (response.status === 200) {
        console.log("response successful")
        // now we have the data, let's massage it and post it to the approved form

        console.log(response.data)
        console.log(response.data.data)

        const formData = new FormData();
        formData.append("form-name", "approved-comments");
        formData.append("path", response.data.data.path);
        formData.append("received", new Date().toString());
        formData.append("email", "jaime.wu011@gmail.com");
        formData.append("name", "jaime");
        formData.append("comment", "dfsgjkg");
        const approvedURL = URL;

        console.log("Posting to", approvedURL);
        console.log(formData);

        // post the comment to the approved lost
        await axios({
          method: 'post', url: approvedURL, data: formData, headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(
          function (response) {
            console.log(response.status);
            if (response.status == 200) {
              msg = 'Post to approved comments list successful.'
              console.log(msg);
              purgeComment(id);
            }
            var msg = "Comment registered. Site deploying to include it.";
            callback(null, {
              statusCode: 200,
              body: msg
            }).catch(function (error) {
              console.log(error)
              msg = 'Post to approved comments failed:' + err;
              console.log(msg);
            })
          }
        )

      }
    })


    // request(url, function (err, response, body) {
    //   if (!err && response.statusCode === 200) {
    //     console.log("response successful")
    //     var data = JSON.parse(body).data;

    //     // now we have the data, let's massage it and post it to the approved form
    //     var payload = {
    //       'form-name': "approved-comments",
    //       'path': data.path,
    //       'received': new Date().toString(),
    //       'email': data.email,
    //       'name': data.name,
    //       'comment': data.comment
    //     };
    //     var approvedURL = URL;

    //     console.log("Posting to", approvedURL);
    //     console.log(payload);

    //     // post the comment to the approved lost
    //     axios({ method: 'post', url: approvedURL, data: payload }).then(
    //       function (response) {
    //         console.log(response.status);
    //         if (response.status == 200) {
    //           msg = 'Post to approved comments list successful.'
    //           console.log(msg);
    //           purgeComment(id);
    //         }
    //         var msg = "Comment registered. Site deploying to include it.";
    //         callback(null, {
    //           statusCode: 200,
    //           body: msg
    //         }).catch(function (error) {
    //           console.log(error)
    //           msg = 'Post to approved comments failed:' + err;
    //           console.log(msg);
    //         })
    //       }
    //     )
    //   }
    // });

  }
}
