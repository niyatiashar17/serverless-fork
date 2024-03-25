const functions = require("@google-cloud/functions-framework");
const mailgun = require("mailgun-js");

functions.cloudEvent("serverless_verify_email", (cloudEvent) => {
  const base64name = JSON.parse(
    Buffer.from(cloudEvent.data.message.data, "base64").toString()
  );
  console.log(cloudEvent);

  const message = base64name
    ? JSON.parse(Buffer.from(base64Message, "base64").toString())
    
});
