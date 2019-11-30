import express from 'express';
import {ApolloServer, gql, AuthenticationError} from 'apollo-server-express';
import http from 'http';
import jwt from 'jsonwebtoken';
const { makeExecutableSchema } = require('graphql-tools')
const ConstraintDirective = require('graphql-constraint-directive')
import schema from "./src/schema";
import index from "./src/resolvers";
import models from "./src/models";
import connectDB, {populate} from './src/bootstrap/db';
import loaders from './src/loaders';

const app = express();

const getMe = async (request) => {
  const token =   request.headers['x-token'];
    if (token) {
        try {
            return await jwt.verify(token, 'secret');
        } catch (e) {
            throw new AuthenticationError(
                'Your session expired. Sign in again.',
            );
        }
    }
};

const server = new ApolloServer({
        typeDefs: schema,
        resolvers: index,
        formatError: (error) => {
            let message = ' It can not be that short';
            console.log("Error", error);
            return {
                message,
                error
            }
         },
        context: async ({req, connection}) => {
            if(connection)
                return {models};
            return {
                me: await getMe(req),
                models,
                loaders: {
                    user: loaders.userLoader(models)
                }
            }
        },
    schemaDirectives: { constraint: ConstraintDirective }
    }
);

server.applyMiddleware({app, path: '/graphql'});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
connectDB().then(async connection => {
    const dbName = connection.connections[0].name;
    console.log("Connect to database", dbName);
    if(dbName.includes('test'))
        ;//await populate();
    httpServer.listen({port: 8000}, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
    });
}).catch(e => console.log("Can't connect to database", e));
