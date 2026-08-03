import { circle, collapse as C, ell, poly, seg } from '../lib/doodle';

import type { Point, Stage } from '../types/doodle';

/**
 * The seven finished doodles, each a set of `NS` strokes, in scroll order:
 * `0` curious stick figure with "?", `1` krawly spider, `2` tallies receipt, `3` rampr graph,
 * `4` stick figure in a tie with briefcase, `5` coffee, `6` mail. Adjacent stages morph
 * stroke-for-stroke, so a stroke slot holds the "same" line across stages (e.g. slot 5 is the
 * tie body); unused slots park at a collapse point. Coordinates are the prototype's verbatim —
 * they are the single source of truth for the geometry; retune here, not in the engine.
 */
export const STAGES: Stage[] = [
  // 0 — curious stick figure with a hand-drawn "?"
  [
    circle(766, 369, 65), ell(746, 353, 3.4, 5.6), ell(786, 353, 3.4, 5.6),
    poly([742, 386], [756, 396], [776, 396], [790, 386]), seg(730, 597, 802, 597),
    seg(747, 470, 678, 539), seg(785, 468, 872, 400), seg(742, 597, 708, 692), seg(790, 597, 824, 692),
    seg(832, 446, 913, 360), seg(880, 328, 902, 304), seg(902, 304, 968, 368), seg(968, 368, 946, 392),
    seg(946, 392, 880, 328), seg(752, 433, 730, 597), seg(780, 433, 802, 597), C(800, 420), C(800, 420),
  ],
  // 1 — krawly: a spider hanging from a single thread
  [
    seg(800, 90, 800, 372), circle(800, 412, 40), ell(786, 401, 2.8, 4.6), ell(814, 401, 2.8, 4.6),
    poly([764, 398], [716, 372], [688, 336]), poly([762, 414], [706, 414], [672, 400]),
    poly([766, 430], [714, 452], [688, 486]), poly([836, 398], [884, 372], [912, 336]),
    poly([838, 414], [894, 414], [928, 400]), poly([834, 430], [886, 452], [912, 486]),
    C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420),
  ],
  // 2 — tallies: a receipt with a torn zigzag bottom
  [
    seg(700, 178, 900, 178),
    poly([901, 560], [871, 547], [841, 565], [811, 547], [781, 565], [751, 547], [721, 565], [700, 558]),
    seg(900, 178, 901, 560), seg(700, 558, 700, 178),
    seg(734, 240, 866, 239), seg(734, 296, 838, 295), seg(734, 348, 866, 347), seg(734, 400, 818, 399),
    seg(734, 452, 852, 451), seg(734, 504, 866, 503),
    C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420),
  ],
  // 3 — rampr: rising axes + jagged line with a stroke-only arrowhead
  [
    seg(560, 260, 560, 600), seg(560, 600, 1060, 596),
    poly([576, 570], [646, 522], [692, 550], [766, 462], [832, 384], [912, 414], [986, 326], [1052, 300]),
    poly([1025, 295], [1058, 297], [1035, 321]), C(800, 420),
    C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420),
    C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420), C(800, 420),
  ],
  // 4 — stick figure in a tie, holding a briefcase
  [
    circle(766, 369, 65), ell(746, 353, 3.4, 5.6), ell(786, 353, 3.4, 5.6),
    poly([742, 386], [756, 396], [776, 396], [790, 386]), seg(730, 597, 802, 597),
    poly([766, 466], [777, 512], [766, 552], [755, 512], [766, 466]), seg(747, 470, 678, 539),
    seg(785, 468, 910, 568), seg(742, 597, 708, 692), seg(790, 597, 824, 692),
    seg(850, 592, 970, 590), seg(970, 590, 971, 680), seg(971, 680, 851, 681), seg(851, 681, 850, 592),
    poly([894, 590], [898, 568], [922, 567], [926, 590]),
    poly([766, 434], [776, 449], [766, 464], [756, 449], [766, 434]), seg(752, 433, 730, 597), seg(780, 433, 802, 597),
  ],
  // 5 — coffee: mug, saucer, three steam squiggles
  [
    poly([690, 354], [706, 494], [738, 576], [800, 590], [862, 576], [894, 494], [910, 354]),
    ell(800, 354, 115, 26), ell(800, 356, 88, 17),
    poly([904, 406], [966, 414], [972, 454], [930, 494], [892, 492]),
    poly([668, 588], [684, 604], [734, 616], [800, 622], [866, 616], [916, 604], [932, 588]),
    poly([760, 312], [750, 274], [766, 236], [756, 200]), poly([800, 306], [792, 270], [806, 234], [798, 198]),
    poly([840, 312], [850, 274], [834, 236], [844, 200]), poly([668, 588], [678, 578], [714, 572], [756, 576]),
    poly([932, 588], [922, 578], [886, 572], [844, 576]), C(800, 420), C(800, 420), C(800, 420), C(800, 420),
    C(800, 420), C(800, 420), C(800, 420), C(800, 420),
  ],
  // 6 — mail: an envelope
  [
    seg(624, 322, 976, 320), seg(976, 320, 978, 558), seg(978, 558, 626, 560), seg(626, 560, 624, 322),
    seg(624, 322, 800, 462), seg(800, 462, 976, 320), C(800, 440), C(800, 440), C(800, 440), C(800, 440),
    C(800, 440), C(800, 440), C(800, 440), C(800, 440), C(800, 440), C(800, 440), C(800, 440), C(800, 440),
  ],
];

/**
 * Each stage's hand-tuned visual centre in world coords. The engine interpolates between the
 * current pair and pins the result to the drawing band's centre, so every doodle sits centred
 * regardless of where its strokes happen to fall in the `1600×900` world.
 */
export const ANCHORS: Point[] = [
  [810, 498], [800, 397], [800, 372], [785, 458], [815, 498], [818, 424], [801, 414],
];
