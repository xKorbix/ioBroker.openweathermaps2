import {utils} from "@iobroker/testing";

export enum Datatypes {
    date,
    volume_mm,
    temperature,
    pressure_hPa,
    speed_ms,
    percentage,
    percentage_1,
    text,
    number
}

export class DataMapping {
    static getTypeRoleUnit(datatype: Datatypes): any | null {
        switch (datatype) {
            case Datatypes.date:
                return {type: 'string', role: 'Date'};
            case Datatypes.text:
                return {type: 'string', role: 'text'};
            case Datatypes.number:
                return {type: 'number', role: 'indicator'};
            case Datatypes.percentage:
            case Datatypes.percentage_1:
                return {type: 'number', role: 'indicator', unit_metric: '%', unit_imperial: '%'};
            case Datatypes.temperature:
                return {type: 'number', role: 'indicator', unit_metric: '°C', unit_imperial: '°F'};
            case Datatypes.pressure_hPa:
                return {type: 'number', role: 'indicator', unit_metric: 'hPa', unit_imperial: 'hPa'};
            case Datatypes.speed_ms:
                return {type: 'number', role: 'indicator', unit_metric: 'm/s', unit_imperial: 'mi/h'};
            case Datatypes.volume_mm:
                return {type: 'number', role: 'indicator', unit_metric: 'mm', unit_imperial: 'mm'};
        }
        return null;
    }

    static parseData(datatype: Datatypes, data: any): any {
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
                return new Date(data * 1000).toString()
            case Datatypes.percentage_1:
                return data * 100;
        }
    }

    static fillIobData() {

    }
}

export interface IOBData {
    name: string;
    pretty_name: string;
    datatype: Datatypes;
}

export interface DataPoint extends IOBData {
    rawsouce?: string;
}

export interface CalcDataPoint {
    results: IOBData[];
    calculate: Function;
}

export class DataDefinition {
    datapoints: DataPoint[] = [];
    count: number = 0;
    root: string = '';
}

export class CalcDataDefinition {
    calculationList: CalcDataPoint[] = [];
    root: string = 'calculation';
}


export const currentDataConfig: DataDefinition = {
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
            pretty_name: 'Feeled temperature',
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
}

export const configuredDataList: DataDefinition[] = [
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
                pretty_name: 'Feeled temperature',
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
                pretty_name: 'Feeled temperature',
                datatype: Datatypes.temperature,
                rawsouce: 'feels_like.day'
            },
        ],
        count: 8,
        root: 'daily'
    },
]

