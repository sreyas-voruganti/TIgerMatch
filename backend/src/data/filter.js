const fs = require("fs");
const data = require("./data.json");

const allPeople = data.people;

const people28 = allPeople.filter((person) => person.year == "2028");
const people27 = allPeople.filter((person) => person.year == "2027");
const people26 = allPeople.filter((person) => person.year == "2026");
const people25 = allPeople.filter((person) => person.year == "2025");

const newData = {
  allPeople,
  people28,
  people27,
  people26,
  people25,
};

fs.writeFile("./newData.json", JSON.stringify(newData), (error) => {
  if (error) {
    throw error;
  }
});

console.log("done!");
