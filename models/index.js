var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
});

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  route: {
    type: Sequelize.VIRTUAL,
    get: function(){
      return '/wiki/' + this.urlTitle;
    }
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  }
}, {
  hooks: {
    beforeValidate: function(page){
      if(page.title){
          var str = page.title;
          str = str.toLowerCase();
          str = str.replace(/\s+/g, '_');
          page.urlTitle = str;
      } else {
          page.urlTitle = Math.floor(Math.random() * 1000000);
      }
    }
  }
});

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

Page.belongsTo(User, {as: 'author'});

module.exports = {
  Page: Page,
  User: User
};
