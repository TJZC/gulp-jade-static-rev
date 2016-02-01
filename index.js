var path = require('path');
var fs = require('fs');
var url = require('url');
var crypto = require('crypto');

var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'gulp-jade-static-rev';

var ASSET_REG = {
    'script': /(<script[^>]+?src=['"]?)([^'"]+)(["']?)/ig,
    'stylesheet': /(<link[^>]+?href=['"]?)([^'"]+)(["']?)/ig,
    'image': /(<img[^>]+?src=['"]?)([^'"]+)(["']?)/ig,
    'background': /(url\(['"]?)(?!data:|http:|about:)([\w@\-\/\.]+)(["']?.*?\)?)/ig,
    'background-empty': /(url\(?)(?!data:|http:|about:)([\w@\-\/\.]+)(\)?)/ig,
    'jade-script': /(script[^\(\)]*\([^\)]*?src=['"]?)([^'"\s]+)(["']?)/ig,
    'jade-script-require': /(script[^\(\)]*\([^\)]*?data-main=['"]?)([^'"\s]+)(["']?)/ig,
    'jade-css': /(link[^\(\)]*\([^\)]*?href=['"]?)([^'"\s]+)(["']?)/ig,
    'jade-images': /(img[^\(\)]*\([^\)]*?src=['"]?)([^'"\s]+)(["']?)/ig
};

function replacePath(src, data){
    var extname = path.extname(src);
    var basename = path.basename(src, extname);
    var _static;
    var assets;
    var extname2;
    var srcObj = {
        src: src,
        require: false
    };
    for(var key in data){
        if(basename === key){
            _static = data[key];
            if(typeof _static !== 'string'){
                for(var i=0, len=_static.length; i<len; i++){
                    assets = _static[i];
                    extname2 = path.extname(assets);
                    if(extname == extname2){
                        src = assets;
                    }
                }
            } else {
                extname2 = path.extname(_static);
                if(extname == extname2){
                    src = _static;
                }
            }

            srcObj = {
                src: src,
                require: true
            }


        }
    }

    return srcObj;
}

module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        options = options || {};

        if (file.isNull()) {
            this.push(file);

            return cb();

        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));

            return cb();

        }

        var content = file.contents.toString();

        for (var type in ASSET_REG) {
            content = content.replace(ASSET_REG[type], function (str, tag, src, _tag) {
                src = src.replace(/\s/g, '');
                _tag = _tag.replace(/\s/g, '');
                var srcObj = replacePath(src, options.assets);

                if(!srcObj.require){
                    return tag + src + _tag
                }


                src = options.root + srcObj.src;

                return tag + src + _tag;

            });

        }

        file.contents = new Buffer(content);
        this.push(file);

        cb();

    });

};
