require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const FoodModel = require("./models/Food");

// Allows us to receive data in JSON format
app.use(express.json());
app.use(cors());

const PASSWORD = process.env.PASSWORD;
const DB_NAME = process.env.DB_NAME;

mongoose.connect(
  `mongodb+srv://Luke:${PASSWORD}@crud-cluster.rcpyork.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// You can search for things by name, or by number of days since you last ate it
// app.get("/read", async (req, res) => {
//   FoodModel.find({ $where: {foodName: "Apple"}})
// });

app.get("/read", (req, res) => {
  FoodModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }

    res.send(result);
  });
});

app.post("/create", async (req, res) => {
  const foodName = req.body.foodName;
  const days = req.body.days;

  const food = new FoodModel({
    foodName: foodName,
    daysSinceIAte: days,
  });

  try {
    await food.save();
    console.log("Done!");
  } catch (err) {
    console.log(err);
  }
});

app.put("/update", async (req, res) => {
  const newFoodName = req.body.newFoodName;
  const id = req.body.id;

  try {
    await FoodModel.findById(id, (err, updatedFood) => {
      updatedFood.foodName = newFoodName;
      updatedFood.save();
      res.send("update");
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await FoodModel.findByIdAndRemove(id).exec();
  res.send("deleted");
});

app.listen(3001, () => {
  console.log(`Server listening on port 3001...`);
});
