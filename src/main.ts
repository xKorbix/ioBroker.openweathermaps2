/*
 * Created with @iobroker/create-adapter v1.34.1
 */

import * as utils from '@iobroker/adapter-core';
import axios, {AxiosResponse} from "axios";
import {
    calculations,
    configuredDataList,
    currentDataConfig,
    DataMapping,
    Datatypes,
    languages
} from "./data";

class Openweathermaps2 extends utils.Adapter {


    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'openweathermaps2',
        });

        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {

        if (!await this.initConfig()) {
            setTimeout(() => this.stop?.(), 1000);
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

        for(let item of calculations.calculationList)
        {
            let result = await item.calculate(this);
            if(result) this.log.info(result.date);
        }


        this.log.info('Data processed.');
        setTimeout(() => this.stop?.(), 1000);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            callback();
        } catch (e) {
            callback();
        }
    }
    private getWeatherData = async (apikey: string, lang: string, unit: string, lat: number, lon: number): Promise<AxiosResponse> =>
        axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apikey + '&units=' + unit + '&lang=' + lang)
            .then((response): AxiosResponse => {
                return response;
            })
            .catch((error) => {
                this.log.error(error.response.data);
                return error;
            });

    private async initializeObject(id: string, name: string, datatype: Datatypes) {
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

    private async initListData() {
        for (let dataConfig of configuredDataList) {
            for (let i = 0; i < dataConfig.count; i++) {
                for (let item of dataConfig.datapoints) {
                    await this.initializeObject(dataConfig.root + '.' + i + '.' + item.name, item.pretty_name, item.datatype);
                }
            }
        }
    }

    private async initCurrentData() {
        for (let item of currentDataConfig.datapoints) {
            await this.initializeObject(currentDataConfig.root + '.' + item.name, item.pretty_name, item.datatype);
        }
    }

    private async fillData(data: any) {
        for (let dataConfig of configuredDataList) {
            for (let i = 0; i < dataConfig.count; i++) {
                for (let item of dataConfig.datapoints) {
                    let rawvalue = (dataConfig.root + '.' + i + '.' + ((item.rawsouce != null) ? item.rawsouce : item.name))
                        .split('.').reduce(function (o, k) {
                            return o && o[k];
                        }, data);
                    if (rawvalue == null) {
                        rawvalue = 0;
                    }
                    await this.setStateAsync(dataConfig.root + '.' + i + '.' + item.name,
                        {val: DataMapping.parseData(item.datatype, rawvalue), ack: true});
                }
            }
        }
    }

    private async fillCurrentData(data: any) {
        for (let item of currentDataConfig.datapoints) {
            let rawvalue = (currentDataConfig.root + '.' + ((item.rawsouce != null) ? item.rawsouce : item.name))
                .split('.').reduce(function (o, k) {
                    return o && o[k];
                }, data);
            if (rawvalue == null) {
                rawvalue = 0;
            }
            await this.setStateAsync(currentDataConfig.root + '.' + item.name,
                {val: DataMapping.parseData(item.datatype, rawvalue), ack: true});
        }
    }

    private async initConfig() {

        if (this.config.lat == null || this.config.lon == null
            || !isFinite(this.config.lat) || Math.abs(this.config.lat) > 90
            || !isFinite(this.config.lon) || Math.abs(this.config.lon) > 180) {
            this.log.error("Lat/Lon invalid.");
            return false;
        }
        this.log.debug('config lat, long: ' + this.config.lat + ', ' + this.config.lon);

        await this.getForeignObject('system.config', (err, systemConfig) => {
            this.config.lang = systemConfig?.common.language || 'de';
            if (this.config.lang.length == 0 || languages.indexOf(this.config.lang) < 0) {
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

    private async initCalculateResults() {
        for(let item of calculations.calculationList)
        {
            for(let resultItem of item.results)
            {
                await this.initializeObject(calculations.root + '.' + resultItem.name, resultItem.pretty_name, resultItem.datatype);
            }
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Openweathermaps2(options);
} else {
    // otherwise start the instance directly
    (() => new Openweathermaps2())();
}