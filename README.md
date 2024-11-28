![Cartoon picture of a man holding a sign saying Big News](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiikvYqp5FODzECmz9WXLgNuQl6UIn_Dhwug&s)

# [Northcoders News API](https://calebs-backend-news-project.onrender.com/api)

## Sections

#### 1. [Project Summary](#project-summary)

#### 2. [File Setup Instructions](#file-setup-instructions)

#### 3. [Installing Dependencies](#installing-dependencies)

- [Minimum Required Versions of Node.js and Postgres](#minimum-required-versions-of-nodejs-and-postgres)

#### 4. [Seeding the Local Database](#seeding-the-local-database)

#### 5. [Running Tests](#running-tests)

## Project Summary

Northcoders News Api (NC News) is a backend server hosted on Render that utilises a PostgreSQL database containing information to simulate a news server. You can fetch and manipulate data by providing endpoints in the url detailed by the **/api** endpoint you'll be taken to when clicking the title at the top of this page.  
Some examples are:

- Looking up articles, topics, comments or users
- Adding a new comment to an article
- Updating information for an article
- Deleting a comment

In order to view the information in a nice format, you may want to install a JSON formatter extension to your browser such as this [JSON formatter extension](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) for Google Chrome. I personally used this extension when viewing the data.

## File Setup Instructions

- Download [Node.js](https://nodejs.org/en) to be able access the JavaScript runtime environment. There is a minimum version needed to access the database listed below [here](#minimum-required-versions-of-nodejs-and-postgres).

- Clone the repository to your local machine by using  
  `git clone https://github.com/CalStott/my-backend-news-project.git`

- Create two files in the parent folder:

  - **.env.development** containing `PGDATABASE=nc_news`
  - **.env.test** containing `PGDATABASE=nc_news_test`.

  This will allow you to connect to the test and development databases depending on whether you run the test suite files or the run-seed file.

- Once both files have been created, run `npm run setup-dbs` in the terminal to create both the test and development databases.

## Installing Dependencies

The necessary dependencies have all been brought in for you, so if you run `npm install` it will install everything needed to be able to interact with the database and code.

### Minimum Required Versions of Node.js and Postgres

As mentioned in the summary, this API makes use of a PostgreSQL database so Node and Postgres are required. The versions listed below are the minimum versions needed to access the database. You can check which versions you have installed by running `node -v` and `psql -V`.

    Node.js - v22.9.0
    Postgres - 16.4

## Seeding the Local Database

Seeding the local database with the development data has been setup as a script for you, just run  
`npm run seed` and the database can be accessed through `psql` and `\c nc_news` to view in the terminal.

Alternatively, running the test suite **app.test.js** in the \_\_tests\_\_ folder will automatically seed the test database with the test data. This can also be accessed through `psql` and `\c nc_news_test` to view in the terminal.

## Running Tests

The tests to check functionality and performance of the database with provided endpoints have been written and passed. To view the test code, open the **app.test.js** file as mentioned above. To run the test suite, run  
`npm test app` and all of the tests within the file will be run.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
