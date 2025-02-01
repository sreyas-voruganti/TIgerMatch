const mongoose = require("mongoose");
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const authMiddleware = require("./auth.middleware");
const newData = require("./newData2.json");
const User = require("./User");
const Match = require("./Match");

const client = new OAuth2Client({
  clientId:
    "302045945633-662pesqfu2tteb6t8r3i6fj2qa82h181.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "postmessage",
});

async function verifyCode(code) {
  let { tokens } = await client.getToken(code);

  client.setCredentials({ access_token: tokens.access_token });
  const userinfo = await client.request({
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
  });
  return userinfo.data;
}

const app = express();

app.use(express.json());
app.use(cors());

// const people = newData.people.slice(0, 10);
const people = newData.people;

app.get("/", (req, res) => {
  res.json({ people });
});

const getRandomElem = (a) => a[Math.floor(Math.random() * a.length)];

app.get("/next", authMiddleware, async (req, res) => {
  let filteredPeople = [];

  const seenEmails = req.user.yesUsers.concat(req.user.noUsers);

  filteredPeople = people.filter(
    (person) => !seenEmails.includes(person.email)
  );

  if (req.query.years) {
    const years = req.query.years.split(",");
    filteredPeople = filteredPeople.filter((person) =>
      years.includes(person.year)
    );
  }

  res.json({ person: getRandomElem(filteredPeople) });
});

app.post("/auth", async (req, res) => {
  try {
    const googleData = await verifyCode(req.body.code);

    if (googleData.hd !== "princeton.edu") {
      res.status(400).json({ error: "You must use a @princeton.edu account." });
      return;
    }

    const person = people.find((p) => p.email === googleData.email);

    if (!person) {
      res.status(400).json({
        error: "A user with the requested email was not found.",
      });
      return;
    }

    let user = await User.findOne({
      email: googleData.email,
    });
    if (user) {
      user.lastLogin = Date.now();
      await user.save();
    } else {
      user = await User.create({
        email: googleData.email,
        name: googleData.name,
      });
    }

    const token = jwt.sign({ id: user.id }, "secret123");

    res.status(200).json({ user, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/user", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

app.post("/match_action", authMiddleware, async (req, res) => {
  let match = await Match.findOne({
    users: { $all: [req.user.email, req.body.se] },
  });

  if (match && match.creator === req.user.email) {
    res.sendStatus(400);
    return;
  }

  if (req.body.action === "accept") {
    req.user.yesUsers.push(req.body.se);
  } else {
    req.user.noUsers.push(req.body.se);
  }
  await req.user.save();

  if (match) {
    if (match.status === "pending") {
      if (req.body.action === "accept") {
        match.status = "matched";
      } else {
        match.status = "dead";
      }
      await match.save();
    }
  } else {
    match = await Match.create({
      users: [req.user.email, req.body.se],
      creator: req.user.email,
      status: req.body.action === "accept" ? "pending" : "dead",
    });
  }

  res.sendStatus(200);
});

/*
MATCH STATES
1. matched - both said yes
2. pending - one said yes, awaiting other
3. dead - one said no
*/

// match action flow
/*
  1. check if there is a match
  2. if the match is pending & action yes then make it matched
  3. if the match is dead, do nothing
  4. if there is no match, make one and set it to pending

*/

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tigermatch1");
  console.log("Successfully connected to DB");
}

main()
  .then(() =>
    app.listen(8000, () => console.log("Server listening on port 8000"))
  )
  .catch((err) => console.log(err));
