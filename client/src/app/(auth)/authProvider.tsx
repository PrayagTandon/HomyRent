import React from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

/* https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/ -> COntains the information to connect AWS Cognito with Amplify */

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
            userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!
        }
    }
});

export default function App() {
  return (
    <div className="h-full">
        <Authenticator>
            {() => }      
        </Authenticator>
    </div>
  );
}