'use strict';

var fs = require('fs-extra'),
_ = require('lodash'),
    sourceDir = '/home/ben/Downloads',
    targetDir = '/home/ben/OpenVPN',
    files = {
        'ca': 'ca.crt',
        'cert': 'client.crt',
        'key': 'client.key',
        'tls-auth': 'ta.key'
    };

fs.watch(sourceDir, function (event, filename) {
    if (filename.substr(filename.lastIndexOf('.')) === '.ovpn') {
        filename = sourceDir + '/' + filename;
        fs.exists(filename, function(exists) {

            if (exists) {
                var data = fs.readFileSync(filename).toString();

                var keys = '\n';

                _.each(files, function (file, tag) {
                    keys += '\n' + tag + ' ' + file;
                    fs.writeFileSync(targetDir + '/' + file, data.substring(data.indexOf('<' + tag + '>') + tag.length + 2, data.indexOf('</' + tag + '>')).trim('\n'));
                });

                var pos = data.indexOf('</tls-auth>') + 11;
                fs.writeFileSync(targetDir + '/client.ovpn', [data.slice(0, pos), keys, data.slice(pos)].join(''));

                fs.unlinkSync(filename);
            }
        });
    }
});

