import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { day } from "./code.js";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-kosta:test1234@cluster0.rjvnryf.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", async function (req, res) {
  const foundItems = await Item.find({});
  if (foundItems.length === 0) {
    await Item.insertMany([item1, item2, item3]);
    res.redirect("/");
  } else {
    res.render("list", { listTitle: "Today", newListItems: foundItems });
  }
});

app.post("/", async function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    const foundList = await List.findOne({ name: listName }).exec();
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  }
});

app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    await Item.findByIdAndRemove(checkedItemId);
    res.redirect("/");
  } else {
    const foundList = await List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    );
    res.redirect("/" + listName);
  }
});

app.get("/:customListName", async (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  const foundList = await List.findOne({ name: customListName }).exec();
  if (!foundList) {
    // Create a new list
    const list = new List({
      name: customListName,
      items: defaultItems,
    });

    list.save();
    res.redirect("/" + customListName);
  } else {
    // Show an existing list
    res.render("list", {
      listTitle: foundList.name,
      newListItems: foundList.items,
    });
  }
});

// app.post("/newList", function (req, res) {
//   var item = req.body.newItem;

//   items2.push(item);

//   res.redirect("/newList");
// });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
