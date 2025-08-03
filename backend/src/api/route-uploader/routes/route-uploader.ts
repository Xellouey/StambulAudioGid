export default {
  routes: [
    {
      method: 'POST',
      path: '/route-uploader',
      handler: 'route-uploader.uploadRoute',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};