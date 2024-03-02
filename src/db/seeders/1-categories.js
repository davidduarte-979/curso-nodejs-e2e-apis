const { CATEGORY_TABLE } = require('../models/category.model');

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert(CATEGORY_TABLE, [
      {
        name: 'Category 1',
        image: 'https://image/200/image.jpg',
        created_at: new Date(),
      },
      {
        name: 'Category 2',
        image: 'https://image/200/image.jpg',
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(CATEGORY_TABLE, null, {});
  },
};
