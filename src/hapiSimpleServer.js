var Hapi = require('hapi');
var cql = require('node-cassandra-cql');

var server = new Hapi.Server('localhost', 8080);
var client = new cql.Client({hosts: ['c1'], keyspace: 'query_layer_test'}); //



/*
 * good is a process monitor for the following types of events:

    System and process performance (ops) - CPU, memory, disk, and other metrics.
    Requests logging (request) - framework and application generated logs generated during the lifecycle of each incoming request.
    General events (log) - logging information not bound to a specific request such as system errors, background processing, configuration errors, etc.
 */

var options = {
    
  subscribers: {
    'console' : ['request'] // Gives logging data on requests made to API calls
   }  
};

// Plug in Good
server.pack.register({
  plugin: require('good'),
  options: options
  }, function(err){
    if(err){
      console.log(err);
      return;
    }
  });

server.route({
  method: 'GET',
  path: '/api/',
  handler: function(request, response){
    response('Hapi Query Layer API successfully started');
  }
});

server.route({
  method: 'GET',
  path: '/api/documents',
  handler: function(request, response){
    response({ isJSON : true });
  }
});

server.route({
  method: 'GET',
  path: '/api/documents/ids',
  handler: function(request, response){
    //var documents = client.execute('SELECT * FROM documents');
    var documents = "{ hasReturned : true }";
    response(documents);
  }
});

server.start(function(){
  console.log('Hapi server started at : ', server.info.uri);
  console.log('Cassandra connection details : ', client.options.maxExecuteRetries);
});
