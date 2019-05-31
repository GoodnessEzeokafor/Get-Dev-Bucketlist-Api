BucketList API

Problem Description

In this exercise you will be required to create a Restful API for a bucket list service. Specification for the API is shown below. You may use any database you prefer for this assignment. Make use of any framework you desire.


EndPoint

## Logs a user in
* POST /auth/login

## Logs a user out
* GET /auth/logout


## Create a new bucket list
* POST /bucketlists/

## List all the created bucket lists
* GET /bucketlists/

## Get single bucket list
* GET /bucketlists/<id>

## Update this bucket list

* PUT /bucketlists/<id>


## Delete this single bucket list
* DELETE /bucketlists/<id>

## Create a new item in bucket list
* POST /bucketlists/<id>/items/


## List all the created items in a bucket list

* GET /bucketlists/<id>/items


## Get a single item in a bucket list

* GET /bucketlists/<id>/items/<id>


## Update a bucket list item

* PUT /bucketlists/<id>/items/<item_id>


## Delete an item in a bucket list

* DELETE /bucketlists/<id>/items/<item_id>



{

    id: 1,

    name: “BucketList1”,

    items: [

        {

id: 1,

name: “I need to do X”,

date_created: “2015-08-12 11:57:23”,

date_modified: “2015-08-12 11:57:23”,

done: False

}

]

    date_created: “2015-08-12 11:57:23”,

    date_modified: “2015-08-12 11:57:23”

    created_by: “1113456”

}


Task 1 - Implement Token Based Authentication

For this task, you are required to implement Token Based Authentication for the API using Json Web Tokens(JWT) such that some methods are not accessible via unauthenticated users. Access control mapping is listed below.


EndPoint


## POST /auth/login
* Public Access : TRUE

## GET /auth/logout

* Public Access : FALSE

## POST /bucketlists/

* Public Access :FALSE

## GET /bucketlists/

* Public Access :FALSE

## GET /bucketlists/<id>

* Public Access :FALSE

## PUT /bucketlists/<id>

* Public Access :FALSE

## DELETE /bucketlists/<id>

* Public Access :FALSE

## POST /bucketlists/<id>/items/

* Public Access :FALSE

## PUT /bucketlists/<id>/items/<item_id>

* Public Access :FALSE

## DELETE /bucketlists/<id>/items/<item_id>

* Public Access :FALSE


Task 2 - Implement Pagination on your API

For this task, i  implemented pagination on my API such that users can specify the number of results they would like to have via a GET parameter limit. The default number of results is 20 and the maximum number of results is 100. 



Request

GET http://localhost:5555/bucketlists?page=2&limit=20


Response

20 bucket list records belonging to the logged in user.


Task 3 - Implement Searching by name

For this task, you are required to implement searching for bucket lists based on the name using a GET parameter q.


Request

GET http://localhost:5555/bucketlists?q=bucket1




