# MugShot Studio API Documentation & Postman Testing Guide

This guide provides step-by-step instructions on how to test the Authentication endpoints using Postman.

**Base URL:** `http://localhost:8000` (assuming default local setup)

---

## 1. Auth Start
Checks if a user exists and determines the next step (login or signup).

*   **Method:** `POST`
*   **URL:** `{{base_url}}/api/v1/auth/start` 
*   **Description:** Initiates the auth flow.

**Request Body (JSON):**
```json
{
  "email": "user@example.com"
}
```

**Postman Instructions:**
1.  Set method to **POST**.
2.  Enter URL: `http://localhost:8000/api/v1/auth/start`
3.  Go to **Body** tab -> Select **raw** -> Select **JSON**.
4.  Paste the JSON above.
5.  Click **Send**.

**Expected Response (200 OK):**
```json
{
  "exists": false,
  "next": "create_account"
}
```
*(Or `exists: true` if the user is already registered)*

---

## 2. Signup
Registers a new user account.

*   **Method:** `POST`
*   **URL:** `{{base_url}}/api/v1/auth/signup`
*   **Description:** Creates a new user account. New users receive 100 free credits upon registration. Email confirmation is no longer required.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "confirm_password": "securepassword123",
  "username": "cooluser123",
  "full_name": "John Doe",
  "dob": "1990-01-01"
}
```

**Postman Instructions:**
1.  Set method to **POST**.
2.  Enter URL: `http://localhost:8000/api/v1/auth/signup`
3.  Go to **Body** tab -> Select **raw** -> Select **JSON**.
4.  Paste the JSON above.
5.  Click **Send**.

**Expected Response (201 Created):**
```json
{
  "user_id": "uuid-string...",
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "user": { ... },
  "next": "dashboard"
}
```
*Note: Users are automatically logged in after signup. No email confirmation required.*

**Important Configuration Note:**
The application requires proper Supabase configuration with a service role key to bypass row-level security policies. Ensure your `.env` file includes `SUPABASE_SERVICE_ROLE_KEY` with the appropriate key from your Supabase dashboard.

**Error Response (500 Internal Server Error):**
If there are database permission issues, the server will return a more descriptive error message to help with troubleshooting.

---

## 3. Confirm Email
Verifies the user's email address using the token received (simulated in logs).

*   **Method:** `POST`
*   **URL:** `{{base_url}}/api/v1/auth/confirm`
*   **Description:** Confirms the email address.

**Query Parameters:**
*   `token`: The token string from the signup response or backend logs.

**Postman Instructions:**
1.  Set method to **POST**.
2.  Enter URL: `http://localhost:8000/api/v1/auth/confirm?token=YOUR_TOKEN_HERE`
    *   Replace `YOUR_TOKEN_HERE` with the actual token.
3.  Click **Send**.

**Expected Response (200 OK):**
```json
{
  "message": "Email confirmed successfully"
}
```

---

## 4. Signin
Logs in the user and returns an access token.

*   **Method:** `POST`
*   **URL:** `{{base_url}}/api/v1/auth/signin`
*   **Description:** Authenticates the user. Email confirmation is no longer required for login.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Postman Instructions:**
1.  Set method to **POST**.
2.  Enter URL: `http://localhost:8000/api/v1/auth/signin`
3.  Go to **Body** tab -> Select **raw** -> Select **JSON**.
4.  Paste the JSON above.
5.  Click **Send**.

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "user": { ... }
}
```
*Tip: Copy the `access_token` for authenticated requests.*

---

## 5. Resend Confirmation
Resends the email confirmation link.

*   **Method:** `POST`
*   **URL:** `{{base_url}}/api/v1/auth/resend-confirmation`
*   **Description:** Triggers a new confirmation email.

**Request Body (JSON):**
```json
{
  "email": "user@example.com"
}
```

**Postman Instructions:**
1.  Set method to **POST**.
2.  Enter URL: `http://localhost:8000/api/v1/auth/resend-confirmation`
3.  Go to **Body** tab -> Select **raw** -> Select **JSON**.
4.  Paste the JSON above.
5.  Click **Send**.

**Expected Response (200 OK):**
```json
{
  "message": "If account exists, confirmation email sent"
}
```

---

## 6. Forgot Password
Initiates the password reset flow.

*   **Method:** `POST`
*   **URL:** `{{base_url}}/api/v1/auth/forgot-password`
*   **Description:** Sends a password reset link/token.

**Request Body (JSON):**
```json
{
  "email": "user@example.com"
}
```

**Postman Instructions:**
1.  Set method to **POST**.
2.  Enter URL: `http://localhost:8000/api/v1/auth/forgot-password`
3.  Go to **Body** tab -> Select **raw** -> Select **JSON**.
4.  Paste the JSON above.
5.  Click **Send**.

**Expected Response (200 OK):**
```json
{
  "message": "If account exists, reset instructions sent"
}
```
*Note: Check backend logs for the reset token.*

---

## 7. Reset Password
Sets a new password using the reset token.

*   **Method:** `POST`
*   **URL:** `{{base_url}}/api/v1/auth/reset-password`
*   **Description:** Resets the user's password.

**Request Body (JSON):**
```json
{
  "token": "YOUR_RESET_TOKEN_HERE",
  "new_password": "newsecurepassword456",
  "confirm_password": "newsecurepassword456"
}
```

**Postman Instructions:**
1.  Set method to **POST**.
2.  Enter URL: `http://localhost:8000/api/v1/auth/reset-password`
3.  Go to **Body** tab -> Select **raw** -> Select **JSON**.
4.  Paste the JSON above (replace `token` with the one from logs).
5.  Click **Send**.

**Expected Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```
