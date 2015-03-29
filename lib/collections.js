Lists = new Mongo.Collection('lists');

// Calculate a default name for a list in the form of 'List A'
Lists.defaultName = function() {
  var nextLetter = 'A', nextName = 'List ' + nextLetter;
  while (Lists.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'List ' + nextLetter;
  }

  return nextName;
};

Todos = new Mongo.Collection('todos');

Area = new Meteor.Collection(‘area');
Blocks = new Meteor.Collection('blocks');
Locations = new Meteor.Collection('locations');
Profiles = new Meteor.Collection('profiles');
Events = new Meteor.Collection('events');
Persons = new Meteor.Collection('persons');


/*
An event has messsages, check-ins,

*/