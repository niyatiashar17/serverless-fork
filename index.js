const functions = require("@google-cloud/functions-framework");

functions.cloudEvent("serverless_verify_email", (cloudEvent) => {
  const base64name = cloudEvent.data.message.data;

  const message = base64name
    ? JSON.parse(Buffer.from(base64Message, "base64").toString())
    : {};

  console.log(`Email, ${email}!`);
});
