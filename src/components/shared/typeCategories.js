function typeCategories(typeCategory) {
    let outStr;

    switch(typeCategory) {
        case 1:
            outStr = 'paper'
            break;
        case 2:
            outStr = 'glass'
            break;
        case 3:
            outStr = 'bottle'
            break;
        case 4:
            outStr = 'tin'
            break;
        case 5:
            outStr = 'clothes'
            break;
        case 6:
            outStr = 'gadget'
            break;
        case 7:
            outStr = 'radioactive'
            break;
        case 8:
            outStr = 'battery'
            break;
        case 9:
            outStr = 'lamp'
            break;
        case 10:
            outStr = 'technique'
            break;
        case 11:
            outStr = 'package'
            break;
        case 12:
            outStr = 'beer'
            break;
        case 13:
            outStr = 'tires'
            break;
    }

    return outStr;
}

export default typeCategories;