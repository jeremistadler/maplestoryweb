//class AccEye {
//    id: number;
//    tex: Texture;
//    dx: number;
//    dy: number;
//    public AccEye(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Accessory/" + id + ".img/";
//        var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => {
//            instance.dx = data.x;
//            instance.dy = data.y;
//        });
//        this.tex = new Texture(path + "default.default.png");
//        this.dx = parseInt(xml._default.x.Value);
//        this.dy = parseInt(xml._default.y.Value);
//    }
//    RenderAccEye(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.tex.draw(ctx, x + this.dx + 15, y + this.dy + 12);
//    }
//}
//class AccFace {
//    id: number;
//    tex: Texture;
//    dx: number;
//    dy: number;
//    z: number;
//    public AccFace(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Accessory/" + id + ".img/";
//        this.tex = new Texture(path + "default.default.png");
//        var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => { });
//        this.dx = parseInt(xml._default.x.Value);
//        this.dy = parseInt(xml._default.y.Value);
//        z = xml._info.Z.Value == "accessoryFaceBelowFace" ? 0 : 1;
//    }
//    Render(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.tex.draw(ctx, x + this.dx + 15, y + this.dy + 12);
//    }
//}
//class Coat {
//    id: number;
//    body: Texture;
//    arm: Texture;
//    bodydx: number;
//    bodydy: number;
//    armdx: number;
//    armdy: number;
//    hasArms: number;
//    public Coat(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Coat/" + id + ".img/";
//        this.body = new Texture(path + "stand1.0.mail.png");
//        var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => { });
//        this.bodydx = parseInt(xml._mail.stand1.x.Value);
//        this.bodydy = parseInt(xml._mail.stand1.y.Value);
//        if (File.Exists(path + "stand1.0.mailArm.png")) {
//            hasArms = true;
//            arm = new Texture(path + "stand1.0.mailArm.png");
//            armdx = parseInt(xml._mailArm.stand1.x.Value);
//            armdy = parseInt(xml._mailArm.stand1.y.Value);
//        }
//    }
//    RenderBody(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.body.draw(ctx, x + this.bodydx + 15, y + this.bodydy + 43);
//    }
//    RenderArm(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        if (hasArms) {
//            this.arm.draw(ctx, x + this.armdx + 15, y + this.armdy + 43);
//        }
//    }
//}
//class Face {
//    id: number;
//    dx: number;
//    dy: number;
//    tex: Texture;
//    public Face(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Face/" + id + ".img/";
//        this.tex = new Texture(path + "default.face.png");
//        var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => { });
//        this.dx = parseInt(xml._face.x.Value);
//        this.dy = parseInt(xml._face.y.Value);
//    }
//    Render(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.tex.draw(ctx, x + this.dx + 15, y + this.dy + 12, false);
//    }
//}
//class Gloves {
//    id: number;
//    leftdx: number; leftdy: number;
//    rightdx: number;
//    rightdy: number;
//    lGlove: Texture;
//    rGlove: Texture;
//    hasLeftGlove: boolean;
//    hasRightGlove: boolean;
//    public Gloves(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Glove/" + id + ".img/";
//        var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => { });
//        if (File.Exists(path + "stand1.0.lGlove.png")) {
//            hasLeftGlove = true;
//            lGlove = new Texture(path + "stand1.0.lGlove.png");
//            leftdx = parseInt(xml._lGlove.stand1.x.Value);
//            leftdy = parseInt(xml._lGlove.stand1.y.Value);
//        }
//        if (File.Exists(path + "stand1.0.rGlove.png")) {
//            hasRightGlove = true;
//            rGlove = new Texture(path + "stand1.0.rGlove.png");
//            rightdx = parseInt(xml._rGlove.stand1.x.Value);
//            rightdy = parseInt(xml._rGlove.stand1.y.Value);
//        }
//    }
//    RenderLeft(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        if (this.hasLeftGlove) {
//            this.lGlove.draw(ctx, x + this.leftdx + 15, y + this.leftdy + 43, false);
//        }
//    }
//    RenderRight(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        if (this.hasRightGlove) {
//            this.rGlove.draw(ctx, x + this.rightdx + 15, y + this.rightdy + 43, false);
//        }
//    }
//}
//class Hair {
//    id: number;
//		public readonly int frontdx, frontdy, fronthatdx, fronthatdy, backdx, backdy;
//		public readonly Image back, front, frontHat;
//		public readonly bool hasBack = false;
//		public readonly bool hatChanges = false;
//    public Hair(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Hair/" + id + ".img/";
//        var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => { });
//        if (File.Exists(this.ms.http.baseUrl + "/Hair/" + id + ".img/default.hairBelowBody.png")) {
//            back = new Texture(this.ms.http.baseUrl + "/Hair/" + id + ".img/default.hairBelowBody.png");
//            backdx = parseInt(xml._hairBelowBody.x.Value);
//            backdy = parseInt(xml._hairBelowBody.y.Value);
//            hasBack = true;
//        }
//        hatChanges = File.Exists(path + "/default.hair.png") && File.Exists(path + "/default.hairOverHead.png");
//        if (hatChanges) {
//            frontHat = new Texture(path + "default.hair.png");
//            fronthatdx = parseInt(xml._hair.x.Value);
//            fronthatdy = parseInt(xml._hair.y.Value);
//        }
//        if (File.Exists(path + "/default.hairOverHead.png")) {
//            front = new Texture(path + "default.hairOverHead.png");
//            frontdx = parseInt(xml._hairOverHead.x.Value);
//            frontdy = parseInt(xml._hairOverHead.y.Value);
//        } else {
//            front = new Texture(path + "default.hair.png");
//            frontdx = parseInt(xml._hair.x.Value);
//            frontdy = parseInt(xml._hair.y.Value);
//        }
//    }
//    RenderBack(Character chr, ctx: CanvasRenderingContext2D, x: number, y: number) {
//        if (hasBack) {
//            this.tex.draw(back, x + backdx + 15, y + backdy + 12);
//        }
//    }
//    RenderFront(Character chr, ctx: CanvasRenderingContext2D, x: number, y: number) {
//        if (chr.hat > 0 && hatChanges) {
//            this.tex.draw(frontHat, x + fronthatdx + 15, y + fronthatdy + 12);
//        } else {
//            this.tex.draw(front, x + frontdx + 15, y + frontdy + 12);
//        }
//    }
//}
//class Hat {
//    id: number;
//		public readonly int topdx, topdy, backdx, backdy;
//		public readonly Image top, back;
//		public readonly bool hasBack;
//		public readonly bool isError;
//    public Hat(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Cap/" + id + ".img/";
//        try {
//            top = new Texture(path + "default.default.png");
//            var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => { });
//            if (File.Exists(path + "default.defaultAc.png")) {
//                hasBack = true;
//                back = new Texture(path + "default.defaultAc.png");
//                try {
//                    backdx = parseInt(xml._defaultAc.x.Value);
//                    backdy = parseInt(xml._defaultAc.y.Value);
//                } catch (Exception e) {
//                    // some items is AC instead
//                    // silly nexon not being consistent
//                    backdx = parseInt(xml._defaultAC.x.Value);
//                    backdy = parseInt(xml._defaultAC.y.Value);
//                }
//            }
//            topdx = parseInt(xml._default.x.Value);
//            topdy = parseInt(xml._default.y.Value);
//        } catch (FileNotFoundException e) {
//            isError = true;
//            Console.WriteLine("File not found: " + e.FileName);
//        }
//    }
//    RenderTop(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        if (isError) return;
//        this.tex.draw(top, x + topdx + 15, y + topdy + 12);
//    }
//    RenderBack(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        if (isError) return;
//        if (hasBack) {
//            this.tex.draw(back, x + backdx + 15, y + backdy + 12);
//        }
//    }
//}
//class Skin {
//    public int id;
//		public Image head, body, arm;
//    public Skin(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Skin/" + id + ".img/";
//        head = new Texture(path + "front.head.png");
//        body = new Texture(path + "stand1.0.body.png");
//        arm = new Texture(path + "stand1.0.arm.png");
//    }
//    RenderBody(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.tex.draw(body, x + 7, y + head.Height - 2);
//    }
//    RenderHead(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.tex.draw(head, x, y);
//    }
//    RenderArm(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.tex.draw(arm, x + body.Width + 2, y + head.Height);
//    }
//}
//class Shoes {
//    id: number;
//    dx: number;
//    dy: number;
//    tex: Texture;
//    z: number;
//    public Shoes(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Shoes/" + id + ".img/";
//        var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => { });
//        this.tex = new Texture(path + "stand1.0.shoes.png");
//        this.dx = parseInt(xml._shoes.stand1.x.Value);
//        this.dy = parseInt(xml._shoes.stand1.y.Value);
//        z = xml._info.z.value.Value == "shoesOverPants" ? 1 : 0;
//    }
//    Render(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.tex.draw(ctx, x + dx + 15, y + dy + 43);
//    }
//}
//class Pants {
//    id: number;
//    dx: number;
//    dy: number;
//    tex: Texture;
//    public Pants(id: number) {
//        this.id = id;
//        var path = this.ms.http.baseUrl + "/Pants/" + id + ".img/";
//        this.tex = new Texture(path + "stand1.0.pants.png");
//        var instance = this; this.ms.http.getJsonPropertyForPath(path, (data) => { });
//        this.dx = parseInt(xml._pants.stand1.x.Value);
//        this.dy = parseInt(xml._pants.stand1.y.Value);
//    }
//    Render(ctx: CanvasRenderingContext2D, x: number, y: number) {
//        this.tex.draw(ctx, x + dx + 15, y + dy + 43);
//    }
//}
//if (hat > 0)
//    Cache.GetHat(hat).RenderBack(g, x, y);
//if (hair > 0)
//    Cache.GetHair(hair).RenderBack(this, g, x, y);
//if (skin > 0)
//    Cache.GetSkin(skin).RenderBody(g, x, y);
//if (shoes > 0 && Cache.GetShoes(shoes).z == 0)
//    Cache.GetShoes(shoes).Render(g, x, y);
//if (pants > 0)
//    Cache.GetPants(pants).Render(g, x, y);
//if (shoes > 0 && Cache.GetShoes(shoes).z == 1)
//    Cache.GetShoes(shoes).Render(g, x, y);
//if (coat > 0)
//    Cache.GetCoat(coat).RenderBody(g, x, y);
//if (skin > 0)
//    Cache.GetSkin(skin).RenderHead(g, x, y);
//if (skin > 0)
//    Cache.GetSkin(skin).RenderArm(g, x, y);
//if (coat > 0)
//    Cache.GetCoat(coat).RenderArm(g, x, y);
//if (glove > 0)
//    Cache.GetGloves(glove).RenderLeft(g, x, y);
//if (glove > 0)
//    Cache.GetGloves(glove).RenderRight(g, x, y);
//if (accface > 0 && Cache.GetAccFace(accface).z == 0)
//    Cache.GetAccFace(accface).Render(g, x, y);
//if (face > 0)
//    Cache.GetFace(face).Render(g, x, y);
//if (accface > 0 && Cache.GetAccFace(accface).z == 1)
//    Cache.GetAccFace(accface).Render(g, x, y);
//if (acceye > 0)
//    Cache.GetAccFace(acceye).Render(g, x, y);
//if (hair > 0)
//    Cache.GetHair(hair).RenderFront(this, g, x, y);
//if (hat > 0)
//    Cache.GetHat(hat).RenderTop(g, x, y); 
