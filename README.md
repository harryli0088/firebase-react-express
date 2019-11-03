# Firebase React Express

Test application using Firebase to authenticate a React and Express application

## Tutorials

Front end created following this FANTASTIC tutorial:
https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial#react-router-for-firebase-auth


Server Firebase SDK setup:
https://firebase.google.com/docs/admin/setup/


Generating ID Tokens and validating them on the server side:
https://firebase.google.com/docs/auth/admin/verify-id-tokens


## Environment variables
In the root and client directories, there are .envExample files that show the format that your .env files should have. Copy and paste your Firebase configs info into those files

In the root directory, rename the file to
```
.env
```

In the client directory, rename it either
```
.env.development
```
or
```
.env.production
```
depending on whether you want to use those credentials for production or development
