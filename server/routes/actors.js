/*jshint maxstatements:50 */
/*global
  console:false
  */

'use strict';
var uuid = require('node-uuid');

exports = module.exports = function(db) {

    if (!db) {
        throw new Error('No database configured');
    }

    var exports = {};

    function getAbsoluteUriBase(req) {
        // we use req.get('host') as this also gives us the port
        return req.protocol + '://' + req.get('host');
    }

    exports.getActors = function(req, res) {
        db.getIndexedNodes('node_auto_index', 'type', 'actor', function(err, nodes) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            // fallback in case no movies are stored in the database
            nodes = nodes || [];

            var actors = nodes.map(function(node) {
                return node.data;
            });

            res.send(actors);
        });
    };


    exports.getActor = function(req, res) {
        var id = req.params.id;

        db.getIndexedNode('node_auto_index', 'id', id, function(err, node) {
            if (err) {
                res.status(500).send();
                console.error(err);
            } else if (!node) {
                res.status(404).send();
            } else {
                res.send(node.data);
            }
        });
    };


    exports.deleteActor = function(req, res) {
        var id = req.params.id;
        console.log('Deleting actor ' + id);

        var cypher = 'START node=node:node_auto_index(id={id}) ' +
            'MATCH node-[relationship?]-() ' +
            'DELETE node, relationship';
        db.query(cypher, {
            id: id
        }, function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            res.status(204).send();
        });
    };


    exports.addActor = function(req, res) {
        var node = db.createNode(req.body);
        node.data.type = 'actor';
        node.data.id = uuid.v4();
        node.save(function(err, savedNode) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            res.status(201)
                .header('Location', getAbsoluteUriBase(req) +
                '/actors/' + node.data.id)
                .send(savedNode.data);
        });
    };


    exports.updateActor = function(req, res) {
        var id = req.params.id;
        db.getIndexedNode('node_auto_index', 'id', id, function(err, node) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            } else if (!node) {
                return res.status(404).send();
            }
            node.data.name = req.body.name;
            node.data.biography = req.body.biography;
            node.save(function(err, savedNode) {
                if (err) {
                    console.error(err);
                    return res.status(500).send();
                }

                res.send(savedNode.data);
            });
        });
    };

    return exports;
};