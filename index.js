const express = require("express");
const path = require("path");
const app = express();
const { Client } = require("pg");
const methodOverride = require("method-override");

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

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//home page
app.get("/home", (req, res) => {
  res.render("home");
});

//end users CRUD
app.get("/endUsers", async (req, res) => {
  const queryText = `select * from pht_db.end_user`;
  const { rows } = await client.query(queryText);
  res.render("endUsers", { users: rows });
});

app.get("/endUsers/addUser", async (req, res) => {
  res.render("addUser");
});

app.post("/endUsers/addUser", async (req, res) => {
  const {
    first_name,
    last_name,
    user_name,
    email,
    contact_number,
    date_of_birth,
    password,
  } = req.body;
  const { rows } = await client.query(
    `select max(user_id) from pht_db.end_user`
  );
  const id = Number(rows[0].max) + 1;
  const queryText = `insert into pht_db.end_user(first_name,last_name,user_name,email,contact_number,date_of_birth,password,user_role,user_id) values('${first_name}','${last_name}','${user_name}','${email}','${contact_number}','${date_of_birth}','${password}','end_user',${id})`;
  await client.query(queryText);
  res.render("addUserResult");
});

app.get("/endUsers/editUser/:id", async (req, res) => {
  const { id } = req.params;
  const queryText = `select * from pht_db.end_user where user_id=${id}`;
  const { rows } = await client.query(queryText);
  res.render("editUser", { user: rows[0] });
});

app.patch("/endUsers/editUser/:id", async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    user_name,
    email,
    contact_number,
    date_of_birth,
    password,
  } = req.body;
  const queryText = `update pht_db.end_user set first_name='${first_name}',last_name='${last_name}',user_name='${user_name}',email='${email}',contact_number='${contact_number}',date_of_birth='${date_of_birth}',password='${password}' where user_id=${id}`;
  await client.query(queryText);
  res.render("editUserResult");
});

app.delete("/endUsers/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  const queryText = `delete from pht_db.end_user where user_id=${id}`;
  await client.query(queryText);
  res.redirect("/endUsers");
});

//products CRUD
app.get("/products", async (req, res) => {
  const queryText = `select * from pht_db.product_details`;
  const { rows } = await client.query(queryText);
  res.render("products", { products: rows });
});

app.listen(80, () => {
  console.log("App serving on port 80");
});
