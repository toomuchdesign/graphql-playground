const faker = require('faker');

function randomNumberInRange(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDb() {
  const userNumber = 5;
  const postNumber = 20;
  const commentNumber = 100;

  const generateUsers = () => {
    const entries = [];

    for (let id = 0; id < userNumber; id++) {
        entries.push({
          id,
          name: faker.name.findName(),
          thumbnail: faker.internet.avatar(),
        });
    }

    return entries;
  }

  const generatePosts = () => {
      const entries = [];

      for (let id = 0; id < postNumber; id++) {
          entries.push({
            id,
            title: faker.lorem.sentence(),
            userId: randomNumberInRange(0, userNumber -1),
          });
      }

      return entries;
  }

  const generateComments = () => {
    const entries = [];

    for (let id = 0; id < commentNumber; id++) {
        entries.push({
          id,
          body: faker.lorem.sentence(),
          postId: randomNumberInRange(0, postNumber -1),
          userId: randomNumberInRange(0, userNumber -1),
        });
    }

    return entries;
  }

  return {
    users: generateUsers(),
    posts: generatePosts(),
    comments: generateComments(),
  }
}

module.exports = generateDb;
