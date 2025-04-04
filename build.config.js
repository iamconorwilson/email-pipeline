const options = () => {
  return {
    dir: {
      src: "./test/src/nunjucks",
      dest: "./test/dist",
    },
    passthrough: [
      // {
      //     src: './test/src/sass/passthrough/*',
      //     dest: './test/dist/css'
      // },
      // {
      //   src: './test/src/assets/images-assets/*',
      //   dest: './test/dist/images'
      // }
    ],
    htmlRenderer: 'nunjucks',
    cssRenderer: 'sass',
    server: {
      qrCode: false,
      port: 3030,
      openBrowser: false,
    }
  };
};

export default options;