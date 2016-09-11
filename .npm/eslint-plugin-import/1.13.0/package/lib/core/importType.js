'use strict';

exports.__esModule = true;
exports.isBuiltIn = isBuiltIn;
exports.default = resolveImportType;

var _lodash = require('lodash.cond');

var _lodash2 = _interopRequireDefault(_lodash);

var _builtinModules = require('builtin-modules');

var _builtinModules2 = _interopRequireDefault(_builtinModules);

var _path = require('path');

var _resolve = require('./resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constant(value) {
  return function () {
    return value;
  };
}

function isBuiltIn(name, settings) {
  var extras = settings && settings['import/core-modules'] || [];
  return _builtinModules2.default.indexOf(name) !== -1 || extras.indexOf(name) > -1;
}

function isExternalPath(path, name, settings) {
  var folders = settings && settings['import/external-module-folders'] || ['node_modules'];
  return !path || folders.some(function (folder) {
    return -1 < path.indexOf((0, _path.join)(folder, name));
  });
}

var externalModuleRegExp = /^\w/;
function isExternalModule(name, settings, path) {
  return externalModuleRegExp.test(name) && isExternalPath(path, name, settings);
}

var scopedRegExp = /^@\w+\/\w+/;
function isScoped(name) {
  return scopedRegExp.test(name);
}

function isInternalModule(name, settings, path) {
  return externalModuleRegExp.test(name) && !isExternalPath(path, name, settings);
}

function isRelativeToParent(name) {
  return name.indexOf('../') === 0;
}

var indexFiles = ['.', './', './index', './index.js'];
function isIndex(name) {
  return indexFiles.indexOf(name) !== -1;
}

function isRelativeToSibling(name) {
  return name.indexOf('./') === 0;
}

var typeTest = (0, _lodash2.default)([[isBuiltIn, constant('builtin')], [isExternalModule, constant('external')], [isScoped, constant('external')], [isInternalModule, constant('internal')], [isRelativeToParent, constant('parent')], [isIndex, constant('index')], [isRelativeToSibling, constant('sibling')], [constant(true), constant('unknown')]]);

