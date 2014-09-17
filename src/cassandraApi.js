var Hapi = require('hapi');
var cql = require('node-cassandra-cql');

// Hapi automatically detects the content-type to put in the header
// Configurable values via a properties file?...
var server = new Hapi.Server('localhost', 8080);
var client = new cql.Client({hosts: ['c1','c2','c3'], keyspace: 'personalisation'});

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
  path: '/',
  handler: function(request, response){
    response('Query Layer RESTful API successfully started');
  }
});

server.route({
  path: '/customers/{accountnumber}',
  method: 'GET',
  handler: function(request, response){
    var accountnumber = request.params.accountnumber;
    client.execute('SELECT accountnumber, clusterid, attributes FROM customer where accountnumber = ?',[accountnumber],
       function(err, result){
        if(err){
          console.log('ERROR: Calling resource GET /customers/{accountnumber}'+ err.message);
        }else{
          response(result);
         }
       }
    );
  }
});

server.route({
  method: 'GET',
  path: '/products/', 
  handler: function(request, response){
      client.execute('SELECT DISTINCT line FROM product LIMIT 10;',
      function(err, result){
       if(err){
         console.log('ERROR: accessing resource GET /products/'+ err.message);
       }else{
         response(result);
        }
      }
    );
  }
});

server.route({
  method: 'GET',
  path: '/products/{line}',
  handler: function(request, response){
    var productLine = request.params.line;
    client.execute('SELECT line FROM product where line = ?',[productLine],
       function(err, result){
        if(err){
          console.log('ERROR: accessing resource GET /products/{line}'+ err.message);
        }else{
          response(result);
         }
       }
    );
  }
});

server.route({
  method: 'GET',
  path: '/products/{line}/options/',
  handler: function(request, response){
    var productLine = request.params.line;
    client.execute('SELECT line, option FROM product where line = ?',[productLine],
       function(err, result){
        if(err){
          console.log('ERROR: accessing resource GET /products/{line}/options/'+ err.message);
        }else{
          response(result);
         }
       }
    );
  }
});

server.route({
  method: 'GET',
  path: '/products/{line}/options/{option}',
  handler: function(request, response){
    var productLine = request.params.line;
    var option = request.params.option;
    client.execute('SELECT line, option, attributes FROM product where line = ? AND option = ?',[productLine, option],
       function(err, result){
        if(err){
          console.log('ERROR: accessing resource GET /products/{line}/options/{option}'+ err.message);
        }else{
          response(result);
         }
       }
    );
  }
});

server.route({
  method: 'GET',
  path: '/similarities/{clusterid}',
  handler: function(request, response){
    var clusterid = request.params.clusterid;
    client.execute('SELECT clusterid FROM similarity where clusterid = ?',[clusterid],
       function(err, result){
        if(err){
          console.log('ERROR: accessing resource GET /similarities/{clusterid}'+ err.message);
        }else{
          response(result);
         }
       }
    );
  }
});

server.route({
  method: 'GET',
  path: '/similarities/{clusterid}/products/',
  handler: function(request, response){
    var clusterid = request.params.clusterid;
    client.execute('SELECT clusterid, productline FROM similarity where clusterid = ?',[clusterid],
       function(err, result){
        if(err){
          console.log('ERROR: accessing resource GET /similarities/{clusterid}/products/'+ err.message);
        }else{
          response(result);
         }
       }
    );
  }
});

server.start(function(){
  console.log('Server started at: ', server.info.uri + ' and ready to query the cluster.');
});

