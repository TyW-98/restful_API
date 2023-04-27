const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

app
  .route("/articles")
  .get(async (req, res) => {
    try {
      const allArticles = await Article.find();
      res.send(allArticles);
    } catch (error) {
      res.send(error);
    }
  })
  .post(async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });
      await newArticle.save();
      res.send("Successfully added new article");
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteMany({});
      res.send("Deleted all articles");
    } catch (error) {
      res.send(error);
    }
  });

app
  .route("/articles/:articleId")
  .get(async (req, res) => {
    try {
      const selectedArticle = await Article.findOne({
        _id: req.params.articleId,
      });
      if (selectedArticle) {
        res.send(selectedArticle);
      } else {
        res.send("No article with such id was found");
      }
    } catch (error) {
      res.send(error);
    }
  })
  .put(async (req, res) => {
    try {
      const oldArticleTitle = await Article.findOne({ _id: req.params.articleId})
      const updateArticle = await Article.findOneAndUpdate(
        { _id: req.params.articleId },
        { title: req.body.title, content: req.body.content },
        { overwrite: true }
      );
      if (updateArticle) {
        res.send(
          `The following article with the title ${oldArticleTitle.title} has been updated to ${req.body.title}`
        );
      }
    } catch (error) {
      res.send(error);
    }
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
