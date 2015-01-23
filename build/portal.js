/// <reference path="main.ts" />
var PortalType;
(function (PortalType) {
    PortalType[PortalType["Start Point"] = 0] = "Start Point";
    PortalType[PortalType["Invisible"] = 1] = "Invisible";
    PortalType[PortalType["Visible"] = 2] = "Visible";
    PortalType[PortalType["Collision"] = 3] = "Collision";
    PortalType[PortalType["Changable"] = 4] = "Changable";
    PortalType[PortalType["Changable Invisible"] = 5] = "Changable Invisible";
    PortalType[PortalType["Town Portal"] = 6] = "Town Portal";
    PortalType[PortalType["Script"] = 7] = "Script";
    PortalType[PortalType["Script Invisible"] = 8] = "Script Invisible";
    PortalType[PortalType["Script Collision"] = 9] = "Script Collision";
    PortalType[PortalType["Hidden"] = 10] = "Hidden";
    PortalType[PortalType["Script Hidden"] = 11] = "Script Hidden";
    PortalType[PortalType["Vertical Spring"] = 12] = "Vertical Spring";
    PortalType[PortalType["Custom Impact Spring"] = 13] = "Custom Impact Spring";
    PortalType[PortalType["Unknown (PCIG)"] = 14] = "Unknown (PCIG)";
})(PortalType || (PortalType = {}));
;
var Portal = (function () {
    function Portal() {
        this.size = 30;
    }
    Portal.prototype.draw = function (ctx) {
        //ctx.beginPath();
        //ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, false);
        //ctx.strokeStyle = 'green';
        //if (this.isPlayerTouching(ms.player))
        //    ctx.strokeStyle = 'red';
        //ctx.stroke();
        //ctx.fillStyle = 'black';
        //ctx.fillText(PortalType[this.type] + ':' + this.toMapId + ':' + this.toPortal, this.position.x - 30, this.position.y - 30);
        if (this.tex)
            this.tex.draw(ctx);
    };
    Portal.prototype.canUse = function (player) {
        return this.isPlayerTouching(player) && (this.type == 2 /* Visible */ || this.type == 10 /* Hidden */);
    };
    Portal.prototype.isPlayerTouching = function (play) {
        var distance = Vector.distanceSquared(this.position, play.Position);
        return distance < this.size * this.size;
    };
    Portal.loadPortals = function (data) {
        var list = [];
        for (var key in data) {
            var item = data[key];
            var portal = new Portal();
            portal.position = new Vector(item.x, item.y);
            portal.toMapId = item.tm;
            portal.toPortal = item.tn;
            portal.name = item.pn;
            portal.id = parseInt(key);
            portal.type = item.pt;
            if (portal.type == 2 /* Visible */)
                portal.tex = new AnimationSprite('Map/MapHelper.img/portal/game/pv', portal.position);
            if (portal.type == 10 /* Hidden */)
                portal.tex = new AnimationSprite('Map/MapHelper.img/portal/game/ph/default/portalStart', portal.position);
            list.push(portal);
        }
        return list;
    };
    return Portal;
})();
