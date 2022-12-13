## BE-NC-NEWS PROJECT

As .env.* is added to the .gitignore, anyone who wishes to clone your repo will not have access to the necessary environment variables. 

## Instructions
1. Fork and clone a repository locally
2. Run `npm install` in order to download the required packages 
3. Create two sepearate .env files in the root directory and name them as follows:
    - **.env.development**
    - **.env.test**
4. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). 
5. Double check that these .env files are .gitignored.