const { withAndroidManifest, AndroidConfig } = require("@expo/config-plugins");

const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } =
  AndroidConfig.Manifest;

module.exports = (config) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  return withAndroidManifest(config, async (config) => {
    if (!apiKey) {
      throw new Error("GOOGLE_MAPS_API_KEY environment variable is not set.");
    }

    const mainApplication = getMainApplicationOrThrow(config.modResults);

    addMetaDataItemToMainApplication(
      mainApplication,
      "com.google.android.geo.API_KEY",
      apiKey
    );

    return config;
  });
};
