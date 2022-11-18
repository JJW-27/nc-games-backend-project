# Northcoders House of Games API

# Information

This repository contains a REST api for a games review website, including database seeding and a series of error-handled endpoints, as well as a comprehensive test suite.

This repository was created running Node.js v19.0.0 and PostgreSQL version 14.5

# Accessing hosted version

Link to hosted version: https://real-rose-worm-kit.cyclic.app/

Information available includes user, review, game and comment data.

A list of available endpoints can be viewed at https://real-rose-worm-kit.cyclic.app/api

# How to use this repo for your own project

In order to make use of this repository for your own projects;

1. Clone the repo to your local machine
2. Create a new empty public repo
3. Inside your local version of this repo, run the following three commands:

- git remote set-url origin YOUR_NEW_REPO_URL_HERE
- git branch -M main
- git push -u origin main

4.  Run npm install to install dependencies
5.  Add an .env.test and .env.development file to the root of your local version and assign the relevant database names to PGDATABASE, as per the provided .env-example file. This step is for local testing purposes
6.  Set up the local database with the command "npm run setup-dbs"
7.  The command "npm test" or "npm run test FILE_NAME" will run the test suite, which seeds the database before each test.
8.  When wanting to host the server, add a .env.production file containing the following code: DATABASE_URL=URL_OF_YOUR_DATABASE

Enjoy!
