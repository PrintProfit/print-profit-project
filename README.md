# Print Profit Project

## Tech Stack

[![Tech Stack](https://skillicons.dev/icons?i=js,react,css,express,heroku,materialui,postgres,redux,html)](https://skillicons.dev)

This version uses React, Redux, Express, Passport, and PostgreSQL (a full list of dependencies can be found in `package.json`).

We **STRONGLY** recommend following these instructions carefully. It's a lot, and will take some time to set up, but your life will be much easier this way in the long run.

## Getting Started

### Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)

### Installation

1. Fork & clone the repository
2. Create the database named `print_profit`
3. Run the queries found in `database.sql`
4. Open un your editor of choice and run `npm install`
5. Run `npm run dev` in your terminal
6. Navigate to [`http://localhost:5173/#/registration`](http://localhost:5173/#/registration)
7. Register a new user to be an admin
8. In a database GUI (ex. [Postico](https://eggerapps.at/postico2/)), go to the `company` table of the `print_profit` table and insert a new company
9. Still in the database GUI, switch to the `user` table. It should have one user. Change the following rows on it:

   - `company_id` should be the ID of whatever company you just created (probably 1)
   - `is_admin` should be `TRUE`
   - `is_approved` should be `TRUE`
   - `is_removed` should be `FALSE` (the default)

10. Finally, log in on the website
