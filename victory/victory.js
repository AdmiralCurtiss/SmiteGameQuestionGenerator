function animate(selector, hue) {
    var $canvas = $(selector);
    var width = $canvas.innerWidth();
    var height = $canvas.innerHeight();

    var fireworksFactory = function fireworksFactory() {
        var centerX = (0.2 + 0.6 * Math.random()) * width;
        var centerY = (0.1 + 0.4 * Math.random()) * height;
		
		var saturationPct = (80+20*Math.random()).toFixed(1);
		var lightnessPct = (40+40*Math.random()).toFixed(1);
		var color = 'hsl('+hue+','+saturationPct+'%,'+lightnessPct+'%)';
		
        return new Firework(centerX, centerY, color);
    };

    var fireworks = [fireworksFactory()];
    var animation = new Animation($canvas, fireworks, fireworksFactory);
    animation.start();
    return animation;
}

//////////////////////////////////////////////////////////////////////

function Animation($canvas, objects, factory) {
    this.canvas = $canvas.get(0);
    this.canvasContext = this.canvas.getContext('2d');
    this.objects = objects;
    this.factory = factory;
}

Animation.prototype.start = function start() {
    var canvas = this.canvas;
    var context = this.canvasContext;
    var objects = this.objects;
    var factory = this.factory;

    var redraw = function redraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var f = objects.length - 1; f >= 0; f--) {
            var particles = objects[f].particles;
            for (var p = particles.length - 1; p >= 0; p--) {
                var particle = particles[p];
                context.beginPath();
                context.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI, false);
                context.fillStyle = particle.color;
                context.fill();
            }
            objects[f].update();
        }
    };

    var launch = function launch() {
        objects.push(factory());
        while (objects.length > 4) {
            objects.shift();
        }
    };

    this.redrawInterval = setInterval(redraw, 25 /* ms */);
    this.factoryInterval = setInterval(launch, 1500 /* ms */);
}

Animation.prototype.stop = function stop() {
    clearInterval(this.redrawInterval);
    clearInterval(this.factoryInterval);
}

Animation.prototype.stopLaunch = function stopLaunch() {
    clearInterval(this.factoryInterval);
}

//////////////////////////////////////////////////////////////////////

function Firework(centerX, centerY, color) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.color = color;
    this.particles = new Array(500);
    this.Δr = 20;
    this.age = 0;

    var τ = 2 * Math.PI;
    for (var i = 0; i < this.particles.length; i++) {
        this.particles[i] = new Particle(
            this.centerX, this.centerY,
            /* r= */ 0, /* θ= */ τ * Math.random(), /* φ= */ τ * Math.random(),
            /* size= */ 2, color
        );
    }
}

Firework.prototype.update = function update() {
    for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].r += this.Δr;
        this.particles[i].recalcCartesianProjection();

        this.Δr -= 0.00005 * this.Δr * this.Δr;                     // Air resist
        this.particles[i].y += 0.00000008 * this.age * this.age;   // Gravity
        this.particles[i].size *= 0.98;                            // Fade
        this.age++;
    }
};

//////////////////////////////////////////////////////////////////////

function Particle(x, y, r, θ, φ, size, color) {
    this.origX = x;
    this.origY = y;
    this.r = r;
    this.sinθ = Math.sin(θ);
    // this.cosθ = Math.cos(θ);         // Not needed
    this.sinφ = Math.sin(φ);
    this.cosφ = Math.cos(φ);
    this.size = size;
    this.color = color;
    this.recalcCartesianProjection();
}

Particle.prototype.recalcCartesianProjection = function() {
    this.x = this.origX + this.r * this.sinθ * this.cosφ;
    this.y = this.origY + this.r * this.sinθ * this.sinφ;
};