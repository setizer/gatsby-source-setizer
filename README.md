# gatsby-source-setizer

Manage source from Google Sheets generated by the SetizerCMS

## Set The Config

In `gatsby-config.js`:

```js
module.exports = {
    plugins: [
        {
            resolve: 'gatsby-source-setizer',
            options: {
                url: config.URL,
                token: config.TOKEN,
            },
        },
    ],
}
```
