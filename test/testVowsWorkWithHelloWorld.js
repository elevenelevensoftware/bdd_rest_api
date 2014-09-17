var vows = require('vows'),
    request = require('request'),
    assert = require('assert');

var testObject = { isObject : true };

// A suite is created so that batches can be added to it 
var queryLayerTestSuite = vows.describe('queryLayerApiTestSuite');
var baseUrl = 'http://127.0.0.1:8080';
// Any amount of batches can be added. Batches are executed SEQUENTIALLY
queryLayerTestSuite.addBatch({
  
  // Batches contain CONTEXTS run in parallel asynchronously so can run in ANY order.
  // Only nested contexts will run sequentially, howver any sibling contexts of siblings with nested contexts, 
  // can still run in any order
  
  'When the query layer is called' : {
    'and the application is successfully started then it' :  { // This is the context
      // Contexts contain TOPICS and VOWS  
      topic : function( /* Async action happens here */ ) {
          request({
            url: baseUrl + '/',
            method: 'GET'
          }, this.callback);
        },
        'should respond with status 200 OK' : function(err, res){
          assert.equal(res.statusCode, 200);
        },
        'and it should also contain text in the body' : function(err, res){
          assert.equal(res.body, 'Query Layer API successfully started');
        }
      },
      'and a data document is returned then it' : {
        topic : function( /* Async action happens here */ ) {
            request({
              url: baseUrl + '/getDataDocument',
              method: 'GET'
            }, this.callback);
          },
        'should be a valid JSON document' : function(err, res){
          assert.isObject(res.body); // JSON?
        }
      },
      'and an array of documentIDs are returned they' : {
        topic : function( /* Async action happens here */ ) {
            request({
              url: baseUrl + '/getDocumentIDs',
              method: 'GET'
            }, this.callback);
          },
        'should be contained in an array' : function(err, res){
          var docIdsArray = JSON.parse(res.body); // Parse string to array
          assert.instanceOf(docIdsArray, Array); 
        }
      }
    }
  });

