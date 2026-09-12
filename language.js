(() => {
    const languages = ["zh-Hans", "zh-Hant", "en", "fr"];
    const storageKey = "coaster-tool-language";
    const root = document.documentElement;
    const page = root.dataset.page;
    const currentLanguage = root.dataset.language;

    function browserLanguage() {
        const preferred = navigator.languages?.length
            ? navigator.languages
            : [navigator.language];

        for (const language of preferred) {
            const [base, ...subtags] = (language || "").toLowerCase().replaceAll("_", "-").split("-");
            if (base === "zh") {
                if (subtags.includes("hant")) return "zh-Hant";
                if (subtags.includes("hans")) return "zh-Hans";
                return subtags.some(part => ["tw", "hk", "mo"].includes(part)) ? "zh-Hant" : "zh-Hans";
            }
            if (base === "en" || base === "fr") return base;
        }

        return "en";
    }

    function savedLanguage() {
        try {
            const language = localStorage.getItem(storageKey);
            return languages.includes(language) ? language : null;
        } catch {
            return null;
        }
    }

    function saveLanguage(language) {
        try {
            if (language) localStorage.setItem(storageKey, language);
            else localStorage.removeItem(storageKey);
        } catch {
            // Language links and automatic detection also work without storage.
        }
    }

    function languageURL(language) {
        const prefix = currentLanguage ? "../" : "./";
        const url = new URL(`${prefix}${language}/${page}`, location.href);
        url.search = location.search;
        url.hash = location.hash;
        return url;
    }

    // Explicit language URLs stay in that language, including shared links.
    // Only the original, language-neutral entry pages redirect automatically.
    if (!currentLanguage) {
        location.replace(languageURL(savedLanguage() || browserLanguage()).href);
    }

    document.querySelectorAll("[data-language-link]").forEach(link => {
        link.addEventListener("click", () => saveLanguage(link.dataset.languageLink));
    });

    document.querySelectorAll("[data-auto-language]").forEach(button => {
        button.hidden = false;
        button.addEventListener("click", () => {
            saveLanguage(null);
            location.assign(languageURL(browserLanguage()).href);
        });
    });
})();
