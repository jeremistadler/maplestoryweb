var PortalType;
(function (PortalType) {
    PortalType[PortalType["StartPoint"] = 0] = "StartPoint";
    PortalType[PortalType["Invisible"] = 1] = "Invisible";
    PortalType[PortalType["Visible"] = 2] = "Visible";
    PortalType[PortalType["Collision"] = 3] = "Collision";
    PortalType[PortalType["Changable"] = 4] = "Changable";
    PortalType[PortalType["Changable Invisible"] = 5] = "Changable Invisible";
    PortalType[PortalType["TownPortal"] = 6] = "TownPortal";
    PortalType[PortalType["Script"] = 7] = "Script";
    PortalType[PortalType["ScriptInvisible"] = 8] = "ScriptInvisible";
    PortalType[PortalType["ScriptCollision"] = 9] = "ScriptCollision";
    PortalType[PortalType["Hidden"] = 10] = "Hidden";
    PortalType[PortalType["ScriptHidden"] = 11] = "ScriptHidden";
    PortalType[PortalType["VerticalSpring"] = 12] = "VerticalSpring";
    PortalType[PortalType["CustomImpactSpring"] = 13] = "CustomImpactSpring";
    PortalType[PortalType["UnknownPCIG"] = 14] = "UnknownPCIG";
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
        //if (this.isPlayerTouching(this.ms.player))
        //    ctx.strokeStyle = 'red';
        //ctx.stroke();
        //ctx.fillStyle = 'black';
        //ctx.fillText(PortalType[this.type] + ':' + this.toMapId + ':' + this.toPortal, this.position.x - 30, this.position.y - 30);
        if (this.tex)
            this.tex.draw(ctx);
    };
    Portal.prototype.canUse = function (player) {
        return this.isPlayerTouching(player) &&
            (this.toMapId != 999999999);
    };
    Portal.prototype.isPlayerTouching = function (play) {
        var distance = Vector.distanceSquared(this.position, play.Position);
        return distance < this.size * this.size;
    };
    Portal.loadPortals = function (ms, data) {
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
            if (portal.type == PortalType.Visible)
                portal.tex = new AnimationSprite(ms, 'Map/MapHelper.img/portal/game/pv', portal.position);
            else if (portal.type == PortalType.Hidden)
                portal.tex = new AnimationSprite(ms, 'Map/MapHelper.img/portal/game/ph/default/portalStart', portal.position);
            else if (portal.toMapId != 999999999)
                portal.tex = new AnimationSprite(ms, 'Map/MapHelper.img/portal/game/psh/default/portalStart', portal.position);
            list.push(portal);
        }
        return list;
    };
    return Portal;
})();
