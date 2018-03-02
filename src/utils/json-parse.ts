//json parsing for error._body
export const JSONPARSE = function (error, event) {
    if(error.constructor === String && error){
        return JSON.parse(error)[event];
    }else{
        return null;
    }

}