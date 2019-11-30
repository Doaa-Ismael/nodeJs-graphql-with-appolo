import {gql} from "apollo-server-core";
import { GraphQLDateTime } from 'graphql-iso-date';
import messageSchema from "./message";
import userSchema from "./user";

const linkSchema = gql`
    scalar Date
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
    type Subscription {
        _: Boolean
    }
`;

export default [linkSchema, userSchema, messageSchema];
