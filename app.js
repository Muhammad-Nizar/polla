var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

const router = express.Router();
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var { graphqlHTTP } = require("express-graphql");
const schema = require("./schemas/index");
if (process.env.NODE_ENV !== "production") {
  require("longjohn");
}
app.use(express.static("verdom"));
const context = {
  ip: "",
  token: "",
};
const loggingMiddleware = (req, res, next) => {
  context.ip = req.ip;
  context.auth = req.headers.auth;
  context.proof = req.headers.proof;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    context.token = req.headers.authorization.split(" ")[1];
  }
  next();
};
app.use(loggingMiddleware);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    context,
  })
);

app.use("/rest", require("./routes/rest"));

const crypto = require("crypto");
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// Decrypting text
function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

app.use("/", function (req, res) {
  //   var crypto = require("crypto");

  //   var algorithm = "aes256"; // or any other algorithm supported by OpenSSL
  //   var key = "password";
  //   const key0 = crypto.randomBytes(32);
  //   var text = "Objective:   Develop a smart contract with actions to implement the business logic; publish it to testnet then mainnet net   Current state:   Under development";

  //   var cipher = crypto.createCipher(algorithm, key);
  //   var encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  //   var decipher = crypto.createDecipher(algorithm, key);
  //   var decrypted =
  //     decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");

  var hw = encrypt("Welcome to Tutorials Point..."); 
  var crypto = require("crypto");
  var algorithm = "aes-192-cbc"; //algorithm to use
  var secret = "your-secret-key";
  //const key = crypto.scryptSync(secret, 'salt', 24); //create key
  const key = crypto.randomBytes(24);

  var text= "this is the text to be encrypted"; //text to be encrypted
  
  const iv = crypto.randomBytes(16); // generate different ciphertext everytime
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex'); // encrypted text
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
 
  res.status(200).json({
    key: key,
    k: key.toString('hex'),
    kk: Buffer.from(key.toString('hex'), "hex"),
    iv: iv,
    encrypted: encrypted,
    decrypted: decrypted,
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Store backend app listening on port ", process.env.PORT || 3000);
});
