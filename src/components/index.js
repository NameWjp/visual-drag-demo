export default {
  install(app) {
    const requireComponents = require.context('./', true, /\.vue$/);

    requireComponents.keys().forEach((name) => {
      const componentConfig = requireComponents(name).default;
      let componentName;

      if (componentConfig.name) {
        // 组件定义名称则直接用组件的名称
        componentName = componentConfig.name;
      } else {
        const paths = name.split('/');
        // 否则用组件文件的名称
        componentName = paths[paths.length - 1].split('.')[0];
        // 如果组件名称是 index.vue 则取父文件夹的名称
        if (componentName === 'index') {
          componentName = paths[paths.length - 2];
        }
      }

      app.component(componentName, componentConfig);
    });
  },
};
