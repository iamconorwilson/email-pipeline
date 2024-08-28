const options = () => {
  return {
    dir: {
        src: "./test/src",
        dest: "./test/build",
    },
    passthrough: [
        {
            src: './test/src/sass/passthrough/*',
            dest: './test/build/css'
        },
        {
          src: './test/src/assets/images-assets/*',
          dest: './test/build/images'
        }
    ],
    server: {
        qrCode: false,
        port: 3030,
        openBrowser: false,
    }
  };
};

export default options;