var snake = (function () {
    "use strict";
    var FOOD_NUM = 3;
    var SIZE = 10;
    var X_MAX = 30;
    var Y_MAX = 20;
    var COLOR = "#33C";
    var FOOD_COLOR = "#d05257";
    var TEXT_COLOR = "#46619F";
    var TURN_SPEED = 120  ; // ms
    var UP = 38;
    var DOWN = 40;
    var LEFT = 37;
    var RIGHT = 39;

    var canvas;
    var pen;
    var key;
    var body;
    var foods;
    // 点的构造器
    var Point = function (x, y) {
        this.x = x;
        this.y = y;
    };

    // 随机生成一个点
    Point.random = function () {
        var x = Math.round(Math.random() * (X_MAX - 2));
        var y = Math.round(Math.random() * (Y_MAX - 2));
        return new Point(x, y);
    };

    Point.prototype.copy = function () {
        return new Point(this.x, this.y);
    };

    //判断点的下一个位置
    Point.prototype.next = function (key) {
        var point = this.copy();
        if (key == UP) {
            point.y--;
        }
        else if (key == DOWN) {
            point.y++;
        }
        else if (key == LEFT) {
            point.x--;
        }
        else if (key == RIGHT) {
            point.x++;
        }
        return point;
    };
    // 处理响应键盘事件
    function key_handler(event) {
        event.preventDefault();
        var new_key = event.keyCode;
        if (key == UP && new_key == DOWN) {
            new_key = key;
        }
        else if (key == DOWN && new_key == UP) {
            new_key = key;
        }
        else if (key == LEFT && new_key == RIGHT) {
            new_key = key;
        }
        else if (key == RIGHT && new_key == LEFT) {
            new_key = key;
        }
        key = new_key;
    }

    // 初始化状态变量
    function init() {
        canvas = document.getElementById("game");
        pen = canvas.getContext("2d");
        key = undefined;
        body = [];
        foods = [];
        body.push(Point.random());
        for (var i = 0; i < FOOD_NUM; i++) {
            foods.push(Point.random());
        }
        $(document).unbind("keydown");
        $(document).keydown(key_handler);
    }

    function make_new_food() {
        var new_food = Point.random();
        var i;
        var cell;
        for (i=0; i<body.length;i++) {
            cell = body[i];
            if (new_food.x == cell.x && new_food.y == cell.y) {
                return make_new_food();
            }
        }
        for (i=0; i<foods.length;i++) {
            var food = foods[i];
            if (new_food.x == food.x && new_food.y == food.y) {
                return make_new_food();
            }
        }
        return new_food;
    }

    function is_eat() {
        var next = body[0].next(key);
        for (var i=0; i<foods.length; i++) {
            var food = foods[i];
            if (next.x == food.x && next.y == food.y) {
                body.unshift(food.copy());
                foods[i] = make_new_food();
                return true;
            }
        }
        return false;
    }

    function is_crash() {
        for (var a=0; a<body.length; a++) {
            var cell = body[a];
            if (cell.x >= X_MAX || cell.y >= Y_MAX || cell.x < 0 || cell.y < 0) {
                return true;
            }
            for (var b=0; b<body.length; b++) {
                if (a != b) {
                    if (cell.x == body[b].x && cell.y == body[b].y) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function move() {
        var next_point = body[0].next(key);
        body.unshift(body.pop());
        body[0] = next_point;
    }

    // 清除画布
    function clear() {
        pen.clearRect(0, 0, canvas.width, canvas.height);
    }

    function draw_snake_cell(x, y) {
        pen.fillStyle = COLOR;
        pen.fillRect(x*SIZE, y*SIZE, SIZE, SIZE);
    }

    function draw_food(x, y) {
        pen.fillStyle = FOOD_COLOR;
        pen.fillRect(x*SIZE, y*SIZE, SIZE, SIZE);
    }

    //渲染画面
    function render() {
        clear();
        if (key == undefined) {
            pen.fillStyle = TEXT_COLOR;
            pen.font = "24px serif";
            pen.fillText("按方向键开始游戏", 10,70);
        }

        else {
            for (var i = 0; i < body.length; i++) {
                draw_snake_cell(body[i].x, body[i].y);
            }

            for (i = 0; i < foods.length; i++) {
                draw_food(foods[i].x, foods[i].y);
            }
        }
    }

    // 游戏主循环
    function loop() {
        if (!is_eat()) {
            move();
        }

        if (is_crash()) {
            death();
            return;
        }

        render();
        setTimeout(loop, TURN_SPEED);
    }

    // 开始进行游戏
    function start() {
        init();
        loop();
    }

    function death() {
        clear();
        pen.fillStyle = TEXT_COLOR;
        pen.font = "24px serif";
        pen.fillText("你己经死了!", 10, 40);
        pen.fillText("按方向键重新开始", 10,70);
        $(document).keydown(start);
    }

    return {
        start: start
    }
}());

