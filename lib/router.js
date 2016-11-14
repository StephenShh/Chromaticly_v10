import { Curations } from '../imports/db/databases.js';


FlowRouter.route('/', {
    action: function(params) {
        // BlazeLayout.render("queue");
        FlowRouter.go('/loadScreen');
    }
});

FlowRouter.route('/loadScreen', {
    action: function(params) {
        BlazeLayout.render("loadScreen");
    }
});

FlowRouter.route('/queue', {
    action: function(params) {
        BlazeLayout.render("queue");
    }
});

FlowRouter.route('/entry', {
    action: function(params) {
        BlazeLayout.render("entry");
    }
});

FlowRouter.route('/flush', {
    action: function(params) {

        Meteor.call('flushDatabase');

        FlowRouter.go('/queue');
        // BlazeLayout.render("entry");
    }
});