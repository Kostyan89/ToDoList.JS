import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
app.use(express.static("public"));

var items = ["Buy Food", "Cook Food", "Eat Food"];
var items2 = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", function (req, res) {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);

  res.render("list", {
    kindOfDay: day,
    newListItems: items,
  });
});

app.get("/work", function (req, res) {
  res.render("list2", {
    kindOfDay: "Work",
    newListItems: items2,
  });
});

app.post("/", function (req, res) {
  var item = req.body.newItem;

  items.push(item);

  res.redirect("/");
});

app.post("/work", function (req, res) {
  var item = req.body.newItem;

  items2.push(item);

  res.redirect("/work");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
