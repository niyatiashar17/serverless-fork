const functions = require("@google-cloud/functions-framework");
const mysql = require("mysql");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  key: process.env.MAILGUN_API_KEY,
  username: process.env.MAILGUN_USERNAME,
});

// Create a connection to your database
const pool = mysql.createPool({
  host: process.env.CF_HOST, // replace with your host name
  user: process.env.CF_USERNAME, // replace with your database username
  password: process.env.CF_PASSWORD, // replace with your database password
  database: process.env.CF_DATABASE, // replace with your database name
});
console.log("test");
functions.cloudEvent(process.env.CLOUDFUNCTION_ENTRY_POINT, async (cloudEvent) => {
  const base64name = JSON.parse(
    Buffer.from(cloudEvent.data.message.data, "base64").toString()
  );
  console.log("check base64");
  const email = base64name["username"];
  const firstName = base64name["firstName"];
  const id = base64name["id"];

  // Function to update user in metadata_users table
  const updateUserInMetadata = {
    id: base64name["id"],
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
  };

  try {
    const queryPromise = new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO ${process.env.METADATA_TABLE_NAME} SET ?`,
        updateUserInMetadata,
        (error, results, fields) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          console.log("Inserted" + results.affectedRows + "rows(s).");
          resolve();
        }
      );
    });
    await queryPromise;

    const message = await mg.messages.create(process.env.DOMAIN_NAME, {
      from: process.env.FROM_EMAIL,
      to: [email],
      subject: "Email Verification",
      text: `Hello ${firstName},

      Welcome!!!

      Thank you for registering. Please click on the following link to verify your email address: ${process.env.WEB_URL}?id=${id}
      
      If you did not request this, please ignore this email.`,

      html: `<p>Hello ${firstName},</p>
      <p>Welcome!!!</p>

      <p>Thank you for registering. Please click on the following link to verify your email address: ${process.env.WEB_URL}?id=${id}</p>

      <p>If you did not request this, please ignore this email.</p>`,
    });
    console.log(message);
  } catch (error) {
    console.error(error);
  }
});
