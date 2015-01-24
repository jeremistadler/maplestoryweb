/// <reference path="main.ts" />

enum PortalType {
    "StartPoint",
    "Invisible",
    "Visible",
    "Collision",
    "Changable",
    "Changable Invisible",
    "TownPortal",
    "Script",
    "ScriptInvisible",
    "ScriptCollision",
    "Hidden",
    "ScriptHidden",
    "VerticalSpring",
    "CustomImpactSpring",
    "UnknownPCIG"
};

class Portal {
    public toMapId: number;
    public toPortal: string;
    public name: string;
    public position: Vector;
    public id: number;
    public size: number = 30;
    public type: PortalType;
    public tex: AnimationSprite;

    draw(ctx: CanvasRenderingContext2D) {
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
    }

    canUse(player: Player) {
        return this.isPlayerTouching(player) &&
            (this.toMapId != 999999999);
    }

    isPlayerTouching(play: Player) {
        var distance = Vector.distanceSquared(this.position, play.Position);
        return distance < this.size * this.size;
    }

    static loadPortals(data): Portal[] {
        var list = [];
        for (var key in data) {
            var item = data[key];
            var portal = new Portal();

            portal.position = new Vector(item.x, item.y);
            portal.toMapId = item.tm;
            portal.toPortal = item.tn;
            portal.name = item.pn;
            portal.id = parseInt(key);
            portal.type = <PortalType>item.pt;

            if (portal.type == PortalType.Visible)
                portal.tex = new AnimationSprite('Map/MapHelper.img/portal/game/pv', portal.position);

            else if (portal.type == PortalType.Hidden)
                portal.tex = new AnimationSprite('Map/MapHelper.img/portal/game/ph/default/portalStart', portal.position);


            else if (portal.toMapId != 999999999)
                portal.tex = new AnimationSprite('Map/MapHelper.img/portal/game/psh/default/portalStart', portal.position);




            list.push(portal);
        }

        return list;
    }
}