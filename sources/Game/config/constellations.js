// Real constellations (M5): the main stars of 10 well-known constellations, from the Yale Bright
// Star Catalogue, 5th revised edition (Hoffleit & Warren 1991, J2000; public domain, distributed by
// NASA HEASARC / CDS; see CREDITS.md), rounded to 0.1 arc-minute. Close doubles use the combined
// magnitude of their catalogue components (what the eye sees).
// Each star: [ right ascension (hours), declination (degrees), visual magnitude ].
// lines: pairs of star indices (the usual stick figure). Names are in sources/content/sky.js.
const h = (hours, minutes) => hours + minutes / 60
const d = (degrees, minutes) => Math.sign(degrees || 1) * (Math.abs(degrees) + minutes / 60)

export default [
    {
        id: 'crux',
        stars: [
            [ h(12, 26.6), d(- 63, 5.9), 0.76 ], // Acrux (α¹ + α², combined)
            [ h(12, 47.7), d(- 59, 41.3), 1.25 ], // Mimosa
            [ h(12, 31.2), d(- 57, 6.8), 1.64 ], // Gacrux
            [ h(12, 15.1), d(- 58, 44.9), 2.79 ], // Imai (δ)
            [ h(12, 21.4), d(- 60, 24.1), 3.59 ] // Ginan (ε)
        ],
        lines: [ [ 0, 2 ], [ 1, 3 ] ]
    },
    {
        id: 'orion',
        stars: [
            [ h(5, 55.2), d(7, 24.4), 0.50 ], // Betelgeuse
            [ h(5, 14.5), d(- 8, 12.1), 0.13 ], // Rigel
            [ h(5, 25.1), d(6, 20.9), 1.64 ], // Bellatrix
            [ h(5, 32.0), - d(0, 17.9), 2.23 ], // Mintaka (δ, −0°18′)
            [ h(5, 36.2), d(- 1, 12.1), 1.69 ], // Alnilam
            [ h(5, 40.8), d(- 1, 56.6), 1.91 ], // Alnitak (combined)
            [ h(5, 47.8), d(- 9, 40.2), 2.06 ], // Saiph
            [ h(5, 35.1), d(9, 56.0), 3.39 ] // Meissa
        ],
        lines: [ [ 7, 0 ], [ 7, 2 ], [ 0, 2 ], [ 0, 5 ], [ 2, 3 ], [ 3, 4 ], [ 4, 5 ], [ 5, 6 ], [ 3, 1 ] ]
    },
    {
        id: 'ursaMajor',
        stars: [
            [ h(11, 3.7), d(61, 45.1), 1.79 ], // Dubhe
            [ h(11, 1.8), d(56, 22.9), 2.37 ], // Merak
            [ h(11, 53.8), d(53, 41.7), 2.44 ], // Phecda
            [ h(12, 15.4), d(57, 1.9), 3.31 ], // Megrez
            [ h(12, 54.0), d(55, 57.6), 1.77 ], // Alioth
            [ h(13, 23.9), d(54, 55.5), 2.27 ], // Mizar
            [ h(13, 47.5), d(49, 18.8), 1.86 ] // Alkaid
        ],
        lines: [ [ 0, 1 ], [ 1, 2 ], [ 2, 3 ], [ 3, 0 ], [ 3, 4 ], [ 4, 5 ], [ 5, 6 ] ]
    },
    {
        id: 'cassiopeia',
        stars: [
            [ h(0, 9.2), d(59, 9.0), 2.28 ], // Caph
            [ h(0, 40.5), d(56, 32.2), 2.24 ], // Schedar
            [ h(0, 56.7), d(60, 43.0), 2.47 ], // γ Cas
            [ h(1, 25.8), d(60, 14.1), 2.68 ], // Ruchbah
            [ h(1, 54.4), d(63, 40.2), 3.37 ] // Segin
        ],
        lines: [ [ 0, 1 ], [ 1, 2 ], [ 2, 3 ], [ 3, 4 ] ]
    },
    {
        id: 'scorpius',
        stars: [
            [ h(16, 29.4), d(- 26, 25.9), 0.96 ], // Antares
            [ h(16, 0.3), d(- 22, 37.3), 2.32 ], // Dschubba
            [ h(16, 5.4), d(- 19, 48.3), 2.62 ], // Acrab
            [ h(15, 58.9), d(- 26, 6.8), 2.89 ], // π Sco
            [ h(16, 21.2), d(- 25, 35.6), 2.89 ], // σ Sco
            [ h(16, 35.9), d(- 28, 12.9), 2.82 ], // τ Sco
            [ h(16, 50.2), d(- 34, 17.6), 2.29 ], // ε Sco
            [ h(16, 51.9), d(- 38, 2.8), 3.08 ], // μ¹ Sco
            [ h(16, 54.6), d(- 42, 21.7), 3.62 ], // ζ² Sco
            [ h(17, 12.2), d(- 43, 14.3), 3.33 ], // η Sco
            [ h(17, 37.3), d(- 43, 0.0), 1.86 ], // Sargas (θ)
            [ h(17, 47.6), d(- 40, 7.6), 3.03 ], // ι¹ Sco
            [ h(17, 42.5), d(- 39, 1.8), 2.41 ], // κ Sco
            [ h(17, 33.6), d(- 37, 6.2), 1.62 ], // Shaula
            [ h(17, 30.8), d(- 37, 17.7), 2.69 ] // Lesath
        ],
        lines: [ [ 2, 1 ], [ 1, 3 ], [ 1, 4 ], [ 4, 0 ], [ 0, 5 ], [ 5, 6 ], [ 6, 7 ], [ 7, 8 ], [ 8, 9 ], [ 9, 10 ], [ 10, 11 ], [ 11, 12 ], [ 12, 13 ], [ 13, 14 ] ]
    },
    {
        id: 'leo',
        stars: [
            [ h(10, 8.4), d(11, 58.0), 1.35 ], // Regulus
            [ h(11, 49.1), d(14, 34.3), 2.14 ], // Denebola
            [ h(10, 20.0), d(19, 50.5), 2.30 ], // Algieba (γ¹ + γ², combined)
            [ h(11, 14.1), d(20, 31.4), 2.56 ], // Zosma
            [ h(11, 14.2), d(15, 25.8), 3.33 ], // Chertan
            [ h(10, 7.3), d(16, 45.8), 3.48 ], // η Leo
            [ h(9, 45.9), d(23, 46.4), 2.98 ], // ε Leo
            [ h(9, 52.8), d(26, 0.4), 3.88 ], // Rasalas
            [ h(10, 16.7), d(23, 25.0), 3.44 ] // Adhafera
        ],
        lines: [ [ 0, 5 ], [ 5, 2 ], [ 2, 8 ], [ 8, 7 ], [ 7, 6 ], [ 2, 3 ], [ 3, 1 ], [ 1, 4 ], [ 4, 0 ], [ 4, 3 ] ]
    },
    {
        id: 'cygnus',
        stars: [
            [ h(20, 41.4), d(45, 16.8), 1.25 ], // Deneb
            [ h(20, 22.2), d(40, 15.4), 2.20 ], // Sadr
            [ h(19, 30.7), d(27, 57.6), 3.08 ], // Albireo
            [ h(20, 46.2), d(33, 58.2), 2.48 ], // Aljanah (ε)
            [ h(19, 45.0), d(45, 7.8), 2.87 ] // Fawaris (δ)
        ],
        lines: [ [ 0, 1 ], [ 1, 2 ], [ 4, 1 ], [ 1, 3 ] ]
    },
    {
        id: 'taurus',
        stars: [
            [ h(4, 35.9), d(16, 30.6), 0.86 ], // Aldebaran
            [ h(5, 26.3), d(28, 36.4), 1.65 ], // Elnath
            [ h(5, 37.6), d(21, 8.6), 3.0 ], // ζ Tau
            [ h(3, 47.5), d(24, 6.3), 2.87 ], // Alcyone (Pleiades)
            [ h(4, 19.8), d(15, 37.6), 3.65 ], // γ Tau
            [ h(4, 22.9), d(17, 32.6), 3.76 ], // δ¹ Tau
            [ h(4, 28.6), d(19, 10.8), 3.53 ], // Ain (ε)
            [ h(4, 28.7), d(15, 52.3), 3.40 ], // θ² Tau
            [ h(4, 0.7), d(12, 29.4), 3.47 ] // λ Tau
        ],
        lines: [ [ 1, 6 ], [ 6, 5 ], [ 5, 4 ], [ 4, 7 ], [ 7, 0 ], [ 0, 2 ], [ 4, 8 ] ]
    },
    {
        id: 'gemini',
        stars: [
            [ h(7, 34.6), d(31, 53.3), 1.59 ], // Castor (combined)
            [ h(7, 45.3), d(28, 1.6), 1.14 ], // Pollux
            [ h(6, 37.7), d(16, 23.9), 1.93 ], // Alhena
            [ h(6, 43.9), d(25, 7.9), 2.98 ], // Mebsuta
            [ h(6, 23.0), d(22, 30.8), 2.87 ], // Tejat
            [ h(7, 20.1), d(21, 58.9), 3.53 ], // Wasat
            [ h(7, 4.1), d(20, 34.2), 3.79 ] // Mekbuda
        ],
        lines: [ [ 0, 1 ], [ 0, 3 ], [ 3, 4 ], [ 1, 5 ], [ 5, 6 ], [ 6, 2 ] ]
    },
    {
        id: 'centaurus',
        stars: [
            [ h(14, 39.6), d(- 60, 50.0), - 0.29 ], // Rigil Kentaurus (α¹ + α², combined)
            [ h(14, 3.8), d(- 60, 22.4), 0.61 ], // Hadar
            [ h(14, 6.7), d(- 36, 22.2), 2.06 ], // Menkent
            [ h(12, 41.5), d(- 48, 57.6), 2.17 ], // Muhlifain (γ)
            [ h(13, 39.9), d(- 53, 28.0), 2.30 ], // ε Cen
            [ h(14, 35.5), d(- 42, 9.5), 2.31 ], // η Cen
            [ h(13, 55.5), d(- 47, 17.3), 2.55 ], // ζ Cen
            [ h(12, 8.4), d(- 50, 43.3), 2.60 ], // δ Cen
            [ h(13, 20.6), d(- 36, 42.7), 2.75 ] // ι Cen
        ],
        lines: [ [ 0, 1 ], [ 1, 4 ], [ 4, 6 ], [ 6, 5 ], [ 6, 2 ], [ 2, 8 ], [ 4, 3 ], [ 3, 7 ] ]
    }
]

// North galactic pole (RA 12h 51.4m, Dec +27.13°): the Milky Way band is the great circle around it
export const GALACTIC_POLE = [ h(12, 51.4), 27.13 ]
