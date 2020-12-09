const controlScheme = {
    ARROW_KEYS:1,
    MOUSE:2,
    WASD:3
};
Object.freeze(controlScheme);

const keys = {
    W:87,
    A:65,
    S:83,
    D:68,
    R : 114,
    MINUS:189,
    EQUALS: 187
};
Object.freeze(keys);

const colors = {
    LIGHT_BG : [244, 250, 255], 
    DARK_BG : [72, 80, 80], 
    DEAD : [255, 0, 0], 
    QUARANTINED : [255, 0, 255], 
    ALIVE : [0, 255, 0], 
    TESTER : [0, 0, 128], 
    TESTER_NAME : [255, 0, 128],
    GRID_LINES : [219, 227, 231],
    DARK_TEXT : [219, 215, 250],
    TRANSLUCENT_LIGHT_BG : [244, 250, 255, 200]
};

const outcome = {
    IMMUNE : -2,
    UNINFECTED : -1, 
    ASYMPTOMATIC : 0, 
    MILD : 1, 
    SERIOUS : 2, 
    DEAD : 3
}

Object.freeze(colors);

const MINIMAP_SCALE_FACTOR = 8;

const MINIMUM_SCALER = 0.7;
const MAXIMUM_SCALER = 1.2;

const GRID_SIZE = 100;
const TESTER_SIZE = 64;
const PERSON_RAD = 16; // For aesthetics, this should be fixed to show person animations.
const SIMPLE_TEXT = 11;
const TESTER_TEXT = 20;
const TESTER_SPEED = 6;
const PERSON_SPEED = 3;