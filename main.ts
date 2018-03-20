/**
 * Provides access to LTS Sensor Board functionality.
 */
//% color=190 weight=100 icon="\uf1ec" block="Let's Talk Science!"
namespace lts {

    enum TH {
        ADDR = 0x40,
        RESET = 0xFE,
        MEASURE_TEMP = 0xE3,
        MEASURE_HUMID = 0xE5,
    }

    class lts_board {
        co2_pin : DigitalPin;
        co2_ppm : number;

        constructor() {
            this.co2_pin = DigitalPin.P13;
            this.co2_ppm = 0;

            serial.redirect(
                SerialPin.P15,
                SerialPin.P16,
                BaudRate.BaudRate115200
            );

            pins.onPulsed(this.co2_pin, PulseValue.High, () => {
                this.co2_ppm = (pins.pulseDuration() / 1000 - 2) * 5;
            });

            this.reset_temp_humid();
        }

        reset_temp_humid() {
            pins.i2cWriteNumber(
                TH.ADDR,
                TH.RESET,
                NumberFormat.UInt8LE,
                false
            )
        }

        get_raw_temp() {
            pins.i2cWriteNumber(TH.ADDR, TH.MEASURE_TEMP, NumberFormat.UInt8LE);
            let raw = pins.i2cReadNumber(TH.ADDR, NumberFormat.UInt16BE);
            return raw;
        }

        get_raw_humid() {
            pins.i2cWriteNumber(TH.ADDR, TH.MEASURE_HUMID, NumberFormat.UInt8LE);
            let raw = pins.i2cReadNumber(TH.ADDR, NumberFormat.UInt16BE);
            return raw;
        }

        get_raw_co2() {
            return this.co2_ppm;
        }
    }
}