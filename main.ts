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

    let co2_raw = 0;

    function reset_temp_humid() {
        pins.i2cWriteNumber(
            TH.ADDR,
            TH.RESET,
            NumberFormat.UInt8LE,
            false
        );
    }

    //% block
    export function start_science() {
        serial.redirect(
            SerialPin.P15,
            SerialPin.P16,
            BaudRate.BaudRate115200
        );

        pins.onPulsed(DigitalPin.P13, PulseValue.High, () => {
            co2_raw = pins.pulseDuration();
        });

        reset_temp_humid();
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
        return n/100 + "." + n%100;
    }

    //% block
    export function get_co2_ppm() {
        return 5 * (co2_raw / 1000 - 2);
    }

    //% block="Temperature" icon="\uf135"
    export function get_temp_number() {
        return get_raw_temp() * 17572 / 65536 - 4685;
    }

    //% block
    export function get_temp_string() {
        let r = get_temp_number();
        return decimalize(r);
    }

    //% block
    export function get_rh_number() {
        return get_raw_humid() * 12500 / 65536 - 600;
    }

    //% block
    export function get_rh_string() {
        let r = get_rh_number();
        return decimalize(r);
    }

}
