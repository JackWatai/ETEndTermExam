//JACK WATAI ENCE4A

const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb"); // https://github.com/mongodb/node-mongodb-native
const port = 5050;

// Set up default mongoose connection
const url = "mongodb+srv://Jack4444:Jack1921027@cluster0.tnhlps9.mongodb.net/test";
const client = new MongoClient(url);

const dbName = "clinic";
let db;
client
  .connect()
  .then(async () => {
    db = client.db(dbName);

    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log(err);
    console.log("Unable to connect to Mongodb");
  });

  var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//FIND PATIENT LIST
app.get("/patients/", (req, res) => {
  db.collection("patients")
    .find({})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
    });
});

//FIND PATIENT BY NAME
app.get("/patients/:name", (req, res) => {
  const name = req.params.name;
  db.collection("patients")
    .find({name: String(name)})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
    });
});

//FIND PRESCRIPTION BY NAME AND DATE
app.get("/prescriptions/:name/:date", (req, res) => {
  const name = req.params.name;
  const date = req.params.date;
  db.collection("prescriptions")
    .find({name: String(name),date: String(date)})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
    });
});

//CREATE PATIENT
app.post("/patients", (req, res) => {
  const name = req.body.name;
  const dob = req.body.dob;
  const age = req.body.age;
  const sex = req.body.sex;
  const address = req.body.address;
  db.collection("patients")
   .insert({name, dob, age, sex, address})
   .then((records) => {
      return res.json(records);
  })
   .catch((err) => {
      console.log(err); 
      return res.json({ msg: "There was an error processing your query" });
  })
}); 

//UPDATE PATIENT INFORMATION
app.put("/patients/:name", (req, res) => {
  const name = req.params.name;
  db.collection("patients")
   .updateOne({name: String(name)},{$set:req.body})
   .then((records) => {
      return res.json(records);
   })
   .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
     })
});

 //CREATE PRESCRIPTIONS
app.post("/prescriptions", (req, res) => {
  const name = req.body.name;
  const date = req.body.date;
  const diagnosis = req.body.diagnosis;
  const medications = req.body.medications;
  db.collection("prescriptions")
   .insertOne({name, date, diagnosis, medications})
   .then((records) => {
      return res.json(records);
  })
   .catch((err) => {
      console.log(err); 
      return res.json({ msg: "There was an error processing your query" });
  })
});
  
//ADD MEDICATION BY NAME AND DATE
app.put("/prescriptions/:name/:date", (req, res) => {
  const name = req.params.name;
  const date = req.params.date;
  const medications = req.body.medications;
  db.collection("prescriptions")
    .updateOne({name: String(name),date: String(date)},{$addToSet:{medications}})
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
    });
});

//DELETE MEDICATION
app.put("/medications/:name/:date", (req, res) => {
  const name = req.params.name;
  const date = req.params.date;
  const medications = req.body.medications;
  db.collection("prescriptions")
   .updateOne({name: String(name),date: String(date)},{$pull:{medications}})
   .then((records) => {
      return res.json(records);
   })
   .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
     })
});

//DELETE PRESCRIPTION
app.delete("/prescriptions/:name/:date", (req, res) => {
  const name = req.params.name;
  const date = req.params.date;
  db.collection("prescriptions")
   .deleteOne({name, date})
   .then((records) => {
      return res.json(records);
   })
   .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
     })
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
