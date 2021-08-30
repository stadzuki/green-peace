function checkInput(str, type) {
    switch(type) {
        case 'email': 
            if(str.search(/^[a-zA-Z.\-_0-9]{1,64}@[a-zA-Z0-9]{3,12}\.[a-zA-Z]{2,12}$/) === -1) {
                return false;
            }
            break;
        case 'password':
            if(str.search(/^[a-zA-Z0-9]{6,16}$/) === -1) {
                return false;
            }
            break;
        case 're-password':
            if(str.search(/^[a-zA-Z0-9]{6,16}$/) === -1) {
                return false;
            }
            break;
        default:
            return false;

    }
    return true;
}

export default checkInput