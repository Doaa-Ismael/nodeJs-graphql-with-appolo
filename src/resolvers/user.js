import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import {combineResolvers} from 'graphql-resolvers';
import {isAdmin, isAuthenticated} from './authorization';

const createToken = async ({_id, email, username, role}) => await jwt.sign({username, email, _id, role}, 'secret');

export default {
    Query: {
        me:  (parent, args, {me}) => { console.log(me); return me},
        user: async (_, {id}, {models}) => await models.User.findOne({_id: id}),
        users: async (parent, args, {models}) => await models.User.find({}),
    },
    User: {
        messages: async (parent, args, {models}) => {
            console.log(await models.User.findOne({ _id: parent._id}).populate('messages'))
            const messages = (await models.User.findOne({ _id: parent._id}).populate('messages')).messages;
            return messages;
        }
    },
    Mutation: {
        signUp: async (parent, {username, email, password}, {models}) => {
            const user = await models.User.create({username, email, password});
            const token = await createToken(user);
            return {
                token,
                user
            }
        },
        signIn: async (parent, {loginString, password}, {models}) => {
            const user = await models.User.findOne({
                $or: [
                    {username: loginString},
                    {email: loginString}
                ]
            });
            if(!user) {
                throw new UserInputError(
                    'No user found with this login credentials.',
                );
            }
            if(!user.comparePasswords(password, user.password))
                throw new AuthenticationError('Invalid password.');
            const token = await createToken(user);
            return {
                token,
                user
            }

        },
        deleteUser: combineResolvers(
            isAdmin,
            async (parent, {id}, {models}) => {
                const result = await models.User.deleteOne({_id: id});
                return result.deletedCount;
            }
        )
    }
};
