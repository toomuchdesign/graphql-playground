const {ApolloServer, gql} = require('apollo-server');
const fetch = require('node-fetch');

const restBaseUrl = 'http://localhost:3000';

// Construct a schema, using GraphQL schema language
var typeDefs = gql`
  type User {
    id: ID!
    name: String!
    thumbnail: String!
    posts: [Post]
    comments: [Comment]
  }

  type Post {
    id: ID!
    title: String!
    userId: ID!
    user: User!
    comments: [Comment]
  }

  type Comment {
    id: ID!
    body: String!
    postId: ID!
    userId: ID!
    user: User!
  }

  type Query {
    user(id: ID!): User
    userList: [User]
    post(id: ID!): Post
    postList: [Post]
    comment(id: ID!): Comment
    commentList: [Comment]
  }
`;

// The root provides the top-level API endpoints
var resolvers = {
  Query: {
    user: (_, {id}) =>
      fetch(`${restBaseUrl}/users/${id}`).then(res => res.json()),
    userList: () => fetch(`${restBaseUrl}/users`).then(res => res.json()),
    post: (_, {id}) =>
      fetch(`${restBaseUrl}/posts/${id}`).then(res => res.json()),
    postList: () => fetch(`${restBaseUrl}/posts`).then(res => res.json()),
    comment: (_, {id}) =>
      fetch(`${restBaseUrl}/comments/${id}`).then(res => res.json()),
    commentList: () => fetch(`${restBaseUrl}/comments`).then(res => res.json()),
  },
  User: {
    posts: (parent, args, context, info) => {
      return fetch(`${restBaseUrl}/users/${parent.id}/posts`).then(res =>
        res.json()
      );
    },
    comments: (parent, args, context, info) => {
      return fetch(`${restBaseUrl}/users/${parent.id}/comments`).then(res =>
        res.json()
      );
    },
  },
  Post: {
    comments: (parent, args, context, info) => {
      return fetch(`${restBaseUrl}/posts/${parent.id}/comments`).then(res =>
        res.json()
      );
    },
    user: (parent, args, context, info) => {
      return fetch(`${restBaseUrl}/users/${parent.userId}`).then(res =>
        res.json()
      );
    },
  },
  Comment: {
    user: (parent, args, context, info) => {
      return fetch(`${restBaseUrl}/users/${parent.userId}`).then(res =>
        res.json()
      );
    },
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({typeDefs, resolvers});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
