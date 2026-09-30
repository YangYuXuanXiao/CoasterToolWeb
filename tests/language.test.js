const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const script = fs.readFileSync(path.join(root, "language.js"), "utf8");
const locales = ["zh-Hans", "zh-Hant", "en", "fr", "ja", "ar"];
const storageKey = "coaster-tool-language";

function loadPage({
    languages = ["en-US"], language = "en-US", saved = null,
    current, page = "index.html", blockedStorage = false,
    href = `https://example.com/CoasterToolWeb/${current ? `${current}/` : ""}${page}`,
} = {}) {
    const storage = new Map(saved ? [[storageKey, saved]] : []);
    const visits = [];
    const links = locales.map(locale => ({
        dataset: { languageLink: locale },
        addEventListener(event, handler) { this[event] = handler; },
    }));
    const automatic = {
        hidden: true,
        addEventListener(event, handler) { this[event] = handler; },
    };
    const url = new URL(href);
    vm.runInNewContext(script, {
        URL,
        navigator: { languages, language },
        document: {
            documentElement: { dataset: { language: current, page } },
            querySelectorAll: selector => selector === "[data-language-link]" ? links : [automatic],
        },
        location: {
            href: url.href, search: url.search, hash: url.hash,
            replace: href => visits.push({ method: "replace", href }),
            assign: href => visits.push({ method: "assign", href }),
        },
        localStorage: {
            getItem(key) {
                if (blockedStorage) throw new Error("Storage unavailable");
                return storage.get(key) ?? null;
            },
            setItem(key, value) {
                if (blockedStorage) throw new Error("Storage unavailable");
                storage.set(key, value);
            },
            removeItem(key) {
                if (blockedStorage) throw new Error("Storage unavailable");
                storage.delete(key);
            },
        },
    });
    return { visits, storage, links, automatic };
}

for (const [languages, expected] of [
    [["zh-CN"], "zh-Hans"], [["zh-SG"], "zh-Hans"], [["zh"], "zh-Hans"],
    [["zh-TW"], "zh-Hant"], [["zh-HK"], "zh-Hant"], [["zh-MO"], "zh-Hant"],
    [["zh-Hans-HK"], "zh-Hans"], [["zh-Hant-CN"], "zh-Hant"],
    [["ZH_hant_TW"], "zh-Hant"], [["en-GB"], "en"], [["fr-CA"], "fr"],
    [["de-DE", "fr-FR", "en-US"], "fr"], [["en-US", "zh-TW"], "en"],
    [["ja-JP"], "ja"], [["ja"], "ja"], [["ar-SA"], "ar"], [["ar-EG"], "ar"],
    [["AR_ae"], "ar"], [["ar"], "ar"], [["de-DE", "ja-JP", "ar-SA"], "ja"],
    [["ar-EG", "fr-FR"], "ar"], [["de-DE"], "en"],
]) {
    test(`browser languages ${languages.join(", ")} resolve to ${expected}`, () => {
        assert.deepEqual(loadPage({ languages }).visits, [{
            method: "replace", href: `https://example.com/CoasterToolWeb/${expected}/index.html`,
        }]);
    });
}

test("uses navigator.language when the language list is unavailable or empty", () => {
    for (const languages of [null, []]) {
        assert.match(loadPage({ languages, language: "fr-FR" }).visits[0].href, /\/fr\/index.html$/);
    }
});

test("saved manual choices take priority on both original entry pages", () => {
    for (const page of ["index.html", "privacy.html"]) {
        for (const saved of locales) {
            assert.match(loadPage({ saved, page, languages: ["ja-JP"] }).visits[0].href,
                new RegExp(`/${saved}/${page.replace(".", "\\.")}$`));
        }
    }
});

test("invalid preferences and unavailable storage fall back to browser detection", () => {
    for (const options of [{ saved: "../../unexpected" }, { blockedStorage: true }]) {
        assert.match(loadPage({ ...options, languages: ["fr-FR"] }).visits[0].href, /\/fr\/index.html$/);
    }
});

test("entry redirects retain the document, repository path, query and fragment", () => {
    for (const prefix of ["/", "/CoasterToolWeb/"]) {
        const href = `https://example.com${prefix}privacy.html?source=app#contact`;
        assert.equal(loadPage({ href, page: "privacy.html", languages: ["zh-TW"] }).visits[0].href,
            `https://example.com${prefix}zh-Hant/privacy.html?source=app#contact`);
        assert.equal(loadPage({ href: `https://example.com${prefix}`, languages: ["fr"] }).visits[0].href,
            `https://example.com${prefix}fr/index.html`);
    }
});

test("explicit language URLs stay put without overwriting a manual preference", () => {
    for (const current of locales) {
        const result = loadPage({ current, saved: "fr", languages: ["zh-CN"] });
        assert.deepEqual(result.visits, []);
        assert.equal(result.storage.get(storageKey), "fr");
    }
});

