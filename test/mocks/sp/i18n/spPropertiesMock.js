var mocks = {
    locales: {
        enUs: 'en-us',
        nlNl: 'nl-nl',
        de: 'de'
    },
    properties: {
        enUs: {
            KEY_0001: 'one',
            KEY_0002: 'two',
            KEY_0003: 'three'
        },
        nlNl: {
            KEY_0001: '&eacute;&eacute;n',
            KEY_0002: 'twee',
            KEY_0003: 'drie'
        },
        de: {
            KEY_0001: 'eins',
            KEY_0002: 'zwei',
            KEY_0003: 'drei'
        }
    },
    overrides: {
        enUs: 'override',
        nlNl: 'overschrijven',
        de: '&uuml;berschreiben'
    }
};

module.exports = {
    mocks: mocks
};