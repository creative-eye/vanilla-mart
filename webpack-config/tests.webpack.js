const testsContext = require.context('../src/__tests__', true, /-test\.js$/);
testsContext.keys().forEach(testsContext);

const srcContext = require.context('../src/js', true, /!(-test\.js)$/);
srcContext.keys().forEach(srcContext);
