# About

In this template you will find a number of directories, this document will
explain their purpose as well as how someone should go about working effectively
inside of this template

## Layout and Modification

* basic-node-lti
  * src
    * server - Contains the server logic for this application
      * lti - Contains the logic to turn this application into an LTI tool
      provider.
      * routes - Exports the routes that will be used by this application.
      It is likely that you will want to add routes to this application and it
      would be best to add them here.
      * config.js - defines functions to access server configuration
      * index.js - launches the server
      * server.js - Uses the routes and lti tools defined in their respective
      folders and exports the server object
  * config - a collection of configuration files for the application,
    * lti.json - Application specific LTI information that will need to be set.
