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
    constructor(public position: Vector, public name: string) { }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2, false);
        ctx.strokeStyle = 'pink';
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.fillText(this.name, this.position.x - 30, this.position.y - 30);
    }

    static loadPortals(data): Portal[] {
        var list = [];
        for (var key in data) {
            var portal = data[key];
            var pos = new Vector(portal.x, portal.y);
            list.push(new Portal(new Vector(pos.x, pos.y), portal.pn + ":" + portal.pt));
        }

        return list;
    }
}