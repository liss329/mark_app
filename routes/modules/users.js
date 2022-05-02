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

const isInputCorrect = (req, res, next) => {
  return new Promise((resolve, reject) => {
    Users.where("name", "=", req.body.name)
      .where("password", "=", req.body.password)
      .fetch()
      .then((model) => {
        if (model !== null) {
          req.session.login = model.attributes; // ログイン状態の更新
          resolve(true);
        }
        resolve(false);
      })
      .catch();
  });
};

module.exports = isInputCorrect;
