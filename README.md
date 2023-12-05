# API Documentation

This documentation provides guidelines on how to use the User API, a simple Express application for managing user data stored in a JSON file.

## Getting Started

Follow these steps to set up and use the User API:

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Usage

1. Start the server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`.

2. Use your preferred API testing tool (e.g., Postman, cURL) to interact with the API.

## Endpoints

### 1. GET /users

Retrieve a list of users based on optional query parameters.

**Parameters:**
- Query Parameters (optional):
  - `id` (integer): Filter users by ID.
  - `name` (string): Filter users by name.
  - `email` (string): Filter users by email.
  - `city`, `street`, `suite`, `zipcode` (string): Filter users by address fields.
  - `company` (string): Filter users by company name.

**Example:**
```bash
GET http://localhost:3000/users?id=1&city=New York
```

### 2. POST /users

Add a new user to the system.

**Request Body:**
- JSON object representing the new user.

**Example:**
```json
POST http://localhost:3000/users

{
  "name": "John Doe",
  "email": "john@example.com",
  "address": {
    "city": "New York",
    "street": "123 Main St",
    "suite": "Apt 45",
    "zipcode": "10001"
  },
  "company": {
    "name": "ABC Inc"
  }
}
```

### 3. GET /users/:id

Retrieve a specific user by their ID.

**Parameters:**
- `id` (integer): ID of the user to retrieve.

**Example:**
```bash
GET http://localhost:3000/users/1
```

## Error Handling

- If an error occurs during the API operations, an HTTP 500 status code will be returned with an error message in the response body.

## Notes

- User data is stored in the `users.json` file. Ensure this file exists and has the correct structure before using the API.

## Conclusion

You have successfully set up and used the User API. Refer to the provided examples and adjust the requests according to your needs. For any issues or questions, refer to the [repository](<repository-url>) or contact the API maintainer.