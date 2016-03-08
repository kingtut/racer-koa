"use strict"
var racer = require( "racer" );
var Transport = require("racer-transport-koa");
var c2k = require( "koa-connect" );

var defaultOptionsTransportServer = require( "./lib/defaults" );
var defaultOptionsTransportClient = require( "racer-react/lib/defaults" );

function Racer() {
  this.optionsRacer = {};
  this.optionsTransportServer = {};
  this.optionsTransportClient = {};
  this.plugins = [];
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
Racer.prototype.connect = function( app ){
  var racerStore = racer.createBackend( this.optionsRacer );
  app.use( c2k( racerStore.modelMiddleware() ) );

  for (var i = 0; i < this.plugins.length; i++) {
    var current = this.plugins[i];
    racerStore.use( current.plugin, current.options );
  }

  var transport = new Transport( racerStore, this.optionsTransportServer, this.optionsTransportClient );
  transport.connect( app );

  return racerStore;
}
Racer.prototype.use = function( plugin, options ){
  this.plugins.push({
    plugin: plugin,
    options: options
  });
  return this;
}

module.exports = Racer;
