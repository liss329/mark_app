const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "mark_data.sqlite3",
  },
  useNullAsDefault: true,
});
const Bookshelf = require("bookshelf")(knex);
Bookshelf.plugin("pagination");

const Users = Bookshelf.Model.extend({
  tableName: "users",
});

const Markdata = Bookshelf.Model.extend({
  tableName: "markdata",
  user: function () {
    return this.belongsTo(Users);
  },
});

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.session.login) return res.redirect("/login");
  new Markdata()
    .orderBy("created_at", "DESC")
    .fetchPage({ page: 1, pageSize: 10, withRelated: ["user"] })
    .then((collection) => {
      const data = {
        title: "Top",
        content: collection.toArray(),
        user: req.session.login,
      };
      res.render("index", data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.post("/", (req, res, next) => {
  new Markdata()
    .orderBy("created_at", "DESC")
    .where("content", "like", `%${req.body.search}%`)
    .fetchAll()
    .then((collection) => {
      const data = {
        title: "Top",
        content: collection.toArray(),
        user: req.session.login,
      };
      res.render("index", data);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