export const calculations: CalcDataDefinition = {
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
            calculate: async function (adapter: ioBroker.Adapter) {
                let states = await adapter.getStatesAsync('minutely.*.precipitation');

                if(states == null) {
                    adapter.log.error('getStatesAsync(\'minutely.*.precipitation\') failed');
                    return;
                }

                let startIdx = -1;
                let endIdx = Object.keys(states).length;
                let volume_sum = 0;
                for(let idx = 0; idx < Object.keys(states).length; idx++)
                {
                    let state = states[adapter.namespace + '.minutely.' + idx + '.precipitation']
                    if(state == null || state.val == null ) continue;
                    if(state.val > 1)
                    {
                        if(startIdx < 0) startIdx = idx;
                        volume_sum += (state.val as number);
                    }else if(startIdx >= 0 && state.val === 0)
                    {
                        endIdx = idx;
                        break;
                    }
                }

                if(startIdx < 0) return;

                volume_sum = Math.round(volume_sum * 100) / 100
                let startDate = await adapter.getStateAsync('minutely.' + startIdx + '.dt');
                let endDate = await adapter.getStateAsync('minutely.' + endIdx + '.dt');
                if(startDate == null || startDate.val == null || endDate == null || endDate.val == null) return;

                await adapter.setStateAsync(calculations.root + '.' + this.results[0].name, {val: startDate.val.toString(), ack: true});
                await adapter.setStateAsync(calculations.root + '.' + this.results[1].name, {val: endDate.val.toString(), ack: true});
                await adapter.setStateAsync(calculations.root + '.' + this.results[3].name, {val: volume_sum, ack: true});

                adapter.log.info('Rain minutes: ' + startIdx + ' - ' + endIdx + ' | ' + volume_sum);
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
            calculate: async function (adapter: ioBroker.Adapter) {
                let states2 = await adapter.getStatesAsync('hourly.*.precipitation.*');

                if(states2 == null) {
                    adapter.log.error('getStatesAsync(\'hourly.*.precipitation.pop\') failed');
                    return;
                }

                let startIdx = -1;
                let endIdx = Object.keys(states2).length;
                let volume_sum = 0;
                let volume_pop = 0;

                for(let idx = 0; idx < Object.keys(states2).length; idx++)
                {
                    let statePop = states2[adapter.namespace + '.hourly.' + idx + '.precipitation.pop']
                    let stateRain = states2[adapter.namespace + '.hourly.' + idx + '.precipitation.rain']
                    let stateSnow = states2[adapter.namespace + '.hourly.' + idx + '.precipitation.snow']
                    if(statePop == null || statePop.val == null ) continue;
                    if((stateRain == null || stateRain.val == null) && (stateSnow == null || stateSnow.val == null)) continue;
                    if(statePop.val > 25)
                    {
                        if(startIdx < 0) startIdx = idx;

                        if (stateRain != null && stateRain.val != null) volume_sum += (stateRain.val as number);
                        if (stateSnow != null && stateSnow.val != null) volume_sum += (stateSnow.val as number);
                        volume_pop += (statePop.val as number);
                    }else if(startIdx >= 0 && statePop.val <= 2)
                    {
                        endIdx = idx;
                        break;
                    }
                }

                if(startIdx < 0) return;
                let popAvg = Math.round(volume_pop / (endIdx - startIdx));
                volume_sum = Math.round(volume_sum * 100) / 100
                let startDate = await adapter.getStateAsync('hourly.' + startIdx + '.dt');
                let endDate = await adapter.getStateAsync('hourly.' + endIdx + '.dt');
                if(startDate == null || startDate.val == null || endDate == null || endDate.val == null) return;

                await adapter.setStateAsync(calculations.root + '.' + this.results[0].name, {val: startDate.val.toString(), ack: true})
                await adapter.setStateAsync(calculations.root + '.' + this.results[1].name, {val: endDate.val.toString(), ack: true})
                await adapter.setStateAsync(calculations.root + '.' + this.results[2].name, {val: popAvg, ack: true})
                await adapter.setStateAsync(calculations.root + '.' + this.results[3].name, {val: volume_sum, ack: true})


                adapter.log.info('Rain hours: ' + startIdx + ' - ' + endIdx + ' | ' + volume_sum + ', ' + popAvg);
            }
        },
    ],
    root: 'calculation'
}
/*,
                    name: 'nextRainStarts60Min',
            pretty_name: 'Date when rain starts',
            datatype: Datatypes.date,
            calculationInput: {thresh: 1},
            calculate: () =>
            {
                this.info.log(this);
            }
        {
            name: 'nextRainStarts48H',
            pretty_name: 'Date when rain starts',
            datatype: Datatypes.date,
            calculationInput: {thresh: 0.25},
            calcFunction: (data: any, input: any) => Calculation.next48HPrec
        },
        {
            name: 'next48HWind',
            pretty_name: 'Date when wind is stronger',
            datatype: Datatypes.date,
            calculationInput: {thresh: 5},
            calcFunction: (data: any, input: any) => Calculation.next48HWind
        },*/


export const languages: string[] = ['af', 'al', 'ar', 'az', 'bg', 'ca', 'cz', 'da', 'de', 'el', 'en', 'eu', 'fa', 'fi', 'fr', 'gl', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kr', 'la', 'lt', 'mk', 'no', 'nl', 'pl', 'pt', 'pt', 'ro', 'ru', 'sv', 'sk', 'sl', 'sp', 'sr', 'th', 'tr', 'ua', 'uk', 'vi', 'zh_cn', 'zh_tw', 'zu'];
