Preparations 
============ 
We assume that you have Play 2.2 for Scala installed. If not, you may download it [here](http://downloads.typesafe.com/play/2.2.4/play-2.2.4.zip).  
Follow the [instructions](http://www.playframework.com/documentation/2.2.x/Installing) to install Play. 
 
Additionally you will also need to [download](http://www.mongodb.org/downloads) and install MongoDB. 
 
  
Our application 
=============== 
 
The application we are going to develop will be a simple task management application, which basically consists of two 
entities: tasks and users. 

A __Task__ consists of the following properties:

 * an ID
 * a name, which must not be empty
 * a due date
 * a checked-state
 * optional sub-tasks
 * and an assignee 

An __User__ has the following properties:

 * ID,
 * a name, which also must not be empty
 * and an email address
 
The goal of our application is to provide a basic CRUD interface for managing tasks and users.   
 
We will use the Play framework throughout the tutorial, so in case you haven't done so already, please install Play and follow the instructions setup up your development environment. 
 
We will also need a MongoDB, which you can download [here](http://www.mongodb.org/downloads).
 
Create a basic Play application 
======================= 
We will first setup a new Play application. Open up a terminal and switch to a directory of your choice. Setup the project template by entering the following command: 
 
``` 
play new qbtasks 
``` 
 
Confirm the name of your application and select the option to create a simple Scala application if asked which kind of application you would like to develop.
 
When the command has finished, you will have a folder named ```qbtasks``` which basically contains the project template. Switch over to that directory and start play. 
 
``` 
cd qbtasks
play 
``` 
 
Adding qb dependencies 
====================== 

We assume that you'll work with an editor of your choice for the rest of the tutorial. In case you use an IDE like IDEA or Eclipse, please consult your documentation, since 
some steps might be redundant, because your IDE possibly handles them for you.

We will first need to add the qbproject dependencies to your project. Open the ```build.sbt``` file and add the qb repository (via the [resolver](http://www.scala-sbt.org/0.13/docs/Resolvers.html) setting) as well as the actual dependencies by appending the following section into the file. Note that sbt requires each setting to be separated by an empty line.

``` 
resolvers += "mandubian maven bintray" at "http://dl.bintray.com/mandubian/maven"

resolvers += "QB repository" at "http://dl.bintray.com/qbproject/maven"

libraryDependencies ++= Seq(
  "org.qbproject"     %% "qbschema"    % "0.4.0-rc6",
  "org.qbproject"     %% "qbplay"      % "0.4.0-rc6",
  "com.mandubian"     %% "play-json-zipper"    % "1.2",
  "org.reactivemongo" %% "play2-reactivemongo" % "0.10.5.0.akka23"
)
``` 
 
Switch back to your terminal and enter the ```reload``` command followed by an ```update``` command. 
This will instruct sbt to download qb and all its dependencies, which might take a couple of minutes. 
 
Somewhere in the ```conf/application.conf``` file, specify the URI to your mongo database, for instance: 
 
    mongodb.uri ="mongodb://localhost:27017/qb" 
 
 
We also have to create a ```play.plugins``` file in the ```conf/``` directory in order configure the reactive mongo plugin. Add this line to the ```play.plugins``` file to enable the Reactive Mongo plugin for our application.
 
    400:play.modules.reactivemongo.ReactiveMongoPlugin 
 
Declare our schema 
===================== 
 
We can now start declaring our task and user entities.
  
Create a folder ```model``` in your ```app``` directory, a file named ```app/model/TaskSchema.scala``` and add the necessary import: 
   
    package model 
 
    import org.qbproject.schema._ 
    import org.qbproject.schema.QBSchema._ 
    import org.qbproject.mongo._ 
 
We write the schema for both entities into a single object we will call ```TaskSchema```. 

To declare a user we will use ```qbClass``` keyword which expects a variable number field names mapped to their to their type.  
Generally speaking, all types in qb are prefixed with *qb* in order to avoid name clashing with other types one might have in scope. 
  
The qb types are meant to be in accordance with JSON schema, therefore, qb only has numbers, strings, boolean, lists and 
classes. Each type can be annotated with additional rules a value has to accord to. For convenience, qb's DSL provides convenience constructs such as ```qbEmail``` or ```qbNonEmptyText```, which already come with the appropriate rules out of the box.

We will make use of them in our example to force API consumers to send us only valid data. If they send us invalid data, that is, an empty name for example, qb will return them an validation error describing the violation. 

    object TaskSchema { 
    
      val taskId = objectId
      val userId = objectId
    
      val user: QBClass = qbClass( 
        "id"   -> userId, 
        "name" -> qbNonEmptyText, 
        "mail" -> qbEmail 
      ) 
   
      val task: QBClass = qbClass( 
        "id"   -> taskId, 
        "name" -> qbNonEmptyText, 
        "dueDate" -> optional(qbDateTime), 
        "done" -> qbBoolean, 
        "assignee" -> userId 
      ) 
    } 

There are three things to note in the listing: 

First, the association between a user and a task is modelled simply by using ```userId```.  We aliased the variable name for clarity, although this isn't of course necessary.

Secondly, because we are going to store our entities in a MongoDB and each entity stored within Mongo needs an ID, we use the Mongo-specific ```objectId``` keyword as the ID type.

Thirdly, for tasks, we set the ```dueDate``` to optional in case there is no due date, i.e. the dueDate field may be omitted.
 
With our schema set, we can now write the CRUD controllers for both entities. 
 
Create controllers 
==================
A Play application has several entry points, one for each URL, which are called actions. 
Controllers contain several such Actions and therefore are the most important concept in Play.

The qb Play integration provides convenience controllers that handle all CRUD operations for a given schema entity based on MongoDB.
All you have to do is to specify which collection should be used to store your entities as documents.

At the time of writing, qb only supports Mongo as a data store, but additional backends will follow soon. 
 
The Mongo support is based around ```QBMongoConllection``` and ```QBCollectionValidation```. 

While the first provides convenience functions around Mongo collections, the latter also performs validation and, if necessary, transformation against entities being written or read into or out of collections. 

Both have in common that they are based on [Reactive Mongo](https://github.com/ReactiveMongo/Play-ReactiveMongo), a Play plugin that enables support for Reactive Mongo. 
 
Our example controllers therefore needs to extend Reactive Mongo's ```MongoController``` as well as qb's ```QBCrudController``` and then implement the ```collection``` member.The collection method returns a ```QBMongoCollection``` that receives the collection name (```'users'```) and the actual database.  We also mixin the QBCollectionValidation
trait that enables validation for each JSON document read or written.

All of this goes into ```app/controller/UserController.scala```. 

    package controllers 
 
    import model.TaskSchema 
    import org.qbproject.controllers.QBCrudController 
    import org.qbproject.mongo.{QBCollectionValidation, QBMongoCollection} 
    import play.modules.reactivemongo.MongoController 
 
    object UserController extends MongoController 
      with QBCrudController { 
      
      override def collection: QBCollectionValidation = 
        new QBMongoCollection("users")(db) with QBCollectionValidation { 
        override def schema = TaskSchema.user 
      } 
    } 
     
The CRUD (acutally CRU, since Delete is missing yet ;) controller by default maps the routes as follows: 
 
 * GET to ```/``` returns all entities  
 * GET to ```/:id``` returns the entity with the specified ID, if any 
 * POST to ```/``` creates an entity 
 * POST to ```/:id``` updates an entity 
 
We yet need to make these routes known to Play, which qb also provides the ```QBRouter``` trait for. 

This trait has a single member, ```qbRoutes``` which, when implemented, can be used in the routes file by making use of the sub routes include syntax. qb of course lets you modify the routing behaviour and also provides a DSL to easily manage routes, but we will not go into detail further. Please see TODO for more information. 
  
Switch back to your UserController and let it extend the ```QBRoutes``` trait. Don't forget to add the necessary imports.

    import org.qbproject.routing.{QBRouter, QBRoute}     
    ...
    object UserController extends MongoController with QBCrudController with QBRouter { 
    ... 
    } 
 
Since the ```QBCrudController``` provides the already mentioned default routes the implementation  of ```qbRoutes``` is easy: 
 
    override def qbRoutes: List[QBRoute] = crudRoutes 
     
For completeness, our ```UserController``` currently looks like this: 
 
    package controllers 
 
    import model.TaskSchema 
    import org.qbproject.controllers.QBCrudController 
    import org.qbproject.mongo.{QBCollectionValidation, QBMongoCollection} 
    import org.qbproject.routing.{QBRouter, QBRoute}     
    import play.modules.reactivemongo.MongoController 
 
    object UserController extends MongoController 
      with QBCrudController with QBRouter { 
      override def collection: QBCollectionValidation = 
        new QBMongoCollection("users")(db) with QBCollectionValidation { 
        override def schema = TaskSchema.user 
      } 
       
      override def qbRoutes: List[QBRoute] = crudRoutes 
    } 
 
Now, open up the ```conf/routes``` file and add the following line: 
 
    ->      /users                      controllers.UserController 
 
The lines tells Play that our router should be triggered if clients POST or GET a URL that matches the ```users``` route prefix.
    
The task controller, which we place in ```app/controller/TaskController.scala``` almost looks the same: 
 
 
    package controllers 
 
    import model.TaskSchema 
    import org.qbproject.controllers.QBCrudController 
    import org.qbproject.mongo.{QBCollectionValidation, QBMongoCollection} 
    import org.qbproject.routing.{QBRouter, QBRoute}     
    import play.modules.reactivemongo.MongoController 
 
    object TaskController extends MongoController 
      with QBCrudController with QBRouter { 
      override def collection: QBCollectionValidation = 
        new QBMongoCollection("tasks")(db) with QBCollectionValidation { 
        override def schema = TaskSchema.task 
      } 
      def qbRoutes: List[QBRoute] = crudRoutes 
    } 
 
Don't forget to also add a line for ```TaskController``` to the ```routes``` file. 
 
    ->      /tasks                      controllers.TaskController 
 
Testing & modifying our application 
======================= 
 
To test our application you need to have a REST client available such as [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm).  When executing requests with Postman you might need to set the ```Content-Type``` header to ```application/json``` using the button _Headers_ in the upper-right area.


Start up mongo (see the [additional instructions](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/) if you are starting Mongo for the first time) and switch back to your terminal and enter ```~run``` to start the server.  The tilde in front of the ```run``` command instructs Play to recompile your source files on the fly in case you make any changes. If you wish to end running the server enter ```Ctrl + D```.
 
Now enter the ```localhost:9000/users``` URL into Postman and execute a GET request. 
An empty array should return, which basically tells us, that no users are yet avaiable. 
  
Now lets create a user. When looking back at the schema of a user, we realize that a valid user needs to have an 
ID field of type ```objectId```.  Actually, that type should not be exposed as an API.  
Ideally, we would like users, who want to create a user, to not have an ID field specified. 
  
Instead of going the process of creating an extra type that specifies which fields are mandatory and which will be handled by the backend and then mapping them onto each other, we simply take the schema and execute a so called schema op on it. 

In this case we want to remove the ```id``` field.  The play module of qb already provides CRUD controller hooks that let you specify another schema while the request is being validated, which is called the ```createSchema``` since it is used to parse the client's request and creating instances out of it. Analgously, there is also a ```updateSchema``` that is used when updating instances.

There's also a hook that lets you modify the validated instance, which you could use to  add the ```id``` field necessary for Mongo, but the qb Play integration already takes care of that for you. 
 
Open the file ```app/controllers/UserController.scala``` and add this import: 
 
    import org.qbproject.api.schema.QBSchema._ 
 
Now, override the ```createSchema``` and subtract the ```id``` field: 
 
    override def createSchema = TaskSchema.user - "id" 
    
Do the same for the ```TaskController```, too, that is, subtract the ```id``` field from the ```TaskSchema.task``` schema.
    
Switch back to Postman, enter a valid JSON user instance (like the one below) and execute a raw JSON POST request to ```localhost:9000/users```  
 
    { 
      "name": "chloe", 
      "mail": "foo@gmail.com"
    } 
 
You should get a response which lists a single user, like the one below:

    {
      "id": "53ce4d518101008101dae3d2",
      "name": "chloe",
      "mail": "foo@gmail.com"
    }
    
Note the value of the ```id```, because we will come back to it in a second.
Now try to remove the ```name```name field or set its value to the empty string. In both cases you should receive an validation error describing the error, like the one below:

    {
      "status": "error",
      "message": "Json input didn't pass validation",
      "details": {
        "obj.name": [
            {
                "msg": "qb.string.min.length.violated",
                "args": []
            }
        ]
      }
    }

The above error tells us, the the name field could not be validated successfully, since it is too short (the ```qbNonEmptyText``` rule applies).

Note that in the response we received after an user has been successfully created, the ```id``` is present. Use this ID to update an user. For instance, if you want to change the mail address of the user ```chloe``` execute a POST request to ```localhost:9000/users/<YOUR_ID>``` (enter the id you noted down before instead of ```YOUR_ID```) and specify the JSON body:

    {
      "id": <YOUR_ID>,
      "name": "chloe",
      "mail": "chloe@gmail.com"
    }
    
Since we didn't override the ```updateSchema``` we need to specify the ID in the body too, although this doesn't make much sense in this example. 

Let's create a task. Execute a POST request to ```localhost:9000/tasks``` with this JSON body:

    {
        "name": "Clean bath", 
        "done": false,
        "assignee": <YOUR_ID>
    }

As you see, the link to the user is established by using the respective user ID. But what if we would like to inline the assignee user, that is, to include the JSON user instance instead of just the ID?

We override the ```getAll``` method of the ```TaskController``` to include the assignee:

    override def getAll: JsonHeaders[AnyContent] = 
      JsonHeaders {
        Action.async {
          collection.getAll().flatMap { list => 
            Future.sequence(list.map(result => {
               UserController.collection
                 .getById((result \ "assignee").as[String])
                 .map(_.get)
                 .map(u => result.deepMerge(
                   Json.obj("assignee" -> u))
                 )
            }) 
          )}.map(result => Ok(Json.toJson(result)))
        }
      }
 
 Of course, this should just illustrate that qb also provides the flexibility to override the existing behaviour. In a real production setting you would'nt want to use ```get```.
 

