const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const { body, validationResult } = require("express-validator");
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "mark_data.sqlite3",
  },
  useNullAsDefault: true,
});
const Bookshelf = require("bookshelf")(knex);

const Users = Bookshelf.Model.extend({
  tableName: "users",
});

router.get("/", function (req, res, next) {
  if (req.session.login) return res.redirect("/");

  const data = {
    title: "Login",
    content: "名前とパスワードを入力して下さい。",
    form: { name: "", password: "" },
  };

  res.render("login", data);
});

router.post(
  "/",
  body("name", "NAMEは必ず入力して下さい。").notEmpty(),
  body("password", "PASSWORDは必ず入力して下さい。").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    const data = {
      title: "Login",
      content: "",
      form: {},
    };

    if (!errors.isEmpty()) {
      errors.errors.forEach((element) => {
        data.content += `<p class="error">${element.msg}</p>`;
      });
      return res.render("login", data);
    }

    Users.query({
      where: { name: req.body.name },
      andWhere: { password: req.body.password },
    })
      .fetch()
      .then((model) => {
        if (model === null) {
          data.content =
            "<p class=error>名前あるいはパスワードが違います。</p>";
          data.form = req.body;
          return res.render("login", data);
        }
        req.session.login = model.attributes;
        data.content = `<p>ログインしました！<br>
            トップページに戻ってメッセージを送信下さい。</p>`;
        res.render("login", data);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json({ errors: errors.array() });
      });
  }
);

module.exports = router;
