const sources = [
    {
        "sourceType": "user",
        "fetch": "/api/__sitemap__/urls"
    },
    {
        "context": {
            "name": "sitemap:urls",
            "description": "Set with the `sitemap.urls` config."
        },
        "urls": [],
        "sourceType": "user"
    },
    {
        "context": {
            "name": "nuxt:pages",
            "description": "Generated from your static page files.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:pages'] }`."
            ]
        },
        "urls": [
            {
                "loc": "/admin"
            },
            {
                "loc": "/admin/sAdmin/admin-product"
            },
            {
                "loc": "/admin/sAdmin"
            },
            {
                "loc": "/admin/yAdmin"
            },
            {
                "loc": "/"
            },
            {
                "loc": "/product"
            }
        ],
        "sourceType": "app"
    }
];

export { sources };
//# sourceMappingURL=global-sources.mjs.map
