const options = () => {
  return {
    dir: {
        src: "./test/src/vanillaHtml",
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
    htmlRenderer: 'vanillaHtml',
    cssRenderer: 'vanillaCss',
    server: {
        qrCode: false,
        port: 3030,
        openBrowser: false,
    }
  };
};

export default options;