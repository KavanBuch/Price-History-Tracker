const express = require("express");
const path = require("path");
const app = express();
const { Client } = require("pg");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const session = require("express-session");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Price_History_Tracker",
  password: "pgadKB02@",
  port: 5432,
});

try {
  client.connect();
  console.log("connected to database");
} catch (err) {
  console.log("cannot connect to database");
  console.log(err);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "topsecretkey" }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, userName, email, contactNumber, dob, password } =
    req.body;
  res.send(req.body);
});

app.get("/category", async (req, res) => {
  const category = await client.query("select * from pht_db.category");
  res.render("category", { category: category.rows });
});

app.get("/category/:id", async (req, res) => {
  const { id } = req.params;
  const queryText = `select * from (select * from pht_db.product_details inner join pht_db.category on product_details.ce_id=category.category_id) as details where details.ce_id=${id}`;
  const category = await client.query(queryText);
  res.render("specificCategory", { category: category.rows });
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const queryText = `select * from (select * from pht_db.product_details inner join pht_db.product_ratings on product_id=p_id inner join pht_db.e_commerce_websites on e_commerce_websites.e_id=web_id) as details where details.p_id=${id}`;
  const { rows } = await client.query(queryText);
  res.render("product", { product: rows });
});

app.listen(80, () => {
  console.log("App serving on port 80");
});
