const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const app = express();
app.set('view engine', 'ejs');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true],
  },
  content: {
    type: String,
    required: [true],
  },
});

const Article = new mongoose.model("Article", articleSchema);

const example1 = new Article({
  title: "The History of Baseball",
  content:
    "Baseball is one of the most popular sports in America, with a rich history dating back to the 19th century. From Babe Ruth to Jackie Robinson, many iconic players have left their mark on the game.",
});

const example2 = new Article({
  title: "Why Eating Vegetables is Important",
  content:
    "Eating vegetables is an important part of a healthy diet. They are rich in vitamins, minerals, and fiber, and can help reduce the risk of chronic diseases like heart disease and cancer.",
});

const defaultItems = [example1, example2];

Article.find().then((article) => {
  if (article.length === 0) {
    Article.insertMany(defaultItems).catch((error) => {
      console.log(error);
    });
  }
});

app.get("/", (req, res) => {
  res.send("Test js file ");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
