var vows = require('vows'),
    request = require('request'),
    assert = require('assert');

var cassandraQueryLayerTestSuite = vows.describe('cassandraQueryLayerTestSuite');
var baseUrl = 'http://127.0.0.1:8080';

cassandraQueryLayerTestSuite.addBatch({
  
  'When a call is made to the cluster' : {
    'to run queries via the REST api, then firstly the server ' :  {
      topic : function() {
        request({
          method: 'GET',
          url: baseUrl 
        }, this.callback);
      },
      'should respond with a statuscode of 200 OK so we know it is healthy' : function(err, res){
        assert.equal(res.statusCode, 200);
      }
    },
    'to get customer details via accountnumber then it ' :  {
      topic : function() {
        request({
          method: 'GET',
          url: baseUrl + '/customers/21988510' // Hard code in an accountnumber here?...
        }, this.callback);
      },'should return customer details that contain a matching accountnumber' : function(err, res){
        var customerDetails = JSON.parse(res.body);  // Parse string to array
        assert.equal(customerDetails.rows[0].accountnumber, 21988510); 
      }
    },
    'to get a list of distinct products then it ' :  {
      topic : function() {
        request({
          method: 'GET',
          url: baseUrl + '/products/'
        }, this.callback);
      },'should return a list of products with none repeated' : function(err, res){
        var listOfProducts = JSON.parse(res.body); 
        assert.lengthOf(listOfProducts.rows, 10); // Assert here a number of products returned? The api query is currently limited to 10 otherwise it will return the default limit of 10,000
      }
    },
    'to get a list of products by a specified line then it ' :  {
      topic : function() {
        request({
          method: 'GET',
          url: baseUrl + '/products/GT239' // Better way to do this without hardcoding a productline value?
        }, this.callback);
      },'should return a list of products' : function(err, res){
        var listOfProducts = JSON.parse(res.body); 
        assert.isNotNull(listOfProducts.rows); 
      },'and the list should contain at least one product that is in the line specified' : function(err, res){
        var listOfProducts = JSON.parse(res.body); 
        assert.equal(listOfProducts.rows[0].line, "GT239"); 
      }
    },
    'to get the attributes of a product by specified line & option then it ' :  {
      topic : function() {
        request({
          method: 'GET',
          url: baseUrl + '/products/GT239/options/GT240' // Better way to do this without hardcoding productline and option values?
        }, this.callback);
      },'should return a valid product' : function(err, res){
        var product = JSON.parse(res.body); 
        assert.isNotNull(product.rows);
      },'and the product should contain valid values for line, option and attributes' : function(err, res){
        var product = JSON.parse(res.body); 
        assert.equal(product.rows[0].line, "GT239"); 
        assert.equal(product.rows[0].option, "GT240"); 
        assert.isNotNull(product.rows[0].attributes); 
      }
    }
  }
}).export(module);