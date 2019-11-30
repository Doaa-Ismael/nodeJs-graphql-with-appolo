import {combineResolvers} from 'graphql-resolvers';
import {isAuthenticated, isMessageOwner} from './authorization';
import pubSub, { EVENTS } from './../subscriptions';

export default {
    Query: {
        messages: async (parent, {limit = 5, cursor}, {models}) => {
            const query = cursor? { createdAt: { $gt: cursor } } : {};
            return await models.Message.find( query, null, {limit});
        },
        message: async (parent, {id}, {models}) => await models.Message.findOne({_id: id})
    },
    Message: {
        user: async (parent, args, {loaders}) => await loaders.user.load(parent.userId)
    },
    Mutation: {
        createMessage: combineResolvers(
            isAuthenticated,
            async (parent, {text}, {me, models}) => {
                const message = await models.Message.create({text, userId: me._id});
                await models.User.update({_id: me._id},
                    {$push: {messages: message._id}}
                );
                await pubSub.publish(EVENTS.MESSAGE.CREATED,  { messageCreated: {message}});
                return message;
            }),
        deleteMessage: combineResolvers(
            isMessageOwner,
            async (parent, {id}, {models}) => await models.Message.deleteMany({_id: id})
        )
    },
    Subscription: {
        messageCreated: {
            subscribe: () => pubSub.asyncIterator(EVENTS.MESSAGE.CREATED),
        }
    }
}
