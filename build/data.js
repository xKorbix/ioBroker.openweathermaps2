"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languages = exports.calculations = exports.configuredDataList = exports.currentDataConfig = exports.CalcDataDefinition = exports.DataDefinition = exports.DataMapping = exports.Datatypes = void 0;
var Datatypes;
(function (Datatypes) {
    Datatypes[Datatypes["date"] = 0] = "date";
    Datatypes[Datatypes["volume_mm"] = 1] = "volume_mm";
    Datatypes[Datatypes["temperature"] = 2] = "temperature";
    Datatypes[Datatypes["pressure_hPa"] = 3] = "pressure_hPa";
    Datatypes[Datatypes["speed_ms"] = 4] = "speed_ms";
    Datatypes[Datatypes["percentage"] = 5] = "percentage";
    Datatypes[Datatypes["percentage_1"] = 6] = "percentage_1";
    Datatypes[Datatypes["text"] = 7] = "text";
    Datatypes[Datatypes["number"] = 8] = "number";
})(Datatypes = exports.Datatypes || (exports.Datatypes = {}));
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
            case Datatypes.percentage_1:
                return { type: 'number', role: 'indicator', unit_metric: '%', unit_imperial: '%' };
            case Datatypes.temperature:
                return { type: 'number', role: 'indicator', unit_metric: '°C', unit_imperial: '°F' };
            case Datatypes.pressure_hPa:
                return { type: 'number', role: 'indicator', unit_metric: 'hPa', unit_imperial: 'hPa' };
            case Datatypes.speed_ms:
                return { type: 'number', role: 'indicator', unit_metric: 'm/s', unit_imperial: 'mi/h' };
            case Datatypes.volume_mm:
                return { type: 'number', role: 'indicator', unit_metric: 'mm', unit_imperial: 'mm' };
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
            case Datatypes.percentage_1:
                return data * 100;
        }
    }
    static async setAdapterData(data, results, adapter) {
        if (data.length !== results.length) {
            adapter.log.error('To less data for expected results list (got: ' + data.length + ' expected: ' + results.length);
            return;
        }
        for (let idx = 0; idx < results.length; idx++) {
            if (data[idx] != null) {
                adapter.log.debug('Result for ' + results[idx].name + ' is ' + data[idx]);
                await adapter.setStateAsync(exports.calculations.root + '.' + results[idx].name, { val: data[idx], ack: true });
            }
            else {
                adapter.log.debug('Result for ' + results[idx].name + ' is empty');
            }
        }
    }
}
exports.DataMapping = DataMapping;
class DataDefinition {
    constructor() {
        this.datapoints = [];
        this.count = 0;
        this.root = '';
    }
}
exports.DataDefinition = DataDefinition;
class CalcDataDefinition {
    constructor() {
        this.calculationList = [];
        this.root = 'calculation';
    }
}
exports.CalcDataDefinition = CalcDataDefinition;
exports.currentDataConfig = {
    datapoints: [
        {
            name: 'dt',
            pretty_name: 'Related datetime',
            datatype: Datatypes.date
        },
        {
            name: 'sunrise',
            pretty_name: 'Sunrise datetime',
            datatype: Datatypes.date
        },
        {
            name: 'sunset',
            pretty_name: 'Sunset datetime',
            datatype: Datatypes.date
        },
        {
            name: 'clouds',
            pretty_name: 'Clouds',
            datatype: Datatypes.percentage
        },
        {
            name: 'feels_like',
            pretty_name: 'Felt temperature',
            datatype: Datatypes.temperature
        },
        {
            name: 'humidity',
            pretty_name: 'Humidity',
            datatype: Datatypes.percentage
        },
        {
            name: 'pressure',
            pretty_name: 'Air Pressure',
            datatype: Datatypes.pressure_hPa
        },
        {
            name: 'temp',
            pretty_name: 'Temperature',
            datatype: Datatypes.temperature
        },
        {
            name: 'wind_speed',
            pretty_name: 'Wind speed',
            datatype: Datatypes.speed_ms
        },
        {
            name: 'uvi',
            pretty_name: 'UV index',
            datatype: Datatypes.number
        },
        {
            name: 'description',
            pretty_name: 'Weather description',
            datatype: Datatypes.text,
            rawsouce: 'weather.0.description'
        },
        {
            name: 'type',
            pretty_name: 'Weather type',
            datatype: Datatypes.text,
            rawsouce: 'weather.0.main'
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
    count: 1,
    root: 'current'
};
exports.configuredDataList = [
    {
        datapoints: [
            {
                name: 'precipitation',
                pretty_name: 'Precipitation volume',
                datatype: Datatypes.volume_mm
            },
            {
                name: 'dt',
                pretty_name: 'Related datetime',
                datatype: Datatypes.date
            }
        ],
        count: 61,
        root: 'minutely'
    },
    {
        datapoints: [
            {
                name: 'dt',
                pretty_name: 'Related datetime',
                datatype: Datatypes.date
            },
            {
                name: 'clouds',
                pretty_name: 'Clouds',
                datatype: Datatypes.percentage
            },
            {
                name: 'feels_like',
                pretty_name: 'Felt temperature',
                datatype: Datatypes.temperature
            },
            {
                name: 'humidity',
                pretty_name: 'Humidity',
                datatype: Datatypes.percentage
            },
            {
                name: 'pressure',
                pretty_name: 'Air Pressure',
                datatype: Datatypes.pressure_hPa
            },
            {
                name: 'temp',
                pretty_name: 'Temperature',
                datatype: Datatypes.temperature
            },
            {
                name: 'wind_speed',
                pretty_name: 'Wind speed',
                datatype: Datatypes.speed_ms
            },
            {
                name: 'uvi',
                pretty_name: 'UV index',
                datatype: Datatypes.number
            },
            {
                name: 'description',
                pretty_name: 'Weather description',
                datatype: Datatypes.text,
                rawsouce: 'weather.0.description'
            },
            {
                name: 'type',
                pretty_name: 'Weather type',
                datatype: Datatypes.text,
                rawsouce: 'weather.0.main'
            },
            {
                name: 'precipitation.pop',
                pretty_name: 'Probability of precipitation',
                datatype: Datatypes.percentage_1,
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
            {
                name: 'dt',
                pretty_name: 'Related datetime',
                datatype: Datatypes.date
            },
            {
                name: 'sunrise',
                pretty_name: 'Sunrise datetime',
                datatype: Datatypes.date
            },
            {
                name: 'sunset',
                pretty_name: 'Sunset datetime',
                datatype: Datatypes.date
            },
            {
                name: 'precipitation.pop',
                pretty_name: 'Probability of precipitation',
                datatype: Datatypes.percentage_1,
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
            {
                name: 'clouds',
                pretty_name: 'Clouds',
                datatype: Datatypes.percentage
            },
            {
                name: 'wind_speed',
                pretty_name: 'Wind speed',
                datatype: Datatypes.speed_ms
            },
            {
                name: 'pressure',
                pretty_name: 'Air Pressure',
                datatype: Datatypes.pressure_hPa
            },
            {
                name: 'humidity',
                pretty_name: 'Humidity',
                datatype: Datatypes.percentage
            },
            {
                name: 'description',
                pretty_name: 'Weather description',
                datatype: Datatypes.text,
                rawsouce: 'weather.0.description'
            },
            {
                name: 'type',
                pretty_name: 'Weather type',
                datatype: Datatypes.text,
                rawsouce: 'weather.0.main'
            },
            {
                name: 'uvi',
                pretty_name: 'UV index',
                datatype: Datatypes.number
            },
            {
                name: 'temp',
                pretty_name: 'Daily temperature',
                datatype: Datatypes.temperature,
                rawsouce: 'temp.day'
            },
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
                pretty_name: 'Felt temperature',
                datatype: Datatypes.temperature,
                rawsouce: 'feels_like.day'
            },
        ],
        count: 8,
        root: 'daily'
    },
];
exports.calculations = {
    calculationList: [
        {
            results: [
                {
                    name: 'nextRainMinutes.date_start',
                    pretty_name: 'Datetime rain starts',
                    datatype: Datatypes.date
                },
                {
                    name: 'nextRainMinutes.date_end',
                    pretty_name: 'Datetime rain ends',
                    datatype: Datatypes.date
                },
                {
                    name: 'nextRainMinutes.volume',
                    pretty_name: 'Rain volume',
                    datatype: Datatypes.volume_mm
                }
            ],
            calculate: async function (adapter) {
                let range_from = 1, range_to = 0;
                await calculation_nextRainMinutes(this, adapter, range_from, range_to);
            }
        },
        {
            results: [
                {
                    name: 'nextRainHours.date_start',
                    pretty_name: 'Datetime rain starts',
                    datatype: Datatypes.date
                },
                {
                    name: 'nextRainHours.date_end',
                    pretty_name: 'Datetime rain ends',
                    datatype: Datatypes.date
                },
                {
                    name: 'nextRainHours.precipitation',
                    pretty_name: 'Rain precipitation',
                    datatype: Datatypes.percentage
                },
                {
                    name: 'nextRainHours.volume',
                    pretty_name: 'Rain volume',
                    datatype: Datatypes.volume_mm
                }
            ],
            calculate: async function (adapter) {
                let range_from = 25, range_to = 2;
                await calculation_nextRainHours_Days(this, adapter, range_from, range_to, 'hourly');
            }
        },
        {
            results: [
                {
                    name: 'nextStrongWind.date_start',
                    pretty_name: 'Datetime wind starts',
                    datatype: Datatypes.date
                },
                {
                    name: 'nextStrongWind.date_end',
                    pretty_name: 'Datetime wind ends',
                    datatype: Datatypes.date
                },
                {
                    name: 'nextStrongWind.speed_avg',
                    pretty_name: 'Wind speed average',
                    datatype: Datatypes.speed_ms
                },
                {
                    name: 'nextStrongWind.speed_max',
                    pretty_name: 'Wind speed max',
                    datatype: Datatypes.speed_ms
                }
            ],
            calculate: async function (adapter) {
                let range_from = 10, range_to = 5;
                await calculation_nextStrongWind(this, adapter, range_from, range_to);
            }
        },
        {
            results: [
                {
                    name: 'nextRainDays.date_start',
                    pretty_name: 'Datetime rain starts',
                    datatype: Datatypes.date
                },
                {
                    name: 'nextRainDays.date_end',
                    pretty_name: 'Datetime rain ends',
                    datatype: Datatypes.date
                },
                {
                    name: 'nextRainDays.precipitation',
                    pretty_name: 'Rain precipitation',
                    datatype: Datatypes.percentage
                },
                {
                    name: 'nextRainDays.volume',
                    pretty_name: 'Rain volume',
                    datatype: Datatypes.volume_mm
                }
            ],
            calculate: async function (adapter) {
                let range_from = 25, range_to = 2;
                await calculation_nextRainHours_Days(this, adapter, range_from, range_to, 'daily');
            }
        },
    ],
    root: 'calculation'
};
const calculation_nextRainMinutes = async function (self, adapter, range_from, range_to) {
    var _a, _b;
    let states = await adapter.getStatesAsync('minutely.*.precipitation');
    if (states == null) {
        adapter.log.error('getStatesAsync(\'minutely.*.precipitation\') failed');
        return;
    }
    let startIdx = -1;
    let endIdx = Object.keys(states).length - 1;
    let volume_sum = 0;
    for (let idx = 0; idx < Object.keys(states).length; idx++) {
        let state = states[adapter.namespace + '.minutely.' + idx + '.precipitation'];
        if ((state === null || state === void 0 ? void 0 : state.val) == null)
            continue;
        if (state.val > range_from) {
            if (startIdx < 0)
                startIdx = idx;
            volume_sum += state.val;
        }
        else if (startIdx >= 0 && state.val <= range_to) {
            endIdx = idx;
            break;
        }
    }
    if (startIdx < 0)
        return;
    volume_sum = Math.round(volume_sum * 100) / 100;
    let startDate = await adapter.getStateAsync('minutely.' + startIdx + '.dt');
    let endDate = await adapter.getStateAsync('minutely.' + endIdx + '.dt');
    await DataMapping.setAdapterData([(_a = startDate === null || startDate === void 0 ? void 0 : startDate.val) === null || _a === void 0 ? void 0 : _a.toString(), (_b = endDate === null || endDate === void 0 ? void 0 : endDate.val) === null || _b === void 0 ? void 0 : _b.toString(), volume_sum], self.results, adapter);
};
const calculation_nextStrongWind = async function (self, adapter, range_from, range_to) {
    var _a, _b;
    let states = await adapter.getStatesAsync('hourly.*.wind_speed');
    if (states == null) {
        adapter.log.error('getStatesAsync(\'hourly.*.wind_speed\') failed');
        return;
    }
    let startIdx = -1;
    let endIdx = Object.keys(states).length - 1;
    let speed_sum = 0, speed_max = 0;
    for (let idx = 0; idx < Object.keys(states).length; idx++) {
        let state = states[adapter.namespace + '.hourly.' + idx + '.wind_speed'];
        if ((state === null || state === void 0 ? void 0 : state.val) == null)
            continue;
        if (state.val > range_from) {
            if (startIdx < 0)
                startIdx = idx;
            speed_sum += state.val;
            if (state.val > speed_max)
                speed_max = state.val;
        }
        else if (startIdx >= 0 && state.val <= range_to) {
            endIdx = idx;
            break;
        }
    }
    if (startIdx < 0)
        return;
    speed_max = Math.round(speed_max * 100) / 100;
    let speed_avg = Math.round((speed_sum / (endIdx - startIdx)) * 100) / 100;
    let startDate = await adapter.getStateAsync('hourly.' + startIdx + '.dt');
    let endDate = await adapter.getStateAsync('hourly.' + endIdx + '.dt');
    await DataMapping.setAdapterData([(_a = startDate === null || startDate === void 0 ? void 0 : startDate.val) === null || _a === void 0 ? void 0 : _a.toString(), (_b = endDate === null || endDate === void 0 ? void 0 : endDate.val) === null || _b === void 0 ? void 0 : _b.toString(), speed_avg, speed_max], self.results, adapter);
};
const calculation_nextRainHours_Days = async function (self, adapter, range_from, range_to, hour_day) {
    var _a, _b;
    let states2 = await adapter.getStatesAsync(hour_day + '.*.precipitation.*');
    if (states2 == null) {
        adapter.log.error('getStatesAsync(\'' + hour_day + '.*.precipitation.*\') failed');
        return;
    }
    let startIdx = -1;
    let endIdx = Object.keys(states2).length - 1;
    let volume_sum = 0, volume_pop = 0;
    for (let idx = 0; idx < Object.keys(states2).length; idx++) {
        let statePop = states2[adapter.namespace + '.' + hour_day + '.' + idx + '.precipitation.pop'];
        let stateRain = states2[adapter.namespace + '.' + hour_day + '.' + idx + '.precipitation.rain'];
        let stateSnow = states2[adapter.namespace + '.' + hour_day + '.' + idx + '.precipitation.snow'];
        if (((statePop === null || statePop === void 0 ? void 0 : statePop.val) == null) || ((stateRain === null || stateRain === void 0 ? void 0 : stateRain.val) == null && (stateSnow === null || stateSnow === void 0 ? void 0 : stateSnow.val) == null))
            continue;
        if (statePop.val > range_from) {
            if (startIdx < 0)
                startIdx = idx;
            if (stateRain != null && stateRain.val != null)
                volume_sum += stateRain.val;
            if (stateSnow != null && stateSnow.val != null)
                volume_sum += stateSnow.val;
            volume_pop += statePop.val;
        }
        else if (startIdx >= 0 && statePop.val <= range_to) {
            endIdx = idx;
            break;
        }
    }
    if (startIdx < 0)
        return;
    let popAvg = Math.round(volume_pop / (endIdx - startIdx));
    volume_sum = Math.round(volume_sum * 100) / 100;
    let startDate = await adapter.getStateAsync(hour_day + '.' + startIdx + '.dt');
    let endDate = await adapter.getStateAsync(hour_day + '.' + endIdx + '.dt');
    await DataMapping.setAdapterData([(_a = startDate === null || startDate === void 0 ? void 0 : startDate.val) === null || _a === void 0 ? void 0 : _a.toString(), (_b = endDate === null || endDate === void 0 ? void 0 : endDate.val) === null || _b === void 0 ? void 0 : _b.toString(), popAvg, volume_sum], self.results, adapter);
};
exports.languages = ['af', 'al', 'ar', 'az', 'bg', 'ca', 'cz', 'da', 'de', 'el', 'en', 'eu', 'fa', 'fi', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kr', 'la', 'lt', 'mk', 'no', 'nl', 'pl', 'pt', 'pt', 'ro', 'ru', 'sv', 'sk', 'sl', 'sp', 'sr', 'th', 'tr', 'ua', 'uk', 'vi', 'zh_cn', 'zh_tw', 'zu'];
//# sourceMappingURL=data.js.map