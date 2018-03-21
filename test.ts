// tests go here; this will not be compiled when this package is used as a library
music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
basic.showLeds(`
    . . . . .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    `)
basic.pause(1000)
for (let index = 0; index <= 9; index++) {
    basic.showNumber(9 - index)
    basic.pause(1000)
}
lts.startSensorBoard()
basic.forever(() => {
    serial.writeString("" + lts.co2() + ",")
    serial.writeString("" + lts.temperatureString() + ",")
    if (lts.haveLightSensor()) {
        serial.writeString(lts.lux() + ",")
    }
    serial.writeLine(lts.humidityString())
    basic.showString("" + lts.co2() + " ppm")
    basic.showString("" + lts.temperatureString() + " C")
    basic.showString("" + lts.humidityString() + " %RH")
})
