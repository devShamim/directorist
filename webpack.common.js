const path                 = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin      = require('vue-loader/lib/plugin');

const commonConfig = {
  resolve: {
    extensions: [ '.js', '.vue' ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      // Loading Images
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "../images",
            },
          },
        ],
      },
      // Loading Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "../fonts",
          },
        },
      },
      // Loading JS
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@wordpress/default"],
            }
          },
        ]
      },
      // Loading SASS
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development",
              reloadAll: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            }
          },
          'resolve-url-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
              sassOptions: {
                // outputStyle: 'compressed',
              },
            },
          },
        ],
      },
    ],
  },

  // devtool: 'source-map'
};

// Main Config
const MainConfig = {
  entry: {
    // Public
    // -------------------------------------------
    // JS
    ['main']: ["./assets/src/js/main.js"],
    ['global']: ["./assets/src/js/global.js"],
    ['checkout']: ["./assets/src/js/checkout.js"],
    ['search-listing']: ["./assets/src/js/components/search-listing.js"],
    ['search-form-listing']: ["./assets/src/js/components/search-form-listing.js"],
    
    ['single-listing-openstreet-map-custom-script']: ["./assets/src/js/map-scripts/single-listing/openstreet-map.js"],
    ['single-listing-gmap-custom-script']: ["./assets/src/js/map-scripts/single-listing/google-map.js"],
   
    ['atmodal']: ["./assets/src/js/modules/atmodal.js"],
    ['releated-listings-slider']: ["./assets/src/js/components/releated-listings-slider.js"],
    ['login']: ["./assets/src/js/components/login.js"],

    // CSS
    ['search-style']: ["./assets/src/scss/layout/public/search-style.scss"],
    ['openstreet-map']: ["./assets/src/scss/component/openstreet-map/index.scss"],

    // Admin
    // -------------------------------------------
    ['admin']: "./assets/src/js/admin/admin.js",
    ['custom-field']: "./assets/src/js/admin/custom-field.js",
    ['extension-update']: "./assets/src/js/admin/extension-update.js",
    ['import-export']: "./assets/src/js/admin/import-export.js",
    ['plugins']: "./assets/src/js/admin/plugins.js",
    ['setup-wizard']: "./assets/src/js/admin/setup-wizard.js",
    ['multi-directory-archive']: "./assets/src/js/admin/multi-directory-archive.js",
    ['multi-directory-builder']: "./assets/src/js/admin/multi-directory-builder.js",
    ['settings-manager']: "./assets/src/js/admin/settings-manager.js",

    // CSS
    ['drag-drop']: "./assets/src/scss/layout/admin/drag_drop.scss",

    // Global
    // -------------------------------------------
    // JS
    ['geolocation']: ["./assets/src/js/map-scripts/geolocation.js"],
    ['geolocation-widget']: ["./assets/src/js/map-scripts/geolocation-widget.js"],
    ['directorist-plupload']: "./assets/src/js/admin/directorist-plupload.js",
    ['pure-select']: ["./assets/src/js/modules/pureScriptSearchSelect.js"],
    ['load-osm-map']: ["./assets/src/js/map-scripts/load-osm-map.js"],
    ['map-view']: ["./assets/src/js/map-scripts/map-view.js"],
    ['markerclusterer']: ["./assets/src/js/map-scripts/markerclusterer.js"],
    ['add-listing']: ["./assets/src/js/add-listing.js"],
    ['add-listing-openstreet-map-custom-script']: ["./assets/src/js/map-scripts/add-listing/openstreet-map.js"],
    ['add-listing-gmap-custom-script']: ["./assets/src/js/map-scripts/add-listing/google-map.js"],
  },

  output: {
    path: path.resolve(__dirname, "assets/js/"),
  },

  ...commonConfig
};

module.exports = [ MainConfig ];
