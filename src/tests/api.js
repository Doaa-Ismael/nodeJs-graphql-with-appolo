import axios from 'axios';

const API_URL = 'http://localhost:8000/graphql';

export const user = async variables =>
    axios.post(API_URL, {
        query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
        }
      }
    `,
        variables,
    });

export const signIn = async variables =>
    axios.post(API_URL, {
        query: `
      mutation ($loginString:String!, $password: String!) {
         signIn(loginString: $loginString, password: $password) {
         token
         }
      }
    `,
        variables,
    });

export const signUp = async variables =>
    axios.post(API_URL, {
        query: `
      mutation ($email: String!, $password: String!, $username: String!) {
         signUp(email: $email, password: $password, username: $username) {
            token,
            user {
                id
            }
         }
      }
    `,
        variables,
    });

export const deleteUser = async variables =>
    axios.post(API_URL, {
        query: `
      mutation ($id: ID!) {
        deleteUser(id: $id)
      }
    `,
        variables,
    });
