# Meme Central

Meme Central is a Node.js web application built with Express and EJS.
The application displays a list of memes retrieved from an external API and allows authenticated users to view detailed information about each meme.

This project was completed as part of a client brief where an unfinished codebase was provided and had to be fixed, extended, and completed according to specific requirements.

---

## Technologies Used

- Node.js
- Express
- EJS (Embedded JavaScript Templates)
- PassportJS (Local Strategy)
- Express Sessions
- Axios
- Bootstrap 5.2.3 (installed via NPM)
- jQuery (installed via NPM)

---

## Features

- Meme Overview page displaying 20 memes retrieved from an external API
- API call is executed only once per server start and cached in memory
- Meme Details page showing full meme information:
  - ID
  - Name
  - Image
  - URL
  - Width and Height
- Backend search functionality for memes by name
- Viewed memes are highlighted in the overview table and persist after page refresh
- Login system using PassportJS
- Guest users:
  - Can view the meme overview table
  - Cannot access meme details
- Logged-in users:
  - Can access meme details
  - Are redirected back to the overview after login
- Protected routes to prevent unauthorized access
- Dynamic navbar showing Login or Logout depending on authentication state
- Username displayed in the navbar ("Guest" if not logged in)

---

## Installation

1. Open a terminal in the project root directory
2. Install dependencies:
   npm install
3. Start the application:
   npm start
4. Open the application in a browser:
   http://localhost:3000/memes

---

## Login Credentials

The following users are available for testing:

- Username: admin  
  Password: central

- Username: Josh  
  Password: Josh1

- Username: FJ  
  Password: FJ1

- Username: Student  
  Password: Student1

---

## Configuration

The API URL is stored in a JSON configuration file to allow easy changes without modifying application logic.

The application fetches memes from the API only once per server run.
A new set of memes is retrieved only when the server is restarted.

---

## Notes

- The application uses server-side rendering with EJS
- All required libraries are installed via NPM (no CDN usage)
- Meme viewing state is stored using sessions
- This project follows the structure and technology requirements specified in the client brief
