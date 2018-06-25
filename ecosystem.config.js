module.exports = {
  apps: [{
    name: 'muddlingthroughcode.com',
    script: './bin/www'
  }],
  deploy: {
    production: {
      user: 'eric',
      host: 'eric2',
      // key: '~/.ssh/id_rsa.pub',
      ref: 'origin/master',
      repo: 'git@github.com:ericconstantinides/muddlingthroughcode.com.git',
      path: '/var/www/node/muddlingthroughcode.com',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
