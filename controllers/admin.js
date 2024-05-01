var mysql = require("mysql");
var formidable = require("formidable");
const path = require("path");
const fs = require("fs");

const { Pool } = require("pg");

const pool = new Pool({
  user: "hotel", // Change this to your PostgreSQL username
  host: "localhost",
  database: "hotel",
  password: "hotel", // Change this to your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// login get request
// exports.getLogin = (req, res, next) => {
//     if (req.session.admin == undefined) {
//         res.render('admin/login', { msg: "", err: "" });
//     }
//     else {
//         var connectDB = mysql.createConnection({
//             host: "localhost",
//             user: "root",
//             password: "",
//             database: "hotel"
//         });
//         data1 = "SELECT * " +
//             "FROM  bookingstatus " +
//             "WHERE status = 0 ";
//         connectDB.query(data1, (err1, result1) => {
//             if (err1) throw err1;
//             else {
//                 for (i in result1) {
//                     var a = result1[i].date;
//                     result1[i].date = a.toString().slice(0, 15);
//                 }
//                 return res.render('admin/index', { msg: "", err: "", data: result1 });
//             }
//         })
//     }

// }

exports.getLogin = (req, res, next) => {
  if (req.session.admin == undefined) {
    res.render("admin/login", { msg: "", err: "" });
  } else {
    const data1 = "SELECT * FROM bookingstatus WHERE status = 0";
    pool.query(data1, (err1, result1) => {
      if (err1) throw err1;
      else {
        for (const row of result1.rows) {
          const a = row.date;
          row.date = a.toString().slice(0, 15);
        }
        return res.render("admin/index", {
          msg: "",
          err: "",
          data: result1.rows,
        });
      }
    });
  }
};

//login post request
// exports.postLogin = (req, res, next) => {
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   data =
//     "SELECT * " +
//     "FROM admin " +
//     "WHERE name = " +
//     mysql.escape(req.body.name) +
//     "AND pass = " +
//     mysql.escape(req.body.pass);

//   data1 = "SELECT * " + "FROM  bookingstatus " + "WHERE status = 0 ";

//   connectDB.query(data, (err, result) => {
//     if (err) throw err;
//     else {
//       if (result.length) {
//         req.session.admin = result[0].name;
//         connectDB.query(data1, (err1, result1) => {
//           if (err1) throw err1;
//           else {
//             for (i in result1) {
//               var a = result1[i].date;
//               result1[i].date = a.toString().slice(0, 15);
//             }
//             return res.render("admin/index", {
//               msg: "",
//               err: "",
//               data: result1,
//             });
//           }
//         });
//       } else {
//         return res.render("admin/login", {
//           msg: "",
//           err: "Please Check Your Information Again",
//         });
//       }
//     }
//   });
// };

exports.postLogin = (req, res, next) => {
  const data = "SELECT * FROM admin WHERE name = $1 AND pass = $2";
  const values = [req.body.name, req.body.pass];

  const data1 = "SELECT * FROM bookingstatus WHERE status = 0";

  pool.query(data, values, (err, result) => {
    if (err) throw err;
    else {
      if (result.rows.length) {
        req.session.admin = result.rows[0].name;
        pool.query(data1, (err1, result1) => {
          if (err1) throw err1;
          else {
            console.log(result1.rows);
            for (const row of result1.rows) {
              const a = row.date;
              row.date = a.toString().slice(0, 15);
            }
            return res.render("admin/index", {
              msg: "",
              err: "",
              data: result1.rows,
            });
          }
        });
      } else {
        return res.render("admin/login", {
          msg: "",
          err: "Please Check Your Information Again",
        });
      }
    }
  });
};

//change booking status

// exports.postChnageStatus = (req, res, next) => {
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   var value = 0;

//   if (req.body.click == "Approve") {
//     value = 1;
//     data =
//       "UPDATE bookingstatus " +
//       " SET  status = " +
//       mysql.escape(value) +
//       " WHERE email = " +
//       mysql.escape(req.body.mail) +
//       " AND type = " +
//       mysql.escape(req.body.type) +
//       " AND category = " +
//       mysql.escape(req.body.cat) +
//       " AND roomWant = " +
//       mysql.escape(req.body.want);
//   } else {
//     data =
//       "DELETE FROM bookingstatus " +
//       " WHERE email = " +
//       mysql.escape(req.body.mail) +
//       " AND type = " +
//       mysql.escape(req.body.type) +
//       " AND category = " +
//       mysql.escape(req.body.cat) +
//       " AND roomWant = " +
//       mysql.escape(req.body.want);
//   }

//   data1 = "SELECT * " + "FROM  bookingstatus " + "WHERE status = 0 ";

//   connectDB.query(data, (err, result) => {
//     if (err) throw err;
//     else {
//       connectDB.query(data1, (err1, result1) => {
//         if (err1) throw err1;
//         else {
//           for (i in result1) {
//             var a = result1[i].date;
//             result1[i].date = a.toString().slice(0, 15);
//           }
//           return res.render("admin/index", { msg: "", err: "", data: result1 });
//         }
//       });
//     }
//   });
// };

exports.postChnageStatus = (req, res, next) => {
  let value = 0;
  let data;
  let values = [
    value,
    req.body.mail,
    req.body.type,
    req.body.cat,
    req.body.want,
  ];

  if (req.body.click == "Approve") {
    value = 1;

    data =
      "UPDATE bookingstatus " +
      "SET status = $1 " +
      "WHERE email = $2 AND type = $3 AND category = $4 AND roomWant = $5";
  } else {
    values = values.slice(1);
    data =
      "DELETE FROM bookingstatus " +
      "WHERE email = $1 AND type = $2 AND category = $3 AND roomWant = $4";
  }

  console.log("data");
  console.log(data);
  console.log("values");
  console.log(values);
  const data1 = "SELECT * FROM bookingstatus WHERE status = 0";

  pool.query(data, values, (err, result) => {
    if (err) throw err;
    else {
      pool.query(data1, (err1, result1) => {
        if (err1) throw err1;
        else {
          for (const row of result1.rows) {
            var a = row.date;
            row.date = a.toString().slice(0, 15);
          }
          return res.render("admin/index", {
            msg: "",
            err: "",
            data: result1.rows,
          });
        }
      });
    }
  });
};

//get add hotel page

exports.getAddHotel = (req, res, next) => {
  res.render("admin/addhotel", { msg: "", err: "" });
};

//add new hotel info

// exports.postAddHotel = (req, res, next) => {
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   //var
//   var cat = "",
//     type = "",
//     cost = 0,
//     avlvl = 0,
//     des = "";
//   var imgPath = "";
//   var wrong = 0;

//   new formidable.IncomingForm()
//     .parse(req)
//     .on("field", (name, field) => {
//       if (name === "cat") {
//         cat = field;
//       } else if (name === "type") {
//         type = field;
//       } else if (name === "cost") {
//         cost = parseInt(field);
//       } else if (name === "avlvl") {
//         avlvl = parseInt(field);
//       } else if (name === "des") {
//         des = field;
//       }
//     })
//     .on("file", (name, file) => {
//       // console.log('Uploaded file', name)
//       //   fs.rename(file.path,__dirname+"a")
//     })
//     .on("fileBegin", function (name, file) {
//       //console.log(mail);

//       var fileType = file.type.split("/").pop();
//       if (fileType == "jpg" || fileType == "png" || fileType == "jpeg") {
//         a = path.join(__dirname, "../");
//         ///  console.log(__dirname)
//         //  console.log(a)
//         if (name === "img") {
//           imgPath = cat + type + cost + "." + fileType;
//         }
//         imgPath = "/assets/img/rooms/" + (cat + type + cost + "." + fileType);
//         file.path =
//           a +
//           "/public/assets/img/rooms/" +
//           (cat + type + cost + "." + fileType); // __dirname
//       } else {
//         console.log("Wrong File type");
//         wrong = 1;
//         res.render("admin/addhotel", { msg: "", err: "Wrong File type" });
//       }
//     })
//     .on("aborted", () => {
//       console.error("Request aborted by the user");
//     })
//     .on("error", (err) => {
//       console.error("Error", err);
//       throw err;
//     })
//     .on("end", () => {
//       if (wrong == 1) {
//         console.log("Error");
//       } else {
//         //saveDir = __dirname + '/uploads/';

//         data =
//           "INSERT INTO `category`(`name`, `type`, `cost`, `available`, `img`, `dec`) " +
//           "VALUES('" +
//           cat +
//           "','" +
//           type +
//           "', '" +
//           cost +
//           "','" +
//           avlvl +
//           "' ,'" +
//           imgPath +
//           "' ,'" +
//           des +
//           "' )";
//         connectDB.query(data, (err, result) => {
//           if (err) {
//             throw err;
//           } else {
//             res.render("admin/addhotel", {
//               msg: "Data Insert Successfuly",
//               err: "",
//             });
//           }
//         });
//       }
//     });
// };

exports.postAddHotel = (req, res, next) => {
  let cat = "";
  let type = "";
  let cost = 0;
  let avlvl = 0;
  let des = "";
  let imgPath = "";
  let wrong = 0;

  new formidable.IncomingForm()
    .parse(req)
    .on("field", (name, field) => {
      if (name === "cat") {
        cat = field;
      } else if (name === "type") {
        type = field;
      } else if (name === "cost") {
        cost = parseInt(field);
      } else if (name === "avlvl") {
        avlvl = parseInt(field);
      } else if (name === "des") {
        des = field;
      }
    })
    .on("fileBegin", function (name, file) {
      const fileType = file.type.split("/").pop();
      if (fileType === "jpg" || fileType === "png" || fileType === "jpeg") {
        const uploadDir = path.join(__dirname, "../public/assets/img/rooms/");
        imgPath = `/assets/img/rooms/${cat}${type}${cost}.${fileType}`;
        file.path = path.join(uploadDir, `${cat}${type}${cost}.${fileType}`);
      } else {
        console.log("Wrong File type");
        wrong = 1;
        res.render("admin/addhotel", { msg: "", err: "Wrong File type" });
      }
    })
    .on("aborted", () => {
      console.error("Request aborted by the user");
    })
    .on("error", (err) => {
      console.error("Error", err);
      throw err;
    })
    .on("end", () => {
      if (wrong === 1) {
        console.log("Error");
      } else {
        const data =
          "INSERT INTO category(name, type, cost, available, img, dec) " +
          "VALUES($1, $2, $3, $4, $5, $6)";
        const values = [cat, type, cost, avlvl, imgPath, des];

        pool.query(data, values, (err, result) => {
          if (err) {
            throw err;
          } else {
            res.render("admin/addhotel", {
              msg: "Data Insert Successfuly",
              err: "",
            });
          }
        });
      }
    });
};

//get update page
exports.getSearch = (req, res, next) => {
  res.render("admin/search", { msg: "", err: "" });
};

//post request
// exports.postSearch = (req, res, next) => {

//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   data =
//     "SELECT * " +
//     "FROM category " +
//     "WHERE name = " +
//     mysql.escape(req.body.cat);

//   connectDB.query(data, (err, result) => {
//     if (err) throw err;
//     else {
//       return res.render("admin/update", { msg: "", err: "", data: result });
//     }
//   });
// };

exports.postSearch = (req, res, next) => {
  const data = "SELECT * FROM category WHERE name = $1";
  const values = [req.body.cat];

  pool.query(data, values, (err, result) => {
    if (err) throw err;
    else {
      return res.render("admin/update", {
        msg: "",
        err: "",
        data: result.rows,
      });
    }
  });
};

//get update page

// exports.getUpdate = (req, res, next) => {
//   // console.log(req.body);
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   data =
//     "SELECT * " +
//     "FROM category " +
//     "WHERE name = " +
//     mysql.escape(req.body.cat) +
//     " AND type = " +
//     mysql.escape(req.body.type) +
//     " AND cost = " +
//     mysql.escape(req.body.cost);

//   connectDB.query(data, (err, result) => {
//     if (err) throw err;
//     else {
//       req.session.info = result[0];
//       res.render("admin/updatePage", { data: result[0] });
//     }
//   });
// };

exports.getUpdate = (req, res, next) => {
  const data =
    "SELECT * FROM category " + "WHERE name = $1 AND type = $2 AND cost = $3";
  const values = [req.body.cat, req.body.type, req.body.cost];

  pool.query(data, values, (err, result) => {
    if (err) throw err;
    else {
      req.session.info = result.rows[0];
      res.render("admin/updatePage", { data: result.rows[0] });
    }
  });
};

//update previous data

// exports.updatePrevData = (req, res, next) => {
//   var connectDB = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "hotel",
//   });

//   data =
//     "UPDATE category " +
//     "SET type = " +
//     mysql.escape(req.body.type) +
//     ", cost = " +
//     mysql.escape(parseInt(req.body.cost)) +
//     ", available = " +
//     mysql.escape(parseInt(req.body.avlvl)) +
//     ", `dec` = " +
//     mysql.escape(req.body.des) +
//     " WHERE name = " +
//     mysql.escape(req.session.info.name) +
//     " AND type = " +
//     mysql.escape(req.session.info.type) +
//     " AND cost = " +
//     mysql.escape(parseInt(req.session.info.cost));

//   connectDB.query(data, (err, result) => {
//     if (err) throw err;
//     else {
//       res.render("admin/search", { msg: "Update Done Successfuly", err: "" });
//     }
//   });
// };

exports.updatePrevData = (req, res, next) => {
  const data =
    "UPDATE category " +
    "SET type = $1, cost = $2, available = $3, dec = $4 " +
    "WHERE name = $5 AND type = $6 AND cost = $7";

  const values = [
    req.body.type,
    parseInt(req.body.cost),
    parseInt(req.body.avlvl),
    req.body.des,
    req.session.info.name,
    req.session.info.type,
    parseInt(req.session.info.cost),
  ];

  pool.query(data, values, (err, result) => {
    if (err) throw err;
    else {
      res.render("admin/search", { msg: "Update Done Successfully", err: "" });
    }
  });
};

//logout
exports.logout = (req, res, next) => {
  req.session.destroy();
  res.render("admin/login", { msg: "", err: "" });
};
