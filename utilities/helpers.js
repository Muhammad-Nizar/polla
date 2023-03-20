const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const { version } = require("os");

async function pinataUpload(mediaFile) {
  let data = new FormData();
  data.append("file", mediaFile);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    pinataMetadata: {
      name: "testing",
      keyvalues: {
        env: "testing",
      },
    },
    // pinataContent: {
    //     somekey: "somevalue"
    // },
  });
  data.append("pinataOptions", pinataOptions);

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let response = await axios.post(url, data, {
    maxBodyLength: "Infinity",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: "360d64388d7b245d4e1e",
      pinata_secret_api_key:
        "bd4888afba8337ac0e067f97fb202ba61a1a4820c50f97fdd65264115bde6043",
    },
  });
  if (response) {
    console.log(response);
    return response.data.IpfsHash;
  } else {
    return null;
  }
}

async function bodying(body, req, cascade = false) {
  const { curly } = require("node-libcurl");
  const { table_page } = require("../utilities/blockchain/listing_tables");
  const { mit } = require("../config/const");

  if (body.ipfs) {
    body.ipfs_link = body.ipfs;
  }
  if (!body.ipfs_link) {
    return "";
  }
  const { statusCode, data, headers } = await curly.get(body.ipfs_link, {
    SSL_VERIFYHOST: false,
    SSL_VERIFYPEER: false,
  });
  var ipfshash = crypto.createHash("sha512").update(data).digest("hex");
  if (ipfshash != body.hash) {
    return false;
  } else {
    if (req.query.json) {
      //TODO
    }
    if (req.query.xml) {
      //TODO
    }
    if (req.query.text) {
      body.text = data.replace(/<[^>]*>?/gm, "");
    }
    body.html = data;
    if (cascade) {
      v = await table_page(mit.policies, true, 1, body.polla_id, body.polla_id);
      const polla = v.rows[0];
      body.title = polla.title;
      body.owner_id = polla.owner_id;
      body.domain_url = polla.domain_url;
      body.domain_id = polla.domain_id;
      body.allow_approve = polla.allow_approve;
      body.allow_approve_per_version = polla.allow_approve_per_version;
      body.show_old_versions = polla.show_old_versions;

      v = await table_page(mit.owners, true, 1, polla.owner_id, polla.owner_id);
      const owner = v.rows[0];
      body.owner_name = owner.owner_name;
      body.logo = owner.logo;
      body.default_lang = owner.default_lang;
    }
    return body;
  }
}

function hexToBytes(hex) {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

//Encrypting text
function encrypt(text, key, iv) {
  console.log(key, iv);
  var typedArray = new Uint8Array(
    key.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    })
  );

  let cipher = crypto.createCipheriv("aes-256-cbc", typedArray, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

// Decrypting text
function decrypt(text, key, iv) {
  console.log(key, iv);

  let encryptedText = Buffer.from(text, "hex");
  var typedArray = new Uint8Array(
    key.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    })
  );
  var typedArray2 = new Uint8Array(
    iv.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    })
  );
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    typedArray,
    typedArray2
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function sendEmail(to, name, title, version, policy_id, body_id, trx) {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "eng.m.nizar@gmail.com",
      pass: "",
    },
  });

  var mailOptions = {
    from: "eng.m.nizar@gmail.com",
    to: to,
    subject: "Approve Policy - " + title + " v" + version,
    text:
      "Hi " + name +
      "<br>TRX: " +
      trx +
      "<br>policy_id: " +
      policy_id +
      "<br>body_id: " +
      body_id +
      "<br>",
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports.pinataUpload = pinataUpload;
module.exports.bodying = bodying;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.sendEmail = sendEmail;
