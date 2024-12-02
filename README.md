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

## The live API is hosted at the following URL:
[Vercel link] (https://my-api-project-git-main-omar-s-projects-82c3d062.vercel.app/)

## I updated the Url in the console with the new deployed Api

client.BaseAddress = new Uri(https://my-api-project-git-main-omar-s-projects-82c3d062.vercel.app/);


## Repository Link
[GitHub Repository](https://github.com/Omareo518/my-api-project)
