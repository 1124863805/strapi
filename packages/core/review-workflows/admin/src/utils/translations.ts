type TradOptions = Record<string, string>;

const prefixPluginTranslations = (trad: TradOptions, pluginId: string): TradOptions => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    // Settings.review-workflows.* keys are used at root level by admin Settings page
    if (current.startsWith('Settings.review-workflows.')) {
      acc[current] = trad[current];
    } else {
      acc[`${pluginId}.${current}`] = trad[current];
    }
    return acc;
  }, {} as TradOptions);
};

export { prefixPluginTranslations };
