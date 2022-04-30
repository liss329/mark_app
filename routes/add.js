const express = require('express');
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

const Markdata = Bookshelf.Model.extend({
    tableName: "markdata",
    user: function(){
        return this.belongsTo(Users);
    }
});

router.get("/", (req, res, next) => {
    const data = {
        title: "Add",
    };
    res.render("add", data);
});

router.post("/", (req, res, next) => {
    console.log("post acsses");
    const data = {
        user_id: req.session.login.id,
        title: req.body.title,
        content: req.body.content,
    }
    new Markdata(data).save().then((collection) => {
        res.redirect("/");
    });
});

module.exports = router;
