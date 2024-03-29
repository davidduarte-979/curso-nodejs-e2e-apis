const bcrypt = require('bcrypt');
const { USER_TABLE } = require('../models/user.model');

module.exports = {
  up: async (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkInsert(USER_TABLE, [
      {
        email: 'admin@admin.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin',
        created_at: new Date(),
      },
      {
        email: 'customer@customer.com',
        password: await bcrypt.hash('123456', 10),
        role: 'customer',
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) {
      queryInterface = queryInterface.context;
    }
    return queryInterface.bulkDelete(USER_TABLE, null, {});
  },
};
