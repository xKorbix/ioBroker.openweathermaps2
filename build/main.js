"use strict";
/*
 * Created with @iobroker/create-adapter v1.34.1
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("@iobroker/adapter-core"));
const axios_1 = __importDefault(require("axios"));
const data_1 = require("./data");
class Openweathermaps2 extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: 'openweathermaps2',
        });
        this.getWeatherData = async (apikey, lang, unit, lat, lon) => axios_1.default.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apikey + '&units=' + unit + '&lang=' + lang)
            .then((response) => {
            return response;
        })
            .catch((error) => {
            this.log.error(error.response.data);
            return error;
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        if (!await this.initConfig()) {
            setTimeout(() => { var _a; return (_a = this.stop) === null || _a === void 0 ? void 0 : _a.call(this); }, 1000);
            return;
        }
        await this.initListData();
        await this.initCurrentData();
        await this.initCalculateResults();
        let unit = (!this.config.useImperial) ? 'metric' : 'imperial';
        let response = await this.getWeatherData(this.config.apikey, this.config.lang, unit, this.config.lat, this.config.lon);
        if (response.data == null) {
            this.log.error('Response is invalid');
            return;
        }
        await this.fillData(response.data);
        await this.fillCurrentData(response.data);
        for (let item of data_1.calculations.calculationList) {
            let result = await item.calculate(this);
            if (result)
                this.log.info(result.date);
        }
        this.log.info('Data processed.');
        setTimeout(() => { var _a; return (_a = this.stop) === null || _a === void 0 ? void 0 : _a.call(this); }, 1000);
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            callback();
        }
        catch (e) {
            callback();
        }
    }
    async initializeObject(id, name, datatype) {
        let type_role = data_1.DataMapping.getTypeRoleUnit(datatype);
        if (type_role == null) {
            this.log.error(datatype + 'unknown!');
            return;
        }
        let unit = (this.config.useImperial) ? type_role.unit_imperial : type_role.unit_metric;
        name = (unit != null) ? name + ' in ' + unit : name;
        //TODO: setObjectNotExistsAsync and extend only for changed units.
        await this.extendObjectAsync(id, {
            type: 'state',
            common: {
                name: name,
                type: type_role.type,
                role: type_role.role,
                unit: unit,
                read: true,
                write: false,
            },
            native: {
                _id: id
            },
        });
    }
    async initListData() {
        for (let dataConfig of data_1.configuredDataList) {
            for (let i = 0; i < dataConfig.count; i++) {
                for (let item of dataConfig.datapoints) {
                    await this.initializeObject(dataConfig.root + '.' + i + '.' + item.name, item.pretty_name, item.datatype);
                }
            }
        }
    }
    async initCurrentData() {
        for (let item of data_1.currentDataConfig.datapoints) {
            await this.initializeObject(data_1.currentDataConfig.root + '.' + item.name, item.pretty_name, item.datatype);
        }
    }
    async fillData(data) {
        for (let dataConfig of data_1.configuredDataList) {
            for (let i = 0; i < dataConfig.count; i++) {
                for (let item of dataConfig.datapoints) {
                    let rawvalue = (dataConfig.root + '.' + i + '.' + ((item.rawsouce != null) ? item.rawsouce : item.name))
                        .split('.').reduce(function (o, k) {
                        return o && o[k];
                    }, data);
                    if (rawvalue == null) {
                        rawvalue = 0;
                    }
                    await this.setStateAsync(dataConfig.root + '.' + i + '.' + item.name, { val: data_1.DataMapping.parseData(item.datatype, rawvalue), ack: true });
                }
            }
        }
    }
    async fillCurrentData(data) {
        for (let item of data_1.currentDataConfig.datapoints) {
            let rawvalue = (data_1.currentDataConfig.root + '.' + ((item.rawsouce != null) ? item.rawsouce : item.name))
                .split('.').reduce(function (o, k) {
                return o && o[k];
            }, data);
            if (rawvalue == null) {
                rawvalue = 0;
            }
            await this.setStateAsync(data_1.currentDataConfig.root + '.' + item.name, { val: data_1.DataMapping.parseData(item.datatype, rawvalue), ack: true });
        }
    }
    async initConfig() {
        if (this.config.lat == null || this.config.lon == null
            || !isFinite(this.config.lat) || Math.abs(this.config.lat) > 90
            || !isFinite(this.config.lon) || Math.abs(this.config.lon) > 180) {
            this.log.error("Lat/Lon invalid.");
            return false;
        }
        this.log.debug('config lat, long: ' + this.config.lat + ', ' + this.config.lon);
        await this.getForeignObject('system.config', (err, systemConfig) => {
            this.config.lang = (systemConfig === null || systemConfig === void 0 ? void 0 : systemConfig.common.language) || 'de';
            if (this.config.lang.length == 0 || data_1.languages.indexOf(this.config.lang) < 0) {
                this.log.error("Language invalid.");
                return false;
            }
            this.log.debug('config lang: ' + this.config.lang);
        });
        if (this.config.apikey.length == 0) {
            this.log.error("Apikey invalid.");
            return false;
        }
        this.log.debug('config apikey: ' + this.config.apikey);
        this.log.debug('config useImperial: ' + this.config.useImperial);
        return true;
    }
    async initCalculateResults() {
        for (let item of data_1.calculations.calculationList) {
            for (let resultItem of item.results) {
                await this.initializeObject(data_1.calculations.root + '.' + resultItem.name, resultItem.pretty_name, resultItem.datatype);
            }
        }
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options) => new Openweathermaps2(options);
}
else {
    // otherwise start the instance directly
    (() => new Openweathermaps2())();
}
//# sourceMappingURL=main.js.map