function resolveImportType(name, context) {
  return typeTest(name, context.settings, (0, _resolve2.default)(name, context));
}
//# sourceMappingURL=data:application/json;base64,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SUFBM0IsRUFBaUMsT0FBakMsRUFBMEM7QUFDdkQsU0FBTyxTQUFTLElBQVQsRUFBZSxRQUFRLFFBQXZCLEVBQWlDLHVCQUFRLElBQVIsRUFBYyxPQUFkLENBQWpDLENBQVA7QUFDRCIsImZpbGUiOiJjb3JlL2ltcG9ydFR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29uZCBmcm9tICdsb2Rhc2guY29uZCdcbmltcG9ydCBidWlsdGluTW9kdWxlcyBmcm9tICdidWlsdGluLW1vZHVsZXMnXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnLi9yZXNvbHZlJ1xuXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gKCkgPT4gdmFsdWVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQnVpbHRJbihuYW1lLCBzZXR0aW5ncykge1xuICBjb25zdCBleHRyYXMgPSAoc2V0dGluZ3MgJiYgc2V0dGluZ3NbJ2ltcG9ydC9jb3JlLW1vZHVsZXMnXSkgfHwgW11cbiAgcmV0dXJuIGJ1aWx0aW5Nb2R1bGVzLmluZGV4T2YobmFtZSkgIT09IC0xIHx8IGV4dHJhcy5pbmRleE9mKG5hbWUpID4gLTFcbn1cblxuZnVuY3Rpb24gaXNFeHRlcm5hbFBhdGgocGF0aCwgbmFtZSwgc2V0dGluZ3MpIHtcbiAgY29uc3QgZm9sZGVycyA9IChzZXR0aW5ncyAmJiBzZXR0aW5nc1snaW1wb3J0L2V4dGVybmFsLW1vZHVsZS1mb2xkZXJzJ10pIHx8IFsnbm9kZV9tb2R1bGVzJ11cbiAgcmV0dXJuICFwYXRoIHx8IGZvbGRlcnMuc29tZShmb2xkZXIgPT4gLTEgPCBwYXRoLmluZGV4T2Yoam9pbihmb2xkZXIsIG5hbWUpKSlcbn1cblxuY29uc3QgZXh0ZXJuYWxNb2R1bGVSZWdFeHAgPSAvXlxcdy9cbmZ1bmN0aW9uIGlzRXh0ZXJuYWxNb2R1bGUobmFtZSwgc2V0dGluZ3MsIHBhdGgpIHtcbiAgcmV0dXJuIGV4dGVybmFsTW9kdWxlUmVnRXhwLnRlc3QobmFtZSkgJiYgaXNFeHRlcm5hbFBhdGgocGF0aCwgbmFtZSwgc2V0dGluZ3MpXG59XG5cbmNvbnN0IHNjb3BlZFJlZ0V4cCA9IC9eQFxcdytcXC9cXHcrL1xuZnVuY3Rpb24gaXNTY29wZWQobmFtZSkge1xuICByZXR1cm4gc2NvcGVkUmVnRXhwLnRlc3QobmFtZSlcbn1cblxuZnVuY3Rpb24gaXNJbnRlcm5hbE1vZHVsZShuYW1lLCBzZXR0aW5ncywgcGF0aCkge1xuICByZXR1cm4gZXh0ZXJuYWxNb2R1bGVSZWdFeHAudGVzdChuYW1lKSAmJiAhaXNFeHRlcm5hbFBhdGgocGF0aCwgbmFtZSwgc2V0dGluZ3MpXG59XG5cbmZ1bmN0aW9uIGlzUmVsYXRpdmVUb1BhcmVudChuYW1lKSB7XG4gIHJldHVybiBuYW1lLmluZGV4T2YoJy4uLycpID09PSAwXG59XG5cbmNvbnN0IGluZGV4RmlsZXMgPSBbJy4nLCAnLi8nLCAnLi9pbmRleCcsICcuL2luZGV4LmpzJ11cbmZ1bmN0aW9uIGlzSW5kZXgobmFtZSkge1xuICByZXR1cm4gaW5kZXhGaWxlcy5pbmRleE9mKG5hbWUpICE9PSAtMVxufVxuXG5mdW5jdGlvbiBpc1JlbGF0aXZlVG9TaWJsaW5nKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUuaW5kZXhPZignLi8nKSA9PT0gMFxufVxuXG5jb25zdCB0eXBlVGVzdCA9IGNvbmQoW1xuICBbaXNCdWlsdEluLCBjb25zdGFudCgnYnVpbHRpbicpXSxcbiAgW2lzRXh0ZXJuYWxNb2R1bGUsIGNvbnN0YW50KCdleHRlcm5hbCcpXSxcbiAgW2lzU2NvcGVkLCBjb25zdGFudCgnZXh0ZXJuYWwnKV0sXG4gIFtpc0ludGVybmFsTW9kdWxlLCBjb25zdGFudCgnaW50ZXJuYWwnKV0sXG4gIFtpc1JlbGF0aXZlVG9QYXJlbnQsIGNvbnN0YW50KCdwYXJlbnQnKV0sXG4gIFtpc0luZGV4LCBjb25zdGFudCgnaW5kZXgnKV0sXG4gIFtpc1JlbGF0aXZlVG9TaWJsaW5nLCBjb25zdGFudCgnc2libGluZycpXSxcbiAgW2NvbnN0YW50KHRydWUpLCBjb25zdGFudCgndW5rbm93bicpXSxcbl0pXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc29sdmVJbXBvcnRUeXBlKG5hbWUsIGNvbnRleHQpIHtcbiAgcmV0dXJuIHR5cGVUZXN0KG5hbWUsIGNvbnRleHQuc2V0dGluZ3MsIHJlc29sdmUobmFtZSwgY29udGV4dCkpXG59XG4iXX0=