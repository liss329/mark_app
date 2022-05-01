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
    const data = !errors.isEmpty()
      ? validationMessage(errors, req)
      : databaseCheckMessage(req, res, next);
    data.then((result) => res.render("login", result));
  }
);

const validationMessage = async (errors, req) => {
  return {
    title: "Login",
    content: errors.errors.reduce((previousValue, currentValue) => {
      return previousValue + `<p class="error">${currentValue.msg}</p>`;
    }, ""),
    form: req.body,
  };
};

const databaseCheckMessage = (req, res, next) => {
  return new Promise((resolve, reject) => {
    Users.where("name", "=", req.body.name)
      .where("password", "=", req.body.password)
      .fetch()
      .then((model) => {
        if (model !== null) {
          req.session.login = model.attributes; // ログイン状態の更新
          resolve({
            title: "title",
            content: `<p>ログインしました！<br>
                 トップページに戻ってメッセージを送信下さい。</p>`,
            form: {},
          });
        }
        resolve({
          title: "title",
          content: "<p class=error>名前あるいはパスワードが違います。</p>",
          form: req.body,
        });
      })
      .catch();
  });
};

module.exports = router;
