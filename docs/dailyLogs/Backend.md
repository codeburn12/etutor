__14/02/2024__
```
1. Project Setup
    - Install Dependencies :- bcryptjs jsonwebtoken cors cookie-parser dotenv express ioredis mongoose ts-node-dev @types/bcryptjs @types/jsonwebtoken @types/cors @types/cookie-parser @types/express @types/node typescript
    ("@types" makes them available for your TypeScript project. Once installed, you can benefit from TypeScript's static type checking and IntelliSense features.)
    - Created .env (store configuration variables and sensitive information as environment variables(key-value pair)) 
    - Created app.ts (All application last endpoints are here)
    - Created server.ts (Server on which app will run, app is imported here)
```
> Learning
```typescript
1. express() function is called to create an instance of the Express application, and it's assigned to the variable app. This app object is then used to define routes, middleware, and other settings

2. 
// Named Exports:
// app.ts
export const app = /* some value */;
// In another file
import { app } from './app';

// Default Exports
// app.js
const app = /* some value */;
export default app;
// In another file
import app from './app';

3.  
app.use(middleware) is for applying middleware functions that run for all routes.
app.get(path,callback)... is for handling HTTP GET... requests at a specific path.
app.all(path, callback) is for handling requests of any HTTP method at a specific path.

4. Middleware
Functions that have access to the request, response, and the next middleware function in the application's request-response cycle, can perform various tasks, such as logging, authentication, error handling, etc.

5. as any 
 telling TypeScript to stop type-checking for that particular variable

```  
__16,17,19/02/2024__
```
1. Database, redis connection
    -Keys added in .env file for cloudinary, db, redis
    -MongoDB Not connected at remotely(Too much wasted time)
```
__20/02/2024__
```
1. ErrorHandler, error file creation
    -Knowledge about error handling at one place without repeating the same code again and again
    - MongoDb connected at local host
```
__22/02/2024__
```
1. CatchAsync file created
    -For promise return to get rid of callback hell
```
> Learning
```javascript
// Callback Hell(Pyramid, Doom)
// Problem:- Readability, Maintainability,Error handling
function walkDog(callback) {
    setTimeout(() => {
        console.log("walkDOg")
        callback()
    },1500)
}
function cleanKitchen(callback) {
    setTimeout(() => {
        console.log("cleanKitchen")
        callback()
    },1400)
}
function trash(callback) {
    setTimeout(() => {
        console.log("trash")
        callback()
    },400)
}
walkDog(() => {
    cleanKitchen(() => {
        trash(()=>console.log("finaly done"));
    })
})

// Promise :- new Promise((resolve, reject) => {async code})
function walkDog() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const dogWalked = true;
            if(dogWalked) {
                resolve("walkDOg")
            }
            else {
                reject("Not walked the dog")
            }
        },1500)
    })
}
function cleanKitchen() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const kitchenCleaned = true;
            if(kitchenCleaned) {
                resolve("cleanKitchen")
            }
            else {
                reject("Not clean kitchen")
            }
        },1400)
    })
}
function trash() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            const trashClean = false;
            if(trashClean) {
                resolve("trash cleaned")
            }
            else {
                reject("trash not cleaned")
            }
            
        },400)
    })
}
walkDog()
    .then(value => {console.log(value); return cleanKitchen()})
    .then(value => {console.log(value); return trash()})
    .then(value => {console.log(value); console.log("finally done")})
```  
__16/03/2024__
```
1. Higher-order function(see in catchAsyncError.ts)
    -Takes a function as an argument(like take callback)
    -Returns a function

```
>Learning
```typescript
// jwt.sign():- payload (data to be included in the token), a secret key or private key, and optional configuration parameters. The function digitally signs the payload using the provided key to create a token.
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

```