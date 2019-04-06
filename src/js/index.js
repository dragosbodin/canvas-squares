var canvasSquares = (function() {
	var canvas,
		ctx,
		squares = [],
		squareGrid = 49;

	var Mouse = function(el) {
		this.el = el || document.getElementById('squares');
		this.x = 0;
		this.y = 0;

		function setMouseCoordinates(e) {
			e.preventDefault();
			var x = e.pageX,
				y = e.pageY;
			this.x = x;
			this.y = y
		}

		var events = 'mousernter mousemove touchstart touchenter touchmove';
		events.split(' ').forEach(function(eventName) {
			this.el.addEventListener(eventName, setMouseCoordinates.bind(this))
		});

		return this
	}();

	function Square(square) {
		this.x = square.x | 0;
		this.y = square.y | 0;
		this.hover = square.hover | false;
		this.mouseleave = square.mouseleave | false;
		this.alpha = square.alpha | 0;

		this.draw = function() {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
			if (this.hover) {
				ctx.fillStyle = 'rgba(255, 255, 255, 1)';
			} else if (this.mouseleave) {
				ctx.fillStyle = 'rgba(255, 255, 255, ' + this.fadeOut(this.alpha) + ')';
			} else {
				ctx.fillStyle = 'rgba(255, 255, 255, 0)';
			}
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(squareGrid, 0);
			ctx.lineTo(squareGrid, squareGrid);
			ctx.lineTo(0, squareGrid);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			ctx.restore()
		};

		this.fadeOut = function(alpha) {
			if (alpha > 0) {
				this.alpha = alpha -.02;

				return alpha
			} else {
				this.mouseleave = false;
				this.alpha = 0;

				return 0
			}
		}
	}

	function createSquares() {
		squares = [];
		var gridRows = canvas.width / squareGrid,
			gridColumns = canvas.height / squareGrid;
		for (var x = 0; x < gridRows; x++) {
			for (var y = 0; y < gridColumns; y++) {
				squares.push(new Square({
					x: x * squareGrid,
					y: y * squareGrid,
					hover: false,
					mouseleave: false
				}))
			}
		}
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		[].forEach.call(squares, function(square) {
			if (Mouse.x > square.x && Mouse.x <= square.x + squareGrid &&
				Mouse.y > square.y && Mouse.y <= square.y + squareGrid) {
				square.hover = true;
			} else {
				if (square.hover) {
					square.hover = false;
					square.mouseleave = true;
					square.alpha = 1;
				}
			}
			square.draw()
		});
	}

	function animate() {
		render();
		window.requestAnimationFrame(animate)
	}

	function resize() {
		canvas.width = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
		canvas.height = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
		createSquares()
	}

	function init() {
		canvas = document.getElementById('squares');
		ctx = canvas.getContext('2d');
		resize();
		animate();
		window.addEventListener('resize', resize, false);
		window.addEventListener('orientationchange', resize, false);
	}
	init();
})();
