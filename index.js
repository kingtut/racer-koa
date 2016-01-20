"use strict"
var highway = require( "racer-highway" );
var racer = require( "racer" );
var c2k = require( "koa-connect" );

var defaultOptionsTransportServer = require( "./lib/defaults" );
var defaultOptionsTransportClient = require( "racer-react/lib/defaults" );

function Racer() {
  this.optionsRacer = {};
  this.optionsTransportServer = {};
  this.optionsTransportClient = {};
}
Racer.prototype.createBackend = function( optionsRacer ){
  this.optionsRacer = optionsRacer;
  return this;
}
Racer.prototype.createTransport = function( optionsServer, optionsClient ){
  this.optionsTransportServer = Object.assign( {}, defaultOptionsTransportServer, optionsServer );
  this.optionsTransportClient = Object.assign( {}, defaultOptionsTransportClient, optionsClient );
  return this;
}
Racer.prototype.use = function( app ){
  // var store = racer.createStore( this.optionsRacer );
  var racerStore = racer.createBackend( this.optionsRacer );
  var transport = highway( racerStore, this.optionsTransportServer, this.optionsTransportClient );
  app
    .use( c2k( racerStore.modelMiddleware() ) )
    .use( c2k( transport.middleware ) );
  return transport;
}

module.exports = Racer;
