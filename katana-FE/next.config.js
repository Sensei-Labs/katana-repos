const path = require('path');

// next.config.js
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['antd'],
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true
    }
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')]
  }
};
