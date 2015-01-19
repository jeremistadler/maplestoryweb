/// <reference path="main.ts" />

enum PortalTypeNames {
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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2, false);
        ctx.strokeStyle = 'pink';
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.fillText(this.toMapId + ':' + this.toPortal, this.position.x - 30, this.position.y - 30);
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

            list.push(portal);
        }

        return list;
    }
}