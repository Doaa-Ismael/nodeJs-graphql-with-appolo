import {gql} from "apollo-server-core";
import subSub, {EVENTS} from './../subscriptions';

export default gql`
    extend type Query {
        messages(limit: Int, cursor: String): [Message!]!
        message(id: ID!): Message!
    }
    type Message {
        id: ID!
        text: String!
        user: User!
        createdAt: Date
    }
    extend type Mutation {
        createMessage(text: String!): Message!
        deleteMessage(id: ID!): Boolean!
    }
    extend type Subscription {
        messageCreated: MessageCreated!
    }
    type MessageCreated {
        message: Message!
    }
`;
