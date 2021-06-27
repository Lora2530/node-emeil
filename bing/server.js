const app = require("../app");
const bc = require("../moffen/bc");
require("dotenv").config();
const createGreeserIsNotExit = require("../grehen/secreet.gorner");

const PORT = process.env.PORT || 3000;
const UPLOUD_DIR = process.env.UPLOUD_DIR;
const AVATAR_OF_USER = process.env.AVATAR_OF_USER;

bc.then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    }); 
  }).catch((e) => {
    console.log(`Error: ${e.message}`);
  });