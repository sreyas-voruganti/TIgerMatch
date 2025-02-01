const fs = require("fs");
const people = require("./data.json").people;
const rPeople = require("../rAll.json").rPeople;

const sPeople = [];
const fPeople = [];

for (const person of people) {
  let rPerson = null;

  rPerson = rPeople.find(
    (p) =>
      (p.first_name + " " + p.family_name)?.toLowerCase() ===
      person.name.toLowerCase()
  );

  if (rPerson) {
    person.netid = rPerson.netid;
    person.a_email = person.email.toLowerCase();
    person.email = person.netid + "@princeton.edu";

    sPeople.push(person);
  } else {
    // console.log(person.email);
    fPeople.push(person);
  }
}

console.log(fPeople);

console.log(fPeople.length, "errors");
fs.writeFile(
  "./newData2.json",
  JSON.stringify({ people: sPeople }),
  (error) => {
    if (error) {
      throw error;
    }
  }
);

fs.writeFile("./rAll.json", JSON.stringify({ rPeople }), (error) => {
  if (error) {
    throw error;
  }
});
