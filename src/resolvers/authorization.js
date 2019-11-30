import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import {combineResolvers} from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>{ console.log("ME : ", me); return  me ? skip : new ForbiddenError('Not authenticated as user.') };
export const isMessageOwner = async (parent, {id}, { me, models }) => {
    const message = await models.Message.findOne({_id: id});
    return message.userId === me._id;
};
export const isAdmin = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role } }) => {
        console.log("ME", role)
        return role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.')
    }
);

