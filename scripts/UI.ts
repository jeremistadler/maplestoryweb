/// <reference path="main.ts" />

class UI {
    private onLogin = new MSEvent<string>();
    private onLogout = new MSEvent<void>();

    public get LoggedIn(): MSEvent<string> { return this.onLogin; }
    public get LoggedOut(): MSEvent<void> { return this.onLogout; }

    test(){
        this.onLogin.trigger('bob');

        //http.baseUrl + map.BasePath + 'minimap/canvas.png'
    }
}