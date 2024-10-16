const plugin = (opts = {}) => {

  return {
    postcssPlugin: 'postcss-email-darkmode',
    AtRule: {
      media(atRule) {
        if (atRule.params.includes('prefers-color-scheme: dark')) {

          const otherRules = atRule.params.split('and').filter(rule => !rule.includes('prefers-color-scheme: dark')).map(rule => rule.trim());

          let newAtRule = false;

          if (otherRules.length) {
            newAtRule = atRule.clone({ params: otherRules.join(' and ') });
          }
          
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

            if (newAtRule) {
              newAtRule.append(newRule);
            } else {
              atRule.parent.insertAfter(prevRootRule, newRule);
              prevRootRule = newRule;
            }
            
          });

          if (newAtRule) {
            atRule.parent.insertAfter(atRule, newAtRule);
          }
        }
      }
    }
  }
};

plugin.postcss = true;

export default plugin;
