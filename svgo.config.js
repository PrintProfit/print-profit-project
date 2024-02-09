export default {
  // This config makes svgo do everything it can to optimize an SVG.
  multipass: true,
  floatPrecision: 0, // Minimum possible precision
  plugins: [
    'preset-default',
    'cleanupListOfValues',
    'convertOneStopGradients',
    'removeElementsByAttr',
    'removeOffCanvasPaths',
    'removeRasterImages',
    'removeScriptElement',
    // 'removeStyleElement',
    'reusePaths',
  ],
};
