/**
 * Provides access to LTS Sensor Board functionality.
 */
//% color=190 weight=100 icon="\uf135" block="Let's Talk Science!"
namespace lts {

    enum TH {
        ADDR = 0x40,
        RESET = 0xFE,
        MEASURE_TEMP = 0xE3,
        MEASURE_HUMID = 0xE5,
    };

    enum TSL2561 {
        ADDR = 0x39,
        SERIAL = 0x8A,
        VISIBLE = 0x8C,
    }

    let co2_raw = 0;
    let lightSensorPresent = false;
    let haveCheckedLightSensor = false;

    function reset_temp_humid() {
        pins.i2cWriteNumber(
            TH.ADDR,
            TH.RESET,
            NumberFormat.UInt8LE,
            false
        );
    }

    function checkLightSensor() : boolean {
        pins.i2cWriteNumber(TSL2561.ADDR, TSL2561.SERIAL, NumberFormat.UInt8LE);
        let serial_num = pins.i2cReadNumber(TH.ADDR, NumberFormat.UInt8LE);
        if (serial_num == 0x0) {
            serial.writeLine("Couldn't find light sensor, disabling.");
            return false;
        } else {
            let part = serial_num >> 4;
            switch (part) {
                case 0x0:
                    serial.writeString("Light Sensor is TSL2560");
                    break;
                case 0x1:
                    serial.writeString("Light Sensor is TSL2561");
                    break;
                default:
                    serial.writeString("Bad light sensor part code: " + part);
                    return false;
            }
            let rev = serial_num & 0xf;
            serial.writeLine(", rev. " + rev);
            return true;
        }
    }

    //% block
    export function haveLightSensor() : boolean {
        return lightSensorPresent
    }

    function get_light_raw() {
        pins.i2cWriteNumber(TSL2561.ADDR, TSL2561.VISIBLE, NumberFormat.UInt8LE);
        let raw = pins.i2cReadNumber(TH.ADDR, NumberFormat.UInt16LE);
        return raw;
    }

    //% block
    export function lux() {
        // Eventually do some real maths
        if (haveLightSensor() != true) {
            return "";
        }
        return "" + get_light_raw();
    }

    //% block
    export function startSensorBoard() {
        serial.redirect(
            SerialPin.P15,
            SerialPin.P16,
            BaudRate.BaudRate115200
        );

        pins.onPulsed(DigitalPin.P13, PulseValue.High, () => {
            co2_raw = pins.pulseDuration();
        });

        reset_temp_humid();

        lightSensorPresent = checkLightSensor();
    }

    function get_raw_temp() {
        pins.i2cWriteNumber(TH.ADDR, TH.MEASURE_TEMP, NumberFormat.UInt8LE);
        let raw = pins.i2cReadNumber(TH.ADDR, NumberFormat.UInt16BE);
        return raw;
    }

    function get_raw_humid() {
        pins.i2cWriteNumber(TH.ADDR, TH.MEASURE_HUMID, NumberFormat.UInt8LE);
        let raw = pins.i2cReadNumber(TH.ADDR, NumberFormat.UInt16BE);
        return raw;
    }

    function get_raw_co2() {
        return co2_raw;
    }

    function decimalize(n : number) {
        return n/100 + "." + n%100 / 10;
    }

    //% block
    export function co2() {
        return 5 * (co2_raw / 1000 - 2);
    }

    //% block
    export function temperature() {
        return get_raw_temp() * 17572 / 65536 - 4685;
    }

    //% block
    export function temperatureString() {
        let r = temperature();
        return decimalize(r);
    }

    //% block
    export function humidity() {
        return get_raw_humid() * 12500 / 65536 - 600;
    }

    //% block
    export function humidityString() {
        let r = humidity();
        return decimalize(r);
    }

}
