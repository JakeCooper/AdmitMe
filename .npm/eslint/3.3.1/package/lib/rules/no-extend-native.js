/**
 * @fileoverview Rule to flag adding properties to native object's prototypes.
 * @author David Nelson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const globals = require("globals");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow extending native types",
            category: "Best Practices",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    exceptions: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        uniqueItems: true
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create: function(context) {

        const config = context.options[0] || {};
        const exceptions = config.exceptions || [];
        let modifiedBuiltins = Object.keys(globals.builtin).filter(function(builtin) {
            return builtin[0].toUpperCase() === builtin[0];
        });

        if (exceptions.length) {
            modifiedBuiltins = modifiedBuiltins.filter(function(builtIn) {
                return exceptions.indexOf(builtIn) === -1;
            });
        }

        return {

            // handle the Array.prototype.extra style case
            AssignmentExpression: function(node) {
                const lhs = node.left;

                if (lhs.type !== "MemberExpression" || lhs.object.type !== "MemberExpression") {
                    return;
                }

                const affectsProto = lhs.object.computed ?
                    lhs.object.property.type === "Literal" && lhs.object.property.value === "prototype" :
                    lhs.object.property.name === "prototype";

                if (!affectsProto) {
                    return;
                }

                modifiedBuiltins.forEach(function(builtin) {
                    if (lhs.object.object.name === builtin) {
                        context.report(node, builtin + " prototype is read only, properties should not be added.");
                    }
                });
            },

            // handle the Object.definePropert[y|ies](Array.prototype) case
            CallExpression: function(node) {

                const callee = node.callee;

                // only worry about Object.definePropert[y|ies]
                if (callee.type === "MemberExpression" &&
                    callee.object.name === "Object" &&
                    (callee.property.name === "defineProperty" || callee.property.name === "defineProperties")) {

                    // verify the object being added to is a native prototype
                    const subject = node.arguments[0];
                    const object = subject && subject.object;

                    if (object &&
                        object.type === "Identifier" &&
                        (modifiedBuiltins.indexOf(object.name) > -1) &&
                        subject.property.name === "prototype") {

                        context.report(node, object.name + " prototype is read only, properties should not be added.");
                    }
                }

            }
        };

    }
};
