const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const markdown = require("markdown").markdown;
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "mark_data.sqlite3",
  },
  useNullAsDefault: true,
});
const Bookshelf = require("bookshelf")(knex);

const Markdata = Bookshelf.Model.extend({
  tableName: "markdata",
});

router.get("/", (req, res, next) => {
  const data = {
    title: "Markdown",
  };
  res.render("mark", data);
});

router.get("/:id", (req, res, next) => {
  console.log(JSON.stringify(req.params.id));
  Markdata.query({ where: { id: req.params.id } })
    .fetch()
    .then((model) => {
      if (!model) return res.redirect("/");
      const data = {
        title: "Markdown",
        dataTitle: model.attributes.title,
        source: model.attributes.content,
        id: req.params.id,
        content: markdown.toHTML(model.attributes.content),
      };
      res.render("mark", data);
    })
    .catch((err) => {});
});

module.exports = router;
