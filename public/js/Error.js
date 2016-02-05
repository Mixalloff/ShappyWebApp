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
            case 'unactivated': this.redirect('/resend/'+this.message); break;
            default: this.notify();
        }
    };

    constructor(message,type) {
        this.message = message;
        alert(this.message);
        this.type = type;
    }

}