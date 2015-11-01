'use strict'

let spawn = require('child_process').spawn
let dict = require('./dictionary')

var opts = "-i -h 17 -sb #346FCE -nb #151617 -fn Terminus-9".split(' ')

/**
 *  @param {array} command array of command and args
 *  @param {string} input feed to process thru stdin
 *
 *  @return {Promise}
 */
function exec(command, input) {
    return new Promise((resolve, reject) => {
        let cmd = command.shift(),
            args = command,
            child = spawn(cmd, args),
            output = ''

        child.stdin.setEncoding('utf8')

        child.stdout.on('data', (data) => {
            output += data
        })

        child.stderr.pipe(process.stderr)

        child.stdout.on('end', () => resolve(output))


        if (input !== undefined) {
            child.stdin.write(input)
        }

        child.stdin.end()
    })
}

exec(['dmenu'].concat(opts), Object.keys(dict).join('\n')).then((data) => {
    exec(['dmenu'].concat(opts), dict[data.trim()])
})
