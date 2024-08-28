const plugin = (opts = {}) => {

  return {
    postcssPlugin: 'postcss-email-darkmode',
    AtRule: {
      media(atRule) {
        if (atRule.params.includes('prefers-color-scheme: dark')) {

          let prevRootRule = atRule;

          atRule.walkRules((rule) => {
            const newRule = rule.clone();

            if (newRule.selector.includes(',')) {
              const selectors = newRule.selector.split(',');

              selectors.forEach((selector, index) => {
                selectors[index] = `[data-ogsb] ${selector.trim()}`
              });

              newRule.selector = selectors.join(', ');
            } else {
              newRule.selector = `[data-ogsb] ${newRule.selector}`;
            }

            atRule.parent.insertAfter(prevRootRule, newRule);

            prevRootRule = newRule;

          });
        }
      }
    }
  }
};

plugin.postcss = true;

export default plugin;
