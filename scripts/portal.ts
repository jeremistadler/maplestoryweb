/// <reference path="main.ts" />

enum PortalType {
    "Start Point",
    "Invisible",
    "Visible",
    "Collision",
    "Changable",
    "Changable Invisible",
    "Town Portal",
    "Script",
    "Script Invisible",
    "Script Collision",
    "Hidden",
    "Script Hidden",
    "Vertical Spring",
    "Custom Impact Spring",
    "Unknown (PCIG)"
};

class Portal {
    public toMapId: number;
    public toPortal: string;
    public name: string;
    public position: Vector;
    public id: string;
    public size: number = 20;
    public type: PortalType;

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, false);
        ctx.strokeStyle = 'green';
        if (this.isPlayerTouching(ms.player))
            ctx.strokeStyle = 'red';
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.fillText(PortalType[this.type] + ':' + this.toMapId + ':' + this.toPortal, this.position.x - 30, this.position.y - 30);
    }

    canUse(player: Player) {
        return this.isPlayerTouching(player) &&
            (this.type == PortalType.Visible || this.type == PortalType.Hidden);
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
            portal.id = key;
            portal.type = <PortalType>item.pt;

            list.push(portal);
        }

        return list;
    }
}