const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androidManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;

    androidManifest.application[0]["meta-data"] =
      androidManifest.application[0]["meta-data"].map((res) => {
        if (res.$["android:name"] == "com.google.android.geo.API_KEY") {
          res.$["android:value"] = process.env.GOOGLE_MAPS_API_KEY;
        }

        return res;
      });

    return config;
  });
};
