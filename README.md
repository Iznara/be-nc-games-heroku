# **Iznara Game Reviews API**

## **About**
This project is an API for the purpose of accessing application data programmatically. The intention here is to mimics the building of a real world backend service (such as reddit) which provides information to the front end architecture.

The database currently contains the following information:
- **Categories:** 
    - slug -- _Name of category_ 
    - description -- _Description of the category_
- **Comments:** 
    - body -- _Main body of text for the comment_
    - votes -- _Current number of comment votes_
    - author -- _User that wrote the comment_ 
    - review_id -- _Associated review_ 
    - created_at -- _Timestamp when the comment was posted_
- **Reviews:** 
    - title -- _Review tile_
    - designer -- _Creator/Designer of the boardgame_
    - owner -- _Username of the user who wrote the review_
    - review_img_url -- _Image url containing the picture for the review_
    - review_body -- _Main body of text for the review_ 
    - category -- _Category associated with the review_
    - created_at -- _Timestamp when the review was posted_
    - votes -- _Current number of review votes_
- **Users:** 
    - username -- _Unique username for the profile_ 
    - name -- _Actual name of the user_ 
    - avatar_url -- _Image url containing the picture for the users profile_

<br>

# Setup

## **Requirements** 
Please install the latest version of [Node](https://nodejs.org/en/download/) and [Postgres](https://www.npmjs.com/package/pg) to avoid any compatibility issues.
The following versions were used for this project.  
- `Node.js` v16.11.0
- `Postgres` v12.9

_To view the currently installed version use the following commands:_
- _Node.js_

        $ node -v
- _Postgres_

        $ psql --version


## **Initial Setup**
1. Clone the project using the command below:

        $ git clone https://github.com/Iznara/be-nc-games-heroku.git


2. Navigate to the cloned repository:

        $ cd be-nc-games-heroku

3. Install project dependencies:

        $ npm i

4. To run the test suite you will need to install the following development dependencies:

        $ npm i -D jest jest-sorted supertest

5. Setup the local database 

        $ npm run setup-dbs

6. Seed the local database 

        $ npm run seed



## **Environment Setup**  
Create the following two environment variables in the root directory of this project to allow access to the test and the development data.
Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for each environment.
- `.env.test` PGDATABASE=nc_games_test        
- `.env.development` PGDATABASE=nc_games 

***

## **Running Jest Test Suite**

    $ npm test


***

## **Running The Server Locally** 
The port will listen on port 9090 if the connection is successful.

    $ npm start

***

## **Heroku App**
Here is a [link](https://ncgames-iznara.herokuapp.com/api) to the hosted version of this project with details of each available endpoint.

 - ##### **N.B.** To observe POST/PATCH/DELETE methods use a RESTful API testing tool such as [insomnia](https://insomnia.rest/download).