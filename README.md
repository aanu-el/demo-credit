
## DEMO CREDIT API

This is a MVP (Minimum viable product) wallet service built with Node.js and TypeScript. It provides user authentication (signup and signin), transaction logging, and fund transfer functionalities. The application connects to a MySQL database using Knex.js.

#### Read full documentation here: https://documenter.getpostman.com/view/19301718/2sA3XSBgyk

### Table of Contents

- Installation
- Configuration
- Running the Application
- API Endpoints
- Testing
- License

#### Installation
1. Clone the repository:
````
git clone https://github.com/aanu-el/demo_credit.git
cd demo_credit
````
2. Install dependencies:
```` 
npm install 
````
3. Install MySQL and create a database for the application.

#### Configuration
Create a ````.env```` file in the root of the project using the ````.env-example```` file as a template

#### Running the Application
Start the development server:
````
npm run dev
````
or

````
npm run watch
````


Build the application:
````
npm run build
````

Start the production server:
````
npm start
````

#### API Endpoints

##### Base Route 
- {{ base_url }}/api/v1

##### Auth Routes

- POST /auth/signup
Registers a new user
- POST /auth/signin
Authenticate a user and return a JWT token.

##### User Profile

- GET /user/me
Returns the profile of the current user

##### Transaction Routes
- GET /transact/transfer/history
Get transaction logs for a user. Supports pagination and filtering by date and transaction type.

- POST /transact/fund-wallet
Funds personal wallet

- POST /transact/transfer
Transfer funds between demo-credit users accounts.

- POST /transact/withdraw
Transfer funds to external accounts.

#### Testing
The application uses Jest for testing. Unit tests are provided for the signup and signin controllers, as well as the transactions controller.
##### Running Tests
To run the tests, use:
````
npm test
````
#### License
This project is licensed under the MIT License.