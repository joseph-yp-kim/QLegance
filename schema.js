import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLSchema,
  graphql
} from 'graphql';

const Sequelize = require('sequelize');
// const sequelize = new Sequelize('graph', 'root', '2323');
const sequelize = new Sequelize('postgres://pwfrfcks:Jhi-WHu6KoxqI6Z0f_OJtKBLdIfYjtF8@elmer.db.elephantsql.com:5432/pwfrfcks');

const Post = sequelize.define('post', {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  content: Sequelize.STRING,
  author: Sequelize.STRING
});

Post.sync();

// const GlobalId = new GraphQLObjectType({
//   name: 'GlobalId',
//   fields: () => ({
//     globalId: {type: new GraphQLNonNull(GraphQLString)},
//     query: {type: new GraphQLNonNull(GraphQLString)}
//   });
// });


const PostQL = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLInt)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    createdAt: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
    author: {type: new GraphQLNonNull(GraphQLString)},
  })
});

// const PostQL = new GraphQLObjectType({
//   name: 'Post',
//   fields: () => ({
//     _id: {type: GraphQLInt},
//     title: {type: GraphQLString},
//     createdAt: {type: GraphQLString},
//     content: {type: GraphQLString},
//     author: {type: GraphQLString}
//   })
// });

const Query = new GraphQLObjectType({
  name: 'RootQueries',
  fields: () => ({
    getPostById: {
      type: PostQL,
      args: {
        _id: {type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve(rootValue, args, request) {
        const search = Object.assign({}, args);
        return Post.findOne({where : search});
      }
    },
    getPostByTitle: {
      type: PostQL,
      args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(rootValue, args, request) {
        const search = Object.assign({}, args);
        return Post.findOne({where : search});
      }
    },
    getPostsByAuthor: {
      type: new GraphQLList(PostQL),
      args: {
        author: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(rootValue, args, request) {
        const search = Object.assign({}, args);
        // console.log(search);
        return Post.findAll({where : search});
      }
    },
    getAllPosts: {
      type: new GraphQLList(PostQL),
      args : {
        count : {type: GraphQLInt}
      },
      resolve(rootValue, args, request) {
        // const result = Post.findAll({});
        return Post.findAll({});
        // console.log(Post.findAll({}));
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'MutationQL',
  fields: {
    createPost: {
      type: PostQL,
      args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        author: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: (source, args) => {
        let post = Object.assign({}, args);
        return Post.create(post);
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = {Schema};
