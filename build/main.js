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
exports.DataDefinition = void 0;
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = __importStar(require("@iobroker/adapter-core"));
const axios_1 = __importDefault(require("axios"));
// Load your modules here, e.g.:
// import * as fs from "fs";
var Datatypes;
(function (Datatypes) {
    Datatypes[Datatypes["date"] = 0] = "date";
    Datatypes[Datatypes["volume_mm"] = 1] = "volume_mm";
    Datatypes[Datatypes["temperature"] = 2] = "temperature";
    Datatypes[Datatypes["pressure_hPa"] = 3] = "pressure_hPa";
    Datatypes[Datatypes["speed_ms"] = 4] = "speed_ms";
    Datatypes[Datatypes["percentage"] = 5] = "percentage";
    Datatypes[Datatypes["text"] = 6] = "text";
    Datatypes[Datatypes["number"] = 7] = "number";
})(Datatypes || (Datatypes = {}));
class DataMapping {
    static getTypeRoleUnit(datatype) {
        switch (datatype) {
            case Datatypes.date:
                return { type: 'string', role: 'Date' };
            case Datatypes.text:
                return { type: 'string', role: 'text' };
            case Datatypes.number:
                return { type: 'number', role: 'indicator' };
            case Datatypes.percentage:
                return { type: 'number', role: 'indicator', unit_metric: '%', unit_imperial: '%' };
            case Datatypes.temperature:
                return { type: 'number', role: 'indicator', unit_metric: '°C', unit_imperial: '°F', };
            case Datatypes.pressure_hPa:
                return { type: 'number', role: 'indicator', unit_metric: 'hPa', unit_imperial: 'hPa', };
            case Datatypes.speed_ms:
                return { type: 'number', role: 'indicator', unit_metric: 'm/s', unit_imperial: 'mi/h', };
            case Datatypes.volume_mm:
                return { type: 'number', role: 'indicator', unit_metric: 'mm', unit_imperial: 'mm', };
        }
        return null;
    }
    static parseData(datatype, data) {
        switch (datatype) {
            case Datatypes.text:
            case Datatypes.number:
            case Datatypes.percentage:
            case Datatypes.temperature:
            case Datatypes.pressure_hPa:
            case Datatypes.speed_ms:
            case Datatypes.volume_mm:
                return data;
            case Datatypes.date:
                return new Date(data * 1000).toString();
        }
    }
}
class DataDefinition {
    constructor() {
        this.datapoints = [];
        this.count = 0;
        this.root = '';
    }
}
exports.DataDefinition = DataDefinition;
class Openweathermaps2 extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: 'openweathermaps2',
        });
        this.languages = ['af', 'al', 'ar', 'az', 'bg', 'ca', 'cz', 'da', 'de', 'el', 'en', 'eu', 'fa', 'fi', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kr', 'la', 'lt', 'mk', 'no', 'nl', 'pl', 'pt', 'pt', 'ro', 'ru', 'sv', 'sk', 'sl', 'sp', 'sr', 'th', 'tr', 'ua', 'uk', 'vi', 'zh_cn', 'zh_tw', 'zu'];
        this.currentDataConfig = {
            datapoints: [
                { name: 'dt', pretty_name: 'Related datetime', datatype: Datatypes.date },
                { name: 'sunrise', pretty_name: 'Sunrise datetime', datatype: Datatypes.date },
                { name: 'sunset', pretty_name: 'Sunset datetime', datatype: Datatypes.date },
                { name: 'clouds', pretty_name: 'Clouds', datatype: Datatypes.percentage },
                { name: 'feels_like', pretty_name: 'Feeled temperature', datatype: Datatypes.temperature },
                { name: 'humidity', pretty_name: 'Humidity', datatype: Datatypes.percentage },
                { name: 'pressure', pretty_name: 'Air Pressure', datatype: Datatypes.pressure_hPa },
                { name: 'temp', pretty_name: 'Temperature', datatype: Datatypes.temperature },
                { name: 'wind_speed', pretty_name: 'Wind speed', datatype: Datatypes.speed_ms },
                { name: 'uvi', pretty_name: 'UV index', datatype: Datatypes.number },
                {
                    name: 'description',
                    pretty_name: 'Weather description',
                    datatype: Datatypes.text,
                    rawsouce: 'weather.0.description'
                },
                { name: 'type', pretty_name: 'Weather type', datatype: Datatypes.text, rawsouce: 'weather.0.main' },
                {
                    name: 'precipitation.rain',
                    pretty_name: 'Rain volume',
                    datatype: Datatypes.volume_mm,
                    rawsouce: 'rain.1h'
                },
                {
                    name: 'precipitation.snow',
                    pretty_name: 'Snow volume',
                    datatype: Datatypes.volume_mm,
                    rawsouce: 'snow.1h'
                },
            ],
            count: 1,
            root: 'current'
        };
        this.configuredDataList = [
            {
                datapoints: [
                    { name: 'precipitation', pretty_name: 'Precipitation volume', datatype: Datatypes.volume_mm },
                    { name: 'dt', pretty_name: 'Related datetime', datatype: Datatypes.date }
                ],
                count: 61,
                root: 'minutely'
            },
            {
                datapoints: [
                    { name: 'dt', pretty_name: 'Related datetime', datatype: Datatypes.date },
                    { name: 'clouds', pretty_name: 'Clouds', datatype: Datatypes.percentage },
                    { name: 'feels_like', pretty_name: 'Feeled temperature', datatype: Datatypes.temperature },
                    { name: 'humidity', pretty_name: 'Humidity', datatype: Datatypes.percentage },
                    { name: 'pressure', pretty_name: 'Air Pressure', datatype: Datatypes.pressure_hPa },
                    { name: 'temp', pretty_name: 'Temperature', datatype: Datatypes.temperature },
                    { name: 'wind_speed', pretty_name: 'Wind speed', datatype: Datatypes.speed_ms },
                    { name: 'uvi', pretty_name: 'UV index', datatype: Datatypes.number },
                    {
                        name: 'description',
                        pretty_name: 'Weather description',
                        datatype: Datatypes.text,
                        rawsouce: 'weather.0.description'
                    },
                    { name: 'type', pretty_name: 'Weather type', datatype: Datatypes.text, rawsouce: 'weather.0.main' },
                    {
                        name: 'precipitation.pop',
                        pretty_name: 'Probability of precipitation',
                        datatype: Datatypes.percentage,
                        rawsouce: 'pop'
                    },
                    {
                        name: 'precipitation.rain',
                        pretty_name: 'Rain volume',
                        datatype: Datatypes.volume_mm,
                        rawsouce: 'rain.1h'
                    },
                    {
                        name: 'precipitation.snow',
                        pretty_name: 'Snow volume',
                        datatype: Datatypes.volume_mm,
                        rawsouce: 'snow.1h'
                    },
                ],
                count: 48,
                root: 'hourly'
            },
            {
                datapoints: [
                    { name: 'dt', pretty_name: 'Related datetime', datatype: Datatypes.date },
                    { name: 'sunrise', pretty_name: 'Sunrise datetime', datatype: Datatypes.date },
                    { name: 'sunset', pretty_name: 'Sunset datetime', datatype: Datatypes.date },
                    {
                        name: 'precipitation.pop',
                        pretty_name: 'Probability of precipitation',
                        datatype: Datatypes.percentage,
                        rawsouce: 'pop'
                    },
                    {
                        name: 'precipitation.rain',
                        pretty_name: 'Rain volume',
                        datatype: Datatypes.volume_mm,
                        rawsouce: 'rain'
                    },
                    {
                        name: 'precipitation.snow',
                        pretty_name: 'Snow volume',
                        datatype: Datatypes.volume_mm,
                        rawsouce: 'snow'
                    },
                    { name: 'clouds', pretty_name: 'Clouds', datatype: Datatypes.percentage },
                    { name: 'wind_speed', pretty_name: 'Wind speed', datatype: Datatypes.speed_ms },
                    { name: 'pressure', pretty_name: 'Air Pressure', datatype: Datatypes.pressure_hPa },
                    { name: 'humidity', pretty_name: 'Humidity', datatype: Datatypes.percentage },
                    {
                        name: 'description',
                        pretty_name: 'Weather description',
                        datatype: Datatypes.text,
                        rawsouce: 'weather.0.description'
                    },
                    { name: 'type', pretty_name: 'Weather type', datatype: Datatypes.text, rawsouce: 'weather.0.main' },
                    { name: 'uvi', pretty_name: 'UV index', datatype: Datatypes.number },
                    { name: 'temp', pretty_name: 'Daily temperature', datatype: Datatypes.temperature, rawsouce: 'temp.day' },
                    {
                        name: 'temp_min',
                        pretty_name: 'Max temperature',
                        datatype: Datatypes.temperature,
                        rawsouce: 'temp.min'
                    },
                    {
                        name: 'temp_max',
                        pretty_name: 'Min temperature',
                        datatype: Datatypes.temperature,
                        rawsouce: 'temp.max'
                    },
                    {
                        name: 'feels_like',
                        pretty_name: 'Feeled temperature',
                        datatype: Datatypes.temperature,
                        rawsouce: 'feels_like.day'
                    },
                ],
                count: 8,
                root: 'daily'
            },
        ];
        // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
        // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
        // /**
        //  * Is called if a subscribed object changes
        //  */
        // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
        //     if (obj) {
        //         // The object was changed
        //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        //     } else {
        //         // The object was deleted
        //         this.log.info(`object ${id} deleted`);
        //     }
        // }
        /**
         * Is called if a subscribed state changes
         private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
            if (state) {
                // The state was changed
                this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            } else {
                // The state was deleted
                this.log.info(`state ${id} deleted`);
            }
        }*/
        // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
        // /**
        //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
        //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
        //  */
        // private onMessage(obj: ioBroker.Message): void {
        //     if (typeof obj === 'object' && obj.message) {
        //         if (obj.command === 'send') {
        //             // e.g. send email or pushover or whatever
        //             this.log.info('send command');
        //             // Send response in callback if required
        //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        //         }
        //     }
        // }
        this.getWeatherData = async (apikey, lang, unit, lat, lon) => axios_1.default.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apikey + '&units=' + unit + '&lang=' + lang)
            .then((response) => {
            return response;
        })
            .catch((error) => {
            this.log.error(error.response.data);
            return error;
        });
        this.on('ready', this.onReady.bind(this));
        //this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
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
        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        //this.subscribeStates('testVariable');
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates('lights.*');
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates('*');
        await this.initListData();
        await this.initCurrentData();
        let unit = (!this.config.useImperial) ? 'metric' : 'imperial';
        let response = await this.getWeatherData(this.config.apikey, this.config.lang, unit, this.config.lat, this.config.lon);
        if (response.data == null) {
            this.log.error('Response is invalid');
            return;
        }
        await this.fillData(response.data);
        await this.fillCurrentData(response.data);
        this.log.info('Data processed.');
        setTimeout(() => { var _a; return (_a = this.stop) === null || _a === void 0 ? void 0 : _a.call(this); }, 1000);
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            callback();
        }
        catch (e) {
            callback();
        }
    }
    async initializeObject(id, name, datatype) {
        let type_role = DataMapping.getTypeRoleUnit(datatype);
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
        for (let dataConfig of this.configuredDataList) {
            for (let i = 0; i < dataConfig.count; i++) {
                for (let item of dataConfig.datapoints) {
                    await this.initializeObject(dataConfig.root + '.' + i + '.' + item.name, item.pretty_name, item.datatype);
                }
            }
        }
    }
    async initCurrentData() {
        for (let item of this.currentDataConfig.datapoints) {
            await this.initializeObject(this.currentDataConfig.root + '.' + item.name, item.pretty_name, item.datatype);
        }
    }
    async fillData(data) {
        for (let dataConfig of this.configuredDataList) {
            for (let i = 0; i < dataConfig.count; i++) {
                for (let item of dataConfig.datapoints) {
                    let rawvalue = (dataConfig.root + '.' + i + '.' + ((item.rawsouce != null) ? item.rawsouce : item.name))
                        .split('.').reduce(function (o, k) {
                        return o && o[k];
                    }, data);
                    if (rawvalue == null) {
                        rawvalue = 0;
                    }
                    await this.setStateAsync(dataConfig.root + '.' + i + '.' + item.name, { val: DataMapping.parseData(item.datatype, rawvalue), ack: true });
                }
            }
        }
    }
    async fillCurrentData(data) {
        for (let item of this.currentDataConfig.datapoints) {
            let rawvalue = (this.currentDataConfig.root + '.' + ((item.rawsouce != null) ? item.rawsouce : item.name))
                .split('.').reduce(function (o, k) {
                return o && o[k];
            }, data);
            if (rawvalue == null) {
                rawvalue = 0;
            }
            await this.setStateAsync(this.currentDataConfig.root + '.' + item.name, { val: DataMapping.parseData(item.datatype, rawvalue), ack: true });
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
            if (this.config.lang.length == 0 || this.languages.indexOf(this.config.lang) < 0) {
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