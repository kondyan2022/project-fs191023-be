# Power Pulse BACK

# Power Pulse Backend Documentation

Welcome to the backend documentation for the Power Pulse project. This guide provides an overview of the backend functionality, including the API endpoints, authentication, nutrition, training, diary, and optional statistics.

## Deployment and Configuration

## Documentation

1. **API Documentation:** This backend comes with comprehensive API documentation created using the "swagger-ui-express" package. Refer to the Swagger documentation for detailed API information.

## Authentication and Authorization

- **User Registration:** Create a public endpoint for user registration, allowing new users to register. Validate user data, including checking the correctness of the email format and password.

  Fields Required:

  - "name - string, required"
  - "email - string with pattern /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, required"
  - "password - string, min 6, required"

- **User Login:** Create a public endpoint for user login, allowing users to log in with existing accounts. Validate user data, including checking the correctness of the email format and password.

  Fields Required:

  - "email - string with pattern /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, required"
  - "password - string, min 6, required"

- **Token-Based Authentication:** Implement a token-based authentication mechanism for client-side requests, creating an authentication layer to protect access to resources that require authorization.

- **User Profile Management:** Create private endpoints for updating user data, returning current user information, and user logout.

## Nutrition

- **Product Categories:** Create a private endpoint to return all product categories stored in the database (DB).
- **Authorized Products:** Create a private endpoint to return all products authorized for consumption based on the user's blood type or vice versa.

## Training

- **Exercises:** Create private endpoints to return all exercises and types of body parts, muscles, and equipment available in the database (DB).

## Diary

- **Product and Exercise Diary:** Create private endpoints to save products consumed and exercises performed by the user. These are associated with selected dates.

## Statistics (Optional)

- **Statistics Endpoint:** Create a public endpoint that provides information about various statistics related to the application, such as the number of video workouts, total calories burned, registered users, hours spent on workouts, and the number of workouts performed by users.

This backend documentation provides a detailed description of the functionality and API endpoints for the Power Pulse project. For more in-depth information on each endpoint, please refer to the Swagger documentation.

### Команди:

- `npm start` &mdash; starts the server in production mode.
- `npm run start:dev` &mdash; starts the server in development mode.
- `npm run lint` &mdash; runs the code linting checks using ESLint. You should run this before each PR (Pull Request) and fix all linting errors.
- `npm run lint:fix` &mdash; similar to the lint command, but it automatically fixes simple linting errors.

Thank you for using our product!
