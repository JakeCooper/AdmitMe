/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function ( /*istanbul ignore next*/_ref) {
  /*istanbul ignore next*/var messages = _ref.messages;

  return {
    visitor: { /*istanbul ignore next*/
      ReferencedIdentifier: function ReferencedIdentifier(path) {
        /*istanbul ignore next*/var node = path.node;
        /*istanbul ignore next*/var scope = path.scope;


        var binding = scope.getBinding(node.name);
        if (binding && binding.kind === "type" && !path.parentPath.isFlow()) {
          throw path.buildCodeFrameError(messages.get("undeclaredVariableType", node.name), ReferenceError);
        }

        if (scope.hasBinding(node.name)) return;

        // get the closest declaration to offer as a suggestion
        // the variable name may have just been mistyped

        var bindings = scope.getAllBindings();

        var closest = /*istanbul ignore next*/void 0;
        var shortest = -1;

        for (var name in bindings) {
          var distance = /*istanbul ignore next*/(0, _leven2.default)(node.name, name);
          if (distance <= 0 || distance > 3) continue;
          if (distance <= shortest) continue;

          closest = name;
          shortest = distance;
        }

        var msg = /*istanbul ignore next*/void 0;
        if (closest) {
          msg = messages.get("undeclaredVariableSuggestion", node.name, closest);
        } else {
          msg = messages.get("undeclaredVariable", node.name);
        }

        //

        throw path.buildCodeFrameError(msg, ReferenceError);
      }
    }
  };
};

var /*istanbul ignore next*/_leven = require("leven");

/*istanbul ignore next*/
var _leven2 = _interopRequireDefault(_leven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];