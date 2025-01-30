export const SITE = {
    website: "https://pho.biurad.com/", // replace this with your deployed domain
    author: "Niiquaye Divine Ibok",
    profile: "https://divinenii.com/",
    desc: "A powerful template for modern Expo/Next.js apps",
    title: "PHO Monorepo",
    postPerIndex: 4,
    postPerPage: 6,
    blog: {
        edit: {
            url: "https://github.com/divineniiquaye/pho-monorepo/edit/main/_site/content/blog",
            text: "Suggest Changes",
            appendFilePath: true,
        },
        features: [],
    },
    docs: {
        edit: {
            url: "https://github.com/divineniiquaye/pho-monorepo/edit/main/_site/content/docs",
            text: "Suggest Changes",
            appendFilePath: true,
        },
        sidebar: {
            introduction: {
                title: "Introduction",
                order: 1,
                items: [],
            },
            "get-started": {
                title: "Getting Started",
                order: 2,
                items: [],
            },
        },
    },
};

export const LOCALE = {
    lang: "en", // html lang code. Set this empty and default will be "en"
    langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;