test("manual links save the choice for later entry visits", () => {
    const result = loadPage({ current: "en" });
    for (const link of result.links) {
        link.click();
        assert.equal(result.storage.get(storageKey), link.dataset.languageLink);
    }
    assert.deepEqual(result.visits, []); // Ordinary anchors perform navigation.
});

test("automatic mode clears the preference and keeps the current document", () => {
    const result = loadPage({ current: "en", saved: "en", page: "privacy.html", languages: ["fr-CA"] });
    assert.equal(result.automatic.hidden, false);
    result.automatic.click();
    assert.equal(result.storage.has(storageKey), false);
    assert.deepEqual(result.visits, [{
        method: "assign", href: "https://example.com/CoasterToolWeb/fr/privacy.html",
    }]);
});

test("manual and automatic controls remain usable when storage is blocked", () => {
    const result = loadPage({ current: "en", blockedStorage: true, languages: ["zh-HK"] });
    assert.doesNotThrow(() => result.links[0].click());
    assert.doesNotThrow(() => result.automatic.click());
    assert.match(result.visits[0].href, /\/zh-Hant\/index.html$/);
});

test("every page has valid local links, language alternatives and static content", () => {
    for (const locale of [null, ...locales]) {
        for (const page of ["index.html", "privacy.html"]) {
            const filename = path.join(root, locale || "", page);
            const html = fs.readFileSync(filename, "utf8");
            assert.equal((html.match(/<h1>/g) || []).length, 1, filename);
            assert.equal((html.match(/data-language-link=/g) || []).length, locales.length, filename);
            assert.equal((html.match(/rel="alternate"/g) || []).length, locales.length + 1, filename);
            assert.doesNotMatch(html, /<details\b/, filename);
            const htmlTag = html.match(/<html\b[^>]*>/)[0];
            assert.ok(htmlTag.includes(`dir="${locale === "ar" ? "rtl" : "ltr"}"`), filename);
            for (const language of locales) {
                const link = [...html.matchAll(/<a\b[^>]*>/g)]
                    .map(match => match[0]).find(tag => tag.includes(`data-language-link="${language}"`));
                assert.ok(link?.includes(`dir="${language === "ar" ? "rtl" : "ltr"}"`), filename);
                assert.ok(link.includes(`lang="${language}"`), filename);
                assert.ok(link.includes(`href="${locale ? "../" : ""}${language}/${page}"`), filename);
                assert.ok(html.includes(`rel="alternate" hreflang="${language}" href="${locale ? "../" : ""}${language}/${page}"`), filename);
            }
            for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
                if (/^(?:https?|mailto):/.test(href)) continue;
                assert.ok(fs.existsSync(path.resolve(path.dirname(filename), href)), `${filename}: ${href}`);
            }
            if (locale) {
                assert.ok(html.includes(`<html lang="${locale}" data-language="${locale}"`), filename);
                assert.match(html, /<button type="button" data-auto-language hidden>/, filename);
                assert.ok((html.match(/<h2>/g) || []).length >= 7, filename);
                assert.ok(html.includes(`href="../${locale}/${page}" lang="${locale}" hreflang="${locale}" data-language-link="${locale}" aria-current="true"`), filename);
                assert.ok(html.includes(`href="${page}" aria-current="page"`), filename);
            }
        }
    }
});


test("automatic mode can leave an RTL page for Japanese and preserves the URL suffix", () => {
    const result = loadPage({
        current: "ar", saved: "ar", page: "privacy.html", languages: ["ja-JP", "ar-SA"],
        href: "https://example.com/CoasterToolWeb/ar/privacy.html?source=app#contact",
    });
    result.automatic.click();
    assert.equal(result.storage.has(storageKey), false);
    assert.deepEqual(result.visits, [{
        method: "assign", href: "https://example.com/CoasterToolWeb/ja/privacy.html?source=app#contact",
    }]);
});

test("Arabic and Japanese retain every support/privacy section and external reference", () => {
    for (const page of ["index.html", "privacy.html"]) {
        const reference = fs.readFileSync(path.join(root, "en", page), "utf8");
        const externalLinks = html => [...html.matchAll(/href="((?:https?|mailto):[^"]+)"/g)].map(match => match[1]).sort();
        for (const locale of ["ar", "ja"]) {
            const html = fs.readFileSync(path.join(root, locale, page), "utf8");
            for (const tag of ["h1", "h2", "p"]) {
                const count = content => (content.match(new RegExp(`<${tag}>`, "g")) || []).length;
                assert.equal(count(html), count(reference), `${locale}/${page}: ${tag}`);
            }
            assert.deepEqual(externalLinks(html), externalLinks(reference), `${locale}/${page}: external links`);
        }
    }
});
