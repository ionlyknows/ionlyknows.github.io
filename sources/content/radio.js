// M7 The Observatory's radio dish: the tuner's stations, public-domain NASA recordings (NASA
// "Historical Sounds", https://www.nasa.gov/historical-sounds/; NASA audio is generally not subject to
// copyright, none of these is credited to a third party). Files in public/audio/radio/ (≤ 300 KB,
// loaded only when the tuner opens). `dial`: position on the dial, 0–1. Labels from NASA's own titles.
export default [
    { id: 'sputnik', dial: 0.1, file: 'sputnik.mp3', label: 'Sputnik 1: the beep of the first artificial satellite (1957)', source: 'https://www.nasa.gov/wp-content/uploads/2015/01/578626main_sputnik-beep.mp3' },
    { id: 'jupiter', dial: 0.3, file: 'jupiter-lightning.mp3', label: 'Voyager: lightning on Jupiter', source: 'https://www.nasa.gov/wp-content/uploads/2015/01/603921main_voyager_jupiter_lightning.mp3' },
    { id: 'saturn', dial: 0.5, file: 'saturn-radio.mp3', label: 'Cassini: radio emissions from Saturn', source: 'https://www.nasa.gov/wp-content/uploads/2015/01/584795main_saturn_radio_waves.mp3' },
    { id: 'enceladus', dial: 0.7, file: 'enceladus.mp3', label: 'Cassini: the sound of Saturn\'s moon Enceladus', source: 'https://www.nasa.gov/wp-content/uploads/2015/01/584796main_enceladus.mp3' },
    { id: 'kepler', dial: 0.9, file: 'kepler-star.mp3', label: 'Kepler: a star\'s changing brightness turned into sound', source: 'https://www.nasa.gov/wp-content/uploads/2015/01/578358main_kepler_star_KIC12268220C.mp3' }
]
