module.exports = {
  dependencies: {
    'react-native-track-player': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-track-player/android',
          packageImportPath:
            'import com.doublesymmetry.trackplayer.TrackPlayerPackage;',
        },
      },
    },
  },
};
