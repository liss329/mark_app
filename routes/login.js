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

const Users = Bookshelf.Model.extend({
  tableName: "users",
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  const data = {
    title: "Login",
    content: "名前とパスワードを入力して下さい。",
    form: { name: "", password: "" },
  };
  res.render("login", data);
});

router.post("/", function (req, res, next) {
  console.log(req.body);
  console.log(`name:${req.body.name}, password:${req.body.password}`);
  Users.query({
    where: { name: req.body.name },
    andWhere: { password: req.body.password },
  })
    .fetch()
    .then((model) => {
      if (model === null) {
        const data = {
          title: "Login",
          content: "<p class=error>名前あるいはパスワードが違います。</p>",
          form: req.body,
        };
        return res.render("login", data);
      }
      // ログイン処理
      req.session.login = model.attributes;
      console.log(`sessionID: ${req.session.login.id}`);
      const data = {
        title: "Login",
        content: `<p>ログインしました！<br>
          トップページに戻ってメッセージを送信下さい。</p>`,
        form: {},
      };
      res.render("login", data);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
