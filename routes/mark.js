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
  hasTimestamps: true,
});

router.get("/", (req, res, next) => {
  const data = {
    title: "Markdown",
  };
  res.render("mark", data);
});

router.get("/:id", (req, res, next) => {
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
        updated: {},
      };
      res.render("mark", data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.post("/:id", (req, res, next) => {
  new Markdata({ id: req.params.id })
    .save({ content: req.body.source }, { patch: true })
    .then((model) => {
      const data = {
        title: "Markdown",
        dataTitle: model.attributes.title,
        source: model.attributes.content,
        id: req.params.id,
        content: markdown.toHTML(model.attributes.content),
        updated: {
          text: "SOURCEの更新に成功しました。",
          time: model.attributes.update_at,
        },
      };
      res.render("mark", data);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
