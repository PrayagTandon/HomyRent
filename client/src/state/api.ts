import { createNewUserInDatabase } from "@/lib/utils";
import { Tenant, Manager } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer${idToken}`)
      }
      return headers;
    }
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async(_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          const endpoint = 
            userRole === "manager" 
            ? `/managers/${user.userId}`
            : `/tenants/${user.userId}`;

            let userDetailsResponse = await fetchWithBQ(endpoint);

            /* If user doesn't exist, then we create a new user and a new user ID */
            if(userDetailsResponse.error && userDetailsResponse.error.status === 404) {
              userDetailsResponse = await createNewUserInDatabase(
                user,
                idToken,
                userRole,
                fetchWithBQ
              )
            }

          return {
            data: {
              cognitoInfo: {...user},
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole
            }
          }  
        } catch(error: any) {
          return {error: error.message || "Couldn't retrieve User information"}
        }
      },
    }),

  }),
});

export const {
  useGetAuthUserQuery,
} = api;


/*
  1. build.query -> Used by Redux toolkit for api calls and it takes two parameters. User(This contains all the data that we receive back from the server) and void(This contains data that we will be sending to the backend). These are all TypeScript typings.

  2. fetchAuthSession(This comes from aws-amplify/auth) ->
    (alias) fetchAuthSession(options?: FetchAuthSessionOptions): Promise<AuthSession>
  import fetchAuthSession
  Fetch the auth session including the tokens and credentials if they are available. By default it does not refresh the auth tokens or credentials if they are loaded in storage already. You can force a refresh with { forceRefresh: true } input.

  3. prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer${idToken}`)
      }
      return headers;
    }
      This lines of code helps to setup the headers for every api calls
*/