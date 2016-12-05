---
layout: doc
---
Setting up a sample application
===============================

To ease the initial setup as well as provide a template for working through the following tutorial, 
we provide the "Make it happen" application as an example and encourage you to use it as well. 
This example application contains a simple form, which we will also extend incrementally follow-up tutorials. 
The initial state of the example application is the outcome of the first part: 
[Define your first form](#/docs/firstform). 
We also provide the final state including all adaptations described in the remaining parts of the tutorial, 
which can be used as a template solution.

### Prerequisites
You need git to clone the "Make it happen" repository. You can get git from [http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and run the "Make it happen" example. 
You must have node.js and its package manager (npm) installed. You can get them from [http://nodejs.org/](http://nodejs.org/).

### Example
Both example states can be found at 
[https://github.com/eclipsesource/make-it-happen-jsonforms.git](https://github.com/eclipsesource/make-it-happen-jsonforms.git). 
Clone this repository with git clone onto your local machine.

This git repository contains the following directories:

* `app/initial` contains the initial state of the example application
* `app/final` contains the final state of the example application

To run one of the two states, first execute `npm install` in the root directory, which will install all dependencies 
of the example application.
After that, execute one of the following commands to run the initial state or the final state, respectively.

* `npm run initial` to run the initial state of the example application
* `npm run final` to run the final state of the example application

Once you have started one of the two states of the example app, you can see the result in your browser using 
at [http://localhost:8123/](http://localhost:8123/).

If everything is setup correctly, you should see the following in your browser:

#### Initial State
{% 
   include image.html url="images/docs/setup.initialform.png" 
   description="The initial state of the application" 
%}

#### Final State
{% 
   include image.html url="images/docs/setup.finalform.png" 
   description="The final state of the application" 
%}

Once you have completed the initial setup, we recommend you to continue with the section 
['Getting started with your first form'](#/docs/firstform), which explains the initial state in more detail.
