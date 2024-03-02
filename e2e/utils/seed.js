const bcrypt = require('bcrypt');
const sequelize = require('../../src/db/sequelize');

const { models } = sequelize;

const upSeed = async () => {
  try {
    await sequelize.sync({ force: true });
    const password = '123456';
    const hash = await bcrypt.hash(password, 10);
    await models.User.create({
      email: 'admin@admin.com',
      password: hash,
      role: 'admin',
    });
    await models.Category.bulkCreate([
      {
        name: 'Category 1',
        image: 'https://image/200/image.jpg',
      },
      {
        name: 'Category 2',
        image: 'https://image/200/image.jpg',
      },
    ]);
  } catch (error) {
    console.error(error);
  }
};

const downSeed = async () => {
  await sequelize.drop();
};

module.exports = { upSeed, downSeed };
