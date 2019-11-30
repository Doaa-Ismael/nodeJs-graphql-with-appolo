import mongoose from 'mongoose';
import * as userApi from './api';

describe('users', () => {
    describe('user (id: ID!): User', () => {

        it('returns a user when user can be found', async () => {
            const expectedResult = {
                user: {
                    username: 'Doaa Ismael  ',
                    email: 'dd@dd.dds',
                    id: '56cb91bdc3464f14678934ca'
                }
            };
            const result = await userApi.user({ id: '56cb91bdc3464f14678934ca' });
            expect(result.data.data).toMatchObject(expectedResult);
        });

        it('returns null if user dose not exist', async () => {
            const result = await userApi.user({id: mongoose.Types.ObjectId()});
            expect(result.data.data.user).toBe(null);
        });
    });

    describe('admin user can delete other users', () => {
        let token = null;
        let newUserId = null;
        it('should sign in successfully', async () => {
           const result = await userApi.signIn({
               loginString: 'dd@dd.dds',
               password: 'password123'
           });
           token = result.data.data;
           expect(token).not.toBeNull();
        });

        it('should create new  user successfully', async () => {
            const newUser =  {
                email: "x@x.x2",
                username: "Doduddo2",
                password: "Passwordpassword2"
            };
            const result = await userApi.signUp({...newUser});
            expect(result.data.data.user).toMatchObject(newUser);
        })
    })
});
