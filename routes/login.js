const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const { body, validationResult } = require("express-validator");

const isInputCorrect = require("./modules/users");

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
    if (!errors.isEmpty()) {
      const data = {
        title: "Login",
        content: errors.errors.reduce((previousValue, currentValue) => {
          return previousValue + `<p class="error">${currentValue.msg}</p>`;
        }, ""),
        form: req.body,
      };
      return res.render("login", data);
    }

    isInputCorrect(req, res, next).then((result) => {
      if (!result) {
        const data = {
          title: "Login",
          content: "<p class=error>名前あるいはパスワードが違います。</p>",
          form: req.body,
        };
        return res.render("login", data);
      }

      const data = {
        title: "Login",
        content: `<p>ログインしました！<br>
             トップページに戻ってメッセージを送信下さい。</p>`,
        form: {},
      };
      return res.render("login", data);
    });
  }
);

module.exports = router;
