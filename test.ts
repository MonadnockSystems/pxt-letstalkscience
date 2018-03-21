// tests go here; this will not be compiled when this package is used as a library

music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once);
lts.start_science();
basic.pause(1000);
serial.writeLine("CO2 (ppm),temperature (deg. C),relative humidity (%)")
basic.forever(() => {
    serial.writeString(lts.get_co2_ppm() + ",");
    serial.writeString(lts.get_temp_string() + ",");
    serial.writeLine(lts.get_rh_string());
    basic.pause(5000);
})