# My Express API

## Endpoints
- **POST /api/greet**
  - Request:
    ```json
    {
      "timeOfDay": "Morning",
      "language": "English",
      "tone": "Formal"
    }
    ```
  - Response:
    ```json
    {
      "greetingMessage": "Good Morning!"
    }
    ```
- **GET /api/timesOfDay**:
  - Returns a list of available times of day.
- **GET /api/languages**:
  - Returns a list of supported languages.

## Repository Link
[GitHub Repository](https://github.com/Omareo518/my-api-project)
