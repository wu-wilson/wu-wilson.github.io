/**
 * The seven finished doodles, their visual centres, and the strokes each fills, built from the
 * stroke constructors in `lib/doodle.ts`. Coordinates are hand-placed and are the single source of
 * truth for the geometry; retune here, never in the engine.
 */

import { circle, collapse as C, ell, poly, seg } from '../lib/doodle';

import type { Point, Stage } from '../types/doodle';

/**
 * The seven doodles, each a set of `NS` strokes, in scroll order: `0` stick figure raising a
 * hammer, `1` krawly web, `2` tallies receipt, `3` rampr graph, `4` stick figure in a tie with
 * briefcase, `5` coffee, `6` mail. Adjacent stages morph stroke-for-stroke, so slot `i` is one pen
 * stroke's identity through the film, not a fixed feature — slot 5 is an arm here, the tie body in
 * stage 4, a steam squiggle in stage 5. Slots a stage doesn't need park at a collapse point.
 */
export const STAGES: Stage[] = [
  // 0 — stick figure raising a hammer
  [
    circle(766, 369, 65), ell(746, 353, 3.4, 5.6), ell(786, 353, 3.4, 5.6),
    poly([742, 386], [756, 396], [776, 396], [790, 386]), seg(730, 597, 802, 597),
    seg(747, 470, 678, 539), seg(785, 468, 872, 400), seg(742, 597, 708, 692), seg(790, 597, 824, 692),
    seg(832, 446, 913, 360), seg(880, 328, 902, 304), seg(902, 304, 968, 368), seg(968, 368, 946, 392),
    seg(946, 392, 880, 328), seg(752, 433, 730, 597), seg(780, 433, 802, 597), C(800, 420), C(800, 420),
  ],
  // 1 — krawly: a spider web, eight spokes and four rings of thread sagging between them
  [
    poly([828, 232], [870, 283], [930, 303], [925, 373], [959, 434], [915, 474], [900, 531], [829, 530], [766, 570]),
    seg(800, 400, 835, 192), seg(800, 400, 965, 277),
    poly([766, 570], [724, 517], [662, 497], [666, 433], [635, 378], [687, 329], [704, 258], [770, 263], [828, 232]),
    seg(800, 400, 1016, 447), seg(800, 400, 932, 573), seg(800, 400, 760, 600), seg(800, 400, 625, 523),
    seg(800, 400, 589, 372), seg(800, 400, 675, 215),
    poly([820, 282], [851, 317], [896, 329], [893, 380], [919, 426], [887, 457], [878, 502], [823, 495], [777, 518]),
    poly([777, 518], [745, 483], [698, 472], [700, 425], [675, 384], [717, 349], [732, 298], [779, 303], [820, 282]),
    poly([813, 320], [835, 343], [867, 350], [863, 386], [879, 417], [856, 436], [848, 463], [814, 463], [784, 482]),
    poly([784, 482], [765, 455], [737, 444], [736, 415], [718, 389], [746, 367], [756, 335], [787, 336], [813, 320]),
    poly([806, 362], [817, 373], [832, 376], [830, 393], [837, 408], [827, 417], [823, 430], [807, 430], [792, 439]),
    poly([792, 439], [782, 428], [766, 424], [768, 408], [762, 395], [774, 384], [778, 368], [793, 369], [806, 362]),
    C(800, 400), C(800, 400),
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
  [810, 498], [800, 400], [800, 372], [785, 458], [815, 498], [818, 424], [801, 414],
];

/**
 * The slots each stage draws as solid ink rather than outline: the stick figures' eyes (1, 2), the
 * tie (5, 15), and the coffee's surface (2 again). The engine fades a fill with its stroke's morph
 * when only one side of the morph fills that slot, and holds it solid when both do.
 */
export const FILLS: number[][] = [[1, 2], [], [], [], [1, 2, 5, 15], [2], []];
