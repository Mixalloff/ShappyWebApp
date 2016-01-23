'use strict';
class Error {

    notify() {
        alertify.notify(this.message, 'error');
    };

    redirect(url) {
        url = url || "/main";
        window.location.href = url;
    };

    show() {
        switch(this.type) {
            case 'register': this.notify(); break;
            case 'type2': this.redirect(); break;
            default: this.notify();
        }
    };

    constructor(message,type) {
        this.message = message;
        this.type = type;
    }

}