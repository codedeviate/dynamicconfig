export default class parserIni {
    constructor() {
        this.type = 'ini';
    }

    parse(data, sectionSplit = ':') {
        const lines = data.split(/[\r\n]+/);
        const config = {};
        let currentSection = null;

        lines.forEach((line) => {
            const lineTrimmed = line.trim();
            if (lineTrimmed.length === 0) {
                return;
            }
            if (lineTrimmed[0] === '#' || lineTrimmed.length === 0) {
                return;
            }
            if (lineTrimmed[0] === '[' && lineTrimmed[lineTrimmed.length - 1] === ']') {
                currentSection = lineTrimmed.substring(1, lineTrimmed.length - 1);
                return;
            }
            const [key, value] = lineTrimmed.split('=');
            this.addValueToAddToConfig(config, currentSection, key, value, sectionSplit);
        });
        return config;
    }

    addValueToAddToConfig(config, section, key, value, sectionSplit) {
        if (section === null) {
            config[key] = value;
        } else {
            if (section.indexOf(sectionSplit) !== -1) {
                const sectionParts = section.split(sectionSplit);
                const subSection = sectionParts.shift();
                const sectionRemainder = sectionParts.join(sectionSplit);
                if (config[subSection] === undefined) {
                    config[subSection] = {};
                }
                this.addValueToAddToConfig(config[subSection], sectionRemainder, key, value, sectionSplit);
            } else {
                if (config[section] === undefined) {
                    config[section] = {};
                }
                config[section][key] = value;
            }
        }
    }
};