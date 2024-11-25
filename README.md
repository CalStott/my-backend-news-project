# Northcoders News API

Create two files in the parent folder: - .env.development containing 'PGDATABASE=nc_news' - .env.test containing 'PGDATABASE=nc_news_test'.

This will allow you to connect to the test and development databases depending on whether you run the test suite files or the run-seed file.

Once both files have been created, run 'npm run setup-dbs' in the terminal to create both the test and development databases.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
