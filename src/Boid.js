var ff;
(function (ff) {
    var Boid = (function () {
        function Boid(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.position = new Vec2();
            var texture = PIXI.Texture.fromImage('img/entity.png');

            this.sprite = new PIXI.Sprite(texture);

            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;

            this.sprite.position = this.position.reset(x, y);

            Kai.stage.addChild(this.sprite);
        }
        Boid.prototype.update = function () {
        };
        return Boid;
    })();
    ff.Boid = Boid;
})(ff || (ff = {}));
