var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

let messages = [{
  id: '0',
  content: 'initial value',
  author: 'Mark',
}];

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Message {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    getDie(numSides: Int): RandomDie
    getMessage(id: ID!): Message
  }

  input MessageInput {
    content: String!,
    author: String!,
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// The root provides the top-level API endpoints
var root = {
  getDie: function ({numSides}) {
    return new RandomDie(numSides || 6);
  },
  getMessage: ({id}) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(messages.filter(message => message.id === id)[0])
      }, 2000)
    });
  },
  createMessage: ({input}) => {
    const id = String(messages.length);
    messages.push({
      id,
      ...input,
    });
    return root.getMessage({id});
  },
  updateMessage: ({id, input}) => {
    messages = messages.map(message => {
      if(message.id === id){
        return {
          ...message,
          ...input,
        }
      }
      return message;
    })
    return root.getMessage({id});
  },
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
