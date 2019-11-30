import {gql} from "apollo-server-core";

export default gql`
    extend type Query {
        me: User!
        users: [User!]!
        user (id: ID!): User
    }
    type User {
        id: ID! 
        username: String!
        messages: [Message!]
        email: String!
    }
    extend type Mutation {
        signUp(username: String!, password:String!, email: String!): Token!
        signIn(loginString:String, password: String!): Token!
        deleteUser(id: ID!): Boolean!
    }
    type Token {
        token: String!,
        user: User!
    }
`;
