module.exports = {
  apps: [{
    name: 'muddlingthroughcode.com',
    script: './bin/www'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-56-120-181.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/TheKeyPairofEric.pem',
      ref: 'origin/master',
      repo: 'git@github.com:ericconstantinides/muddlingthroughcode.com.git',
      path: '/home/ubuntu/Sites/muddlingthroughcode.com',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
