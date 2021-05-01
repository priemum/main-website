const url = require("url");
const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const app = express();
const MemoryStore = require("memorystore")(session);
const fetch = require("node-fetch");

module.exports = async (client) => {

  const templateDir = path.resolve(`${process.cwd()}${path.sep}html`);
  app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}assets/css`)));
  app.use("/js", express.static(path.resolve(`${templateDir}${path.sep}assets/js`)));
  
//------------- DISCORD LOGIN
   passport.use(new Strategy({
    clientID: global.config.clientid,
    clientSecret: global.config.secret,
    callbackURL: global.config.callback,
    scope: ["identify", "guilds"]
  },
  (accessToken, refreshToken, profile, done) => { 
    process.nextTick(() => done(null, profile));
  }));
  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
const renderTemplate = (res, req, template, data = {}) => {
  const baseData = {
  bot: client,
  path: req.path,
  user: req.isAuthenticated() ? req.user : null
  };
  res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };
  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }
  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL; 
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
     }
    next();
  },
  passport.authenticate("discord"));
  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
      res.redirect(req.session.backURL || '/')
  });
  app.get("/logout", function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });
  
//------------- DISCORD LOGIN

  
//------------- PAGES
  
app.get("/", (req, res) => {
  const Database = require("void.db");
  const db = new Database("./databases/projects.json");
  renderTemplate(res, req, "index.ejs", { req, db })
})

app.get("/404", (req, res) => {
  renderTemplate(res, req, "404.ejs", {})
})
app.get("/youtube", (req, res) => {
  res.redirect("https://www.youtube.com/channel/UCk_JPZ9sya4tQ6uY2WsciwQ")
})
app.get("/twitter", (req, res) => {
  res.redirect("https://twitter.com/VoidDevs")
})
app.get("/patreon", (req, res) => {
  res.redirect("https://www.patreon.com/voiddevelopment")
})
app.get("/discord", (req, res) => {
  res.redirect("https://discord.gg/Qdbq2v8FM4")
})
app.get("/dc", (req, res) => {
  res.redirect("https://discord.gg/Qdbq2v8FM4")
})
app.get("/github", (req, res) => {
  res.redirect("https://github.com/VoidDevsOrg")
})
app.get("*", (req, res) => {
  res.status(404).redirect("/404")
})
//------------- PAGES

  
//------------- SERVER
  app.listen(3000, () => console.log(`Dashboard is up and running on port 3000.`));
//------------- SERVER
};