//moduler
var mysql = require("mysql");
const { Pool } = require("pg");

const pool = new Pool({
  user: "hotel", // Change this to your PostgreSQL username
  host: "localhost",
  database: "hotel",
  password: "hotel", // Change this to your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

//authentication check
exports.authentication = (req, res, next) => {
  if (req.session.mail != undefined) {
    next();
  } else {
    res.render("user/home", { user: "" });
  }
};

// show the home page
exports.getHome = (req, res, next) => {
  if (req.session.mail != undefined) {
    return res.render("user/home", { user: req.session.mail });
  } else {
    return res.render("user/home", { user: "" });
  }
};

//show the login page
exports.getLogin = (req, res, next) => {
  res.render("user/loginAccount", { user: "", msg: [], err: [] });
};

//post page of login
// exports.postLogin = (req, res, next) => {

//    var connectDB = mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "",
//       database: "hotel"
//    });

//    data = "SELECT * " +
//       "FROM  user " +
//       "WHERE email = " + mysql.escape(req.body.mail) +
//       " AND password = " + mysql.escape(req.body.pass);

//    connectDB.query(data, (err, result) => {
//       if (err) throw err; // show if any error have
//       else {
//          if (result.length) {
//             req.session.mail = result[0].email;
//             res.render('user/home', {user: result[0].email});
//          }
//          else {
//             res.render('user/loginAccount', { user: "", msg: [], err: ["Please Check Your information again"] });
//          }

//       }
//    })

// }

exports.postLogin = (req, res, next) => {
  const data = 'SELECT * FROM "user" WHERE email = $1 AND password = $2';
  const values = [req.body.mail, req.body.pass];

  pool.query(data, values, (err, result) => {
    if (err) throw err; // show if any error have
    else {
      if (result.rows.length) {
        req.session.mail = result.rows[0].email;
        res.render("user/home", { user: result.rows[0].email });
      } else {
        res.render("user/loginAccount", {
          user: "",
          msg: [],
          err: ["Please Check Your information again"],
        });
      }
    }
  });
};

// show create account page
exports.getCreateAccount = (req, res, next) => {
  res.render("user/createAccount", { user: "", msg: [], err: [] });
};

//get data from user for create account
// exports.postCreateAccount = (req, res, next) => {
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   var p1 = req.body.pass;
//   var p2 = req.body.con_pass;

//   if (p1 != p2) {
//     // if password doesn't match
//     return res.render("user/createAccount", {
//       user: "",
//       msg: [],
//       err: ["Password Doesn't Match"],
//     });
//   }

//   var data =
//     "INSERT INTO user " +
//     " VALUES ( '" +
//     req.body.name +
//     "' ,'" +
//     req.body.mail +
//     "','" +
//     req.body.phone +
//     "','" +
//     p1 +
//     "')";

//   connectDB.query(data, (err, result) => {
//     if (err) throw err; // if db has error, show that
//     else {
//       res.render("user/loginAccount", {
//         user: "",
//         msg: ["Account Create Successfuly"],
//         err: [],
//       }); //show login page
//     }
//   });
// };

exports.postCreateAccount = (req, res, next) => {
  const p1 = req.body.pass;
  const p2 = req.body.con_pass;

  if (p1 !== p2) {
    // if password doesn't match
    return res.render("user/createAccount", {
      user: "",
      msg: [],
      err: ["Password Doesn't Match"],
    });
  }

  const data =
    'INSERT INTO "user" (name, email, phone, password) ' +
    "VALUES ($1, $2, $3, $4)";
  const values = [req.body.name, req.body.mail, req.body.phone, p1];

  pool.query(data, values, (err, result) => {
    if (err) throw err; // if db has error, show that
    else {
      res.render("user/loginAccount", {
        user: "",
        msg: ["Account Created Successfully"],
        err: [],
      }); //show login page
    }
  });
};

//get request for category
exports.getCategory = (req, res, next) => {
  res.render("user/category", { user: req.session.mail });
};

//post request of category
// exports.postCategory = (req, res, next) => {
//   //console.log(req.body);
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   data =
//     "SELECT * " +
//     " FROM  category " +
//     " WHERE name = " +
//     mysql.escape(req.body.cat) +
//     " AND type = " +
//     mysql.escape(req.body.type) +
//     " AND available > 0";

//   connectDB.query(data, (err, result) => {
//     if (err) throw err; //show if error found
//     else {
//       //console.log(result);
//       return res.render("user/showCategory", {
//         user: req.session.mail,
//         rooms: result,
//       });
//     }
//   });
// };

exports.postCategory = (req, res, next) => {
  const data =
    "SELECT * FROM category " +
    "WHERE name = $1 AND type = $2 AND available > 0";
  const values = [req.body.cat, req.body.type];

  pool.query(data, values, (err, result) => {
    if (err) throw err; //show if error found
    else {
      console.log("No Error");
      console.log(result.rows);
      return res.render("user/showCategory", {
        user: req.session.mail,
        rooms: result.rows,
      });
    }
  });
};

// get booking data
exports.postBooking = (req, res, next) => {
  // console.log(req.body);

  res.render("user/bookingConfirm.ejs", {
    user: req.session.mail,
    name: req.body.name,
    type: req.body.type,
    cost: req.body.cost,
  });
};

//post status request

// exports.postStatus = (req, res, next) => {
//   //console.log(req.body);
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });
//   var date = req.body.date;
//   //console.log(date)
//   data =
//     "INSERT INTO bookingstatus " +
//     " VALUES ('" +
//     req.session.mail +
//     "','" +
//     req.body.name +
//     "','" +
//     req.body.type +
//     "','" +
//     req.body.roomWant +
//     "','" +
//     0 +
//     "','" +
//     date +
//     "')";

//   data1 =
//     "SELECT * " +
//     " FROM  bookingstatus " +
//     " WHERE email = " +
//     mysql.escape(req.session.mail);

//   connectDB.query(data, (err, reslt) => {
//     if (err) throw err;
//     else {
//       connectDB.query(data1, (err1, result) => {
//         for (i in result) {
//           var a = result[i].date;
//           a = a.toString();
//           result[i].date = a.slice(0, 15);
//         }
//         res.render("user/statusShow", {
//           user: req.session.mail,
//           msg: "Your booking is placed",
//           err: "",
//           data: result,
//         });
//       });
//     }
//   });
// };

exports.postStatus = (req, res, next) => {
  const date = req.body.date;

  const data =
    "INSERT INTO bookingstatus (email, category, type, roomWant, status, date) " +
    "VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [
    req.session.mail,
    req.body.name,
    req.body.type,
    req.body.roomWant,
    0,
    date,
  ];
  console.log("values");
  console.log(values);

  const data1 = "SELECT * FROM bookingstatus WHERE email = $1";
  const values1 = [req.session.mail];

  pool.query(data, values, (err, reslt) => {
    if (err) throw err;
    else {
      pool.query(data1, values1, (err1, result) => {
        if (err1) throw err1;
        for (const row of result.rows) {
          var a = row.date;
          a = a.toString();
          row.date = a.slice(0, 15);
        }
        res.render("user/statusShow", {
          user: req.session.mail,
          msg: "Your booking is placed",
          err: "",
          data: result.rows,
        });
      });
    }
  });
};

//get status
// exports.getShowStatus = (req, res, next) => {
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   data =
//     "SELECT * " +
//     " FROM  bookingstatus " +
//     " WHERE email = " +
//     mysql.escape(req.session.mail);

//   connectDB.query(data, (err, result) => {
//     if (err) throw err;
//     else {
//       for (i in result) {
//         var a = result[i].date;
//         a = a.toString();
//         result[i].date = a.slice(0, 15);
//       }
//       if (result.length < 1) {
//         res.render("user/statusShow", {
//           user: req.session.mail,
//           msg: "",
//           err: "You dont have any data",
//           data: result,
//         });
//       } else {
//         res.render("user/statusShow", {
//           user: req.session.mail,
//           msg: "",
//           err: "",
//           data: result,
//         });
//       }
//     }
//   });
// };

exports.getShowStatus = (req, res, next) => {
  const data = "SELECT * FROM bookingstatus WHERE email = $1";
  const values = [req.session.mail];

  pool.query(data, values, (err, result) => {
    if (err) throw err;
    else {
      for (const row of result.rows) {
        var a = row.date;
        a = a.toString();
        row.date = a.slice(0, 15);
      }
      if (result.rows.length < 1) {
        res.render("user/statusShow", {
          user: req.session.mail,
          msg: "",
          err: "You don't have any data",
          data: result.rows,
        });
      } else {
        res.render("user/statusShow", {
          user: req.session.mail,
          msg: "",
          err: "",
          data: result.rows,
        });
      }
    }
  });
};

//delete booking request
// exports.deleteBooking = (req, res, next) => {
//   //console.log(req.body);
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   data =
//     "DELETE FROM bookingstatus " +
//     " WHERE email = " +
//     mysql.escape(req.body.mail) +
//     " AND type = " +
//     mysql.escape(req.body.type) +
//     " AND category = " +
//     mysql.escape(req.body.cat) +
//     " AND roomWant = " +
//     mysql.escape(req.body.want);

//   connectDB.query(data, (err, result) => {
//     if (err) throw err;
//     else {
//       next();
//     }
//   });
// };

exports.deleteBooking = (req, res, next) => {
  const data =
    "DELETE FROM bookingstatus " +
    "WHERE email = $1 AND type = $2 AND category = $3";
  console.log("requestBody");
  console.log(req.body);
  const values = [req.body.mail, req.body.type, req.body.cat];
  console.log("values");
  console.log(values);
  pool.query(data, values, (err, result) => {
    if (err) throw err;
    else {
      next();
    }
  });
};

//show contact page
exports.getContact = (req, res, next) => {
  if (req.session.mail == undefined) {
    res.render("user/contact", { user: "" });
  } else {
    res.render("user/contact", { user: req.session.mail });
  }
};

//logout
exports.logout = (req, res, next) => {
  req.session.destroy();
  res.render("user/home", { user: "" });
};
