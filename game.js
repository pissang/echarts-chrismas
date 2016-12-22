(function () {

var gb = {
    targets: [],
    gameLoopHandle: null,
    gameStartTime: null,
    gameLastFrameTime: null,
    totalGameTime: 0,
    score: 0,
    level: 1,

    mapChart: null,
    pieChart: null,

    santa: {
        next: {
            domEle: null,
            x: 0, // from -180 to 180
            speed: 0.2, // horizontal distance each millisecond
        },
        running: []
    },

    shoot: {
        isTouching: false,
        touchStart: null
    },

    originSpotImg: null,
    hittedSpotImg: null,

    gameState: 0,

    stat: null,

    FRAME_RATE: 2,
    MAX_ORDER: 2000,
    MAX_SHOOT_TIME: 1, // seconds
    MAX_TIME: 1000 * 60 * 1, // 1 min

    MAX_LATITUDE: 90,
    MIN_LATITUDE: -60,
    MAX_LONGITUDE: 180,
    MIN_LONGITUDE: -180,

    GAME_STATES: {
        INIT: 0,
        IN_GAME: 1,
        GAME_OVER: 2
    },
    COLORS: {
        RED: '#49d088',
        GREEN: '#eb594b'
    },
    PATH: {
        SANTA: 'data:image/png;base64,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',
        GIFT: 'data:image/png;base64,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',
        SHOT: 'data:image/png;base64,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',
        SHOT_DOWN: 'data:image/png;base64,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'
    }
};

window.game = gb;

window.game.init = function (parentNode) {
    gb.parentNode = parentNode;
    var mapChartDom = document.createElement('div');
    mapChartDom.setAttribute('id', 'map-chart');
    parentNode.appendChild(mapChartDom);

    var pieChartDom = document.createElement('div');
    pieChartDom.setAttribute('id', 'pie-chart');
    parentNode.appendChild(pieChartDom);

    var controlDom = document.createElement('div');
    controlDom.setAttribute('id', 'control');
    parentNode.appendChild(controlDom);

    var santaImg = document.createElement('img');
    santaImg.setAttribute('src', gb.PATH.SANTA);
    santaImg.setAttribute('id', 'santa-img');
    controlDom.appendChild(santaImg);

    var shootDom = document.createElement('div');
    shootDom.setAttribute('id', 'shoot-position');
    controlDom.appendChild(shootDom);

    gb.santa.next.domEle = santaImg;

    initTextureImage();

    var mapOption = {
        backgroundColor: '#404a59',
        geo: {
            type: 'map',
            map: 'world-simp',
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#222'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            },
            left: 20,
            right: 20
        },
        series: [{
            type: 'scatter',
            data: [],
            name: '想要礼物的小朋友',
            itemStyle: {
                normal: {
                    color: gb.COLORS.GREEN
                }
            }
        }, {
            type: 'scatter',
            data: [],
            name: '收到礼物的小朋友',
            itemStyle: {
                normal: {
                    color: gb.COLORS.RED
                }
            }
        }],
        legend: {
            data: ['想要礼物的小朋友', '收到礼物的小朋友'],
            textStyle: {
                color: function () {}
            },
            top: 20,
            silent: true
        },
        tooltip: {
            show: true
        },
        grid: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 1,
            data: [''],
            show: false
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1,
            show: false
        },
        singleAxis: [{
            top: '20%',
            bottom: 50,
            type: 'value',
            min: -180,
            max: 180,
            interval: 45,
            axisLabel: {
                textStyle: {
                    color: 'rgba(200, 200, 200, 0.5)'
                },
                formatter: function (v) {
                    return v + '°';
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(150, 150, 150, 0.2)',
                    width: 2
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(150, 150, 150, 0.4)'
                }
            }
        }]
    };
    gb.mapChart = echarts.init(document.getElementById('map-chart'), null, {
        // devicePixelRatio: 1
    });
    gb.mapChart.setOption(mapOption);

    var pieOption = {
        series: [{
            type: 'pie',
            radius: ['40%', '75%'],
            center: ['30%', '50%'],
            color: [gb.COLORS.GREEN, gb.COLORS.RED],
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 1,
                name: '想要礼物的小朋友'
            }, {
                value: 0,
                name: '收到礼物的小朋友'
            }],
            itemStyle: {
                normal: {
                    opacity: 0.9
                }
            },
            silent: true
        }, {
            type: 'pie',
            radius: ['80%', '86%'],
            center: ['30%', '50%'],
            color: [gb.COLORS.GREEN, 'transparent'],
            label: {
                normal: {
                    show: false
                }
            },
            data: [1, {
                value: 0,
                itemStyle: {
                    normal: {
                        color: 'transparent'
                    }
                }
            }]
        }],
        visualMap: {
            type: 'continuous',
            seriesIndex: 1,
            inRange: {
                color: [gb.COLORS.GREEN, gb.COLORS.RED]
            },
            min: 0,
            max: 1,
            show: false
        },
        title: {
            text: '礼物\n准备中',
            left: '30%',
            top: 'center',
            textAlign: 'center',
            padding: 0,
            textStyle: {
                fontSize: 20,
                color: gb.COLORS.GREEN,
            }
        },
        graphic: {
            elements: [{
                type: 'image',
                left: '65%',
                top: '28%',
                style: {
                    image: gb.PATH.SHOT
                },
                onmousedown: function () {
                    if (gb.gameState !== gb.GAME_STATES.IN_GAME) {
                        return;
                    }

                    gb.shoot.isTouching = true;
                    gb.shoot.touchStart = new Date();
                    gb.pieChart.setOption({
                        graphic: {
                            elements: [{
                                style: {
                                    image: gb.PATH.SHOT_DOWN
                                }
                            }]
                        }
                    });
                    document.getElementById('shoot-position').style.display
                        = 'block';
                },
                onmouseup: function () {
                    if (gb.gameState !== gb.GAME_STATES.IN_GAME) {
                        return;
                    }

                    shoot();
                    gb.shoot.isTouching = false;
                    gb.pieChart.setOption({
                        graphic: {
                            elements: [{
                                style: {
                                    image: gb.PATH.SHOT
                                }
                            }]
                        }
                    });
                    document.getElementById('shoot-position').style.display
                        = 'none';
                }
            }]
        }
    };
    gb.pieChart = echarts.init(document.getElementById('pie-chart'));
    gb.pieChart.setOption(pieOption);

    // gb.stat = new Stats();
    // gb.stat.showPanel(0);
    // document.body.appendChild(gb.stat.dom);

    start();
};

gb.dispose = function () {
    stop();

    if (gb.mapChart) {
        gb.mapChart.dispose();
    }
    if (gb.pieChart) {
        gb.pieChart.dispose();
    }

    if (gb.parentNode) {
        var children = gb.parentNode.childNodes;
        while (children.length > 0) {
            var groundChildren = children[0].childNodes;
            while (groundChildren.length > 0) {
                children[0].removeChild(children[0].childNodes[0]);
            }
            gb.parentNode.removeChild(children[0]);
        }
    }
};

function start() {
    gb.gameState = gb.GAME_STATES.IN_GAME;
    gb.gameStartTime = new Date();
    gb.totalGameTime = gb.MAX_TIME;
    gb.score = 0;
    gb.level = 1;

    gb.targets = [];

    var zr = gb.mapChart.getZr();
    zr.animation.on('frame', function (dt) {
        if (gb.gameState === gb.GAME_STATES.IN_GAME) {
            updateChart(zr, dt);
        }
    });

    tick();
}
window.game.restart = start;

var lastUpdateDataTime = null;
function tick() {
    if (gb.gameState !== gb.GAME_STATES.IN_GAME) {
        return;
    }

    // gb.stat.begin();

    var now = new Date();
    var dt = gb.gameLastFrameTime ? now - gb.gameLastFrameTime : 0;

    if (!lastUpdateDataTime || now - lastUpdateDataTime > 1000) {
        // update pie chart
        var hittedCnt = 0;
        var unhittedCnt = 0;
        for (var i = 0; i < gb.targets.length; ++i) {
            if (gb.targets[i].hasHit) {
                hittedCnt += gb.targets[i].data.value[2];
            }
            else {
                unhittedCnt += gb.targets[i].data.value[2];
            }
        }
        var title = '';
        if (unhittedCnt === 0 && hittedCnt === 0) {
            unhittedCnt = 1;
            title = '礼物\n准备中';
        }
        else {
            title = Math.ceil(hittedCnt / (hittedCnt + unhittedCnt) * 100)
                + '%';
        }

        var runTime = now - gb.gameStartTime;
        var leftTime = gb.totalGameTime - runTime;
        var timeRatio = Math.min(leftTime / gb.MAX_TIME, 1);

        if (leftTime <= 0) {
            gameOver();
        }

        gb.pieChart.setOption({
            series: [{
                data: [unhittedCnt, hittedCnt]
            }, {
                data: [
                    timeRatio,
                    {
                        value: 1 - timeRatio,
                        itemStyle: {
                            normal: {
                                opacity: 0
                            }
                        }
                    }
                ]
            }],
            title: {
                text: title
            }
        });

        lastUpdateDataTime = now;
    }

    if (gb.shoot.isTouching) {
        var height = (now - gb.shoot.touchStart) / 1000
            / gb.MAX_SHOOT_TIME * 100 + '%';
        document.getElementById('shoot-position').style.height = height;
    }

    updateSanta(dt);

    // gb.stat.end();
    gb.gameLastFrameTime = now;

    gb.gameLoopHandle = requestAnimationFrame(tick);
}

function initTextureImage() {
    gb.originSpotImg = document.createElement('canvas');
    gb.originSpotImg.width = gb.originSpotImg.height = 50;
    var circleCtx = gb.originSpotImg.getContext('2d');
    circleCtx.beginPath();
    circleCtx.arc(25, 25, 15, 0, Math.PI * 2);
    circleCtx.shadowColor = gb.COLORS.GREEN;
    circleCtx.shadowBlur = 15;
    circleCtx.fillStyle = gb.COLORS.GREEN;
    circleCtx.fill();

    gb.hittedSpotImg = document.createElement('canvas');
    gb.hittedSpotImg.width = gb.hittedSpotImg.height = 50;
    circleCtx = gb.hittedSpotImg.getContext('2d');
    circleCtx.beginPath();
    circleCtx.arc(25, 25, 15, 0, Math.PI * 2);
    circleCtx.shadowColor = gb.COLORS.RED;
    circleCtx.shadowBlur = 15;
    circleCtx.fillStyle = gb.COLORS.RED;
    circleCtx.fill();
}

var updateChartLoops = 0;
function updateChart(zr, dt) {
    if (Math.random() < 0.02) {
        spawn();
        // Create element
        for (var i = 0; i < gb.targets.length; ++i) {
            if (!gb.targets[i].element) {
                var pos = gb.mapChart.convertToPixel('geo',
                    gb.targets[i].data.value);
                var el = gb.targets[i].element = new echarts.graphic.Image({
                    style: {
                        x: -gb.originSpotImg.width / 2,
                        y: -gb.originSpotImg.height / 2,
                        image: gb.targets[i].hasHit ? gb.hittedSpotImg
                            : gb.originSpotImg,
                        opacity: 0.6
                    },
                    scale: [0.01, 0.01],
                    position: pos,
                    zlevel: 1
                });
                zr.add(gb.targets[i].element);

                var r = gb.targets[i].data.value[2] * 0.02;
                el.animateTo({
                    scale: [r, r]
                }, 2000 * Math.random(), 1000, 'elasticOut');
            }
        }
    }

    var len = gb.targets.length;
    // Update targets
    for (var i = 0; i < len;) {
        gb.targets[i].life -= dt;
        // die
        if (gb.targets[i].life <= 0) {
            // Remove element
            if (gb.targets[i].element) {
                zr.remove(gb.targets[i].element);
            }
            // Move the last to current position.
            var last = gb.targets.pop();
            if (last !== gb.targets[i]) {
                gb.targets[i] = last;
            }

            len--;
        }
        else {
            i++;
        }
    }
}

function spawn() {
    var coordSys = gb.mapChart.getModel().getComponent('geo').coordinateSystem;
    var regionCnt = Math.min(Math.floor(gb.level / 10) + 1, 5);
    var maxLife = gb.level > 10 ? 8000 : 20000;

    for (var i = 0; i < regionCnt; ++i) {
        // choose a region
        var rid = Math.floor(Math.random() * coordSys.regions.length);
        var region = coordSys.regions[rid];

        // add data at random number
        var rect = region.getBoundingRect();
        var maxCnt = rect.width * rect.height / 100;
        var cnt = Math.min(Math.floor((Math.random() * 0.8 + 0.2) * maxCnt),
            8) + 1;
        for (var j = 0; j < cnt; ++j) {
            var coord = [Infinity, Infinity];
            while (!region.contain(coord)) {
                coord[0] = rect.x + Math.random() * rect.width;
                coord[1] = rect.y + Math.random() * rect.height;
            }
            coord[2] = Math.random() * 25;
            gb.targets.push({
                data: {
                    value: coord,
                    name: Math.random() + ''
                },
                life: maxLife, // milliseconds
                hasHit: false
            });
        }
    }
}

function updateSanta(dt) {
    if (gb.shoot.isTouching) {
        return;
    }

    gb.santa.next.x += gb.santa.next.speed * dt;

    if (gb.santa.next.x > gb.MAX_LONGITUDE) {
        gb.santa.next.x = gb.MAX_LONGITUDE;
        gb.santa.next.speed *= -1; // move left
    }
    else if (gb.santa.next.x < gb.MIN_LONGITUDE) {
        gb.santa.next.x = gb.MIN_LONGITUDE;
        gb.santa.next.speed *= -1; // move right
    }

    var left = (gb.santa.next.x - gb.MIN_LONGITUDE) / (gb.MAX_LONGITUDE
        - gb.MIN_LONGITUDE);

    var transform = 'translate3d(' + Math.round((left - 0.5)
        * (gb.mapChart.getWidth() - 40)) + 'px, 0, 0)';
    gb.santa.next.domEle.style.transform = transform;
    gb.santa.next.domEle.style.WebkitTransform = transform;
}

function gameOver() {
    gb.gameState = gb.GAME_STATES.GAME_OVER;

    if (gb.gameOver) {
        gb.gameOver();
    }
    stop();
}

function stop() {
    gb.gameState = gb.GAME_STATES.GAME_OVER;

    if (gb.gameLoopHandle) {
        cancelAnimationFrame(gb.gameLoopHandle);
        gb.gameLoopHandle = null;
    }
}

function shoot() {
    var parent = document.getElementById('control');
    var totalWidth = parent.offsetWidth - gb.santa.next.domEle.offsetWidth;
    var longitude = gb.santa.next.x;

    var distance = Math.max(0.1, Math.min((new Date() - gb.shoot.touchStart)
        / 1000 / gb.MAX_SHOOT_TIME, 1));
    var latitude = gb.MIN_LATITUDE + distance * (gb.MAX_LATITUDE
        - gb.MIN_LATITUDE);
    var topPercent = (1 - distance) * 100 + '%';

    // create santa and add to dom
    var dom = document.createElement('img');
    dom.className = 'gift';
    dom.setAttribute('src', gb.PATH.GIFT);
    // dom.style.top = topPercent;
    var left = (gb.santa.next.x - gb.MIN_LONGITUDE) / (gb.MAX_LONGITUDE
        - gb.MIN_LONGITUDE);
    var transform = 'translate3d(' + Math.round(left * (gb.mapChart.getWidth()
        - 100)) + 'px, 0, 0)';
    dom.style.transform = dom.style.WebkitTransform = transform;
    parent.appendChild(dom);

    var xt = Math.round(left * (gb.mapChart.getWidth() - 80)) + 20;
    var yt = parent.offsetHeight * (1 - distance);
    var imgPos = {
        x: xt,
        y: parent.offsetHeight,
        scale: 1,
        rotation: 0,
        opacity: 1
    };
    var zr = gb.pieChart.getZr();
    var animator = zr.animation.animate(imgPos)
        .when(400, {
            x: xt + 20,
            scale: 3,
            rotation: 180
        })
        .when(1000, {
            x: xt,
            y: yt,
            scale: Math.random() * 0.25 + 0.75,
            rotation: -720 - 15 + Math.random() * 30
        })
        .when(3000, {
            opacity: 1
        })
        .when(4000, {
            opacity: 0
        })
        .during(function () {
            var transform = 'translate3d(' + imgPos.x + 'px, ' + imgPos.y
                + 'px, 0) rotate(' + imgPos.rotation + 'deg)';
            dom.style.transform = transform;
            dom.style.WebkitTransform = transform;
            dom.style.width = imgPos.scale * 32 + 'px';
            dom.style.opacity = imgPos.opacity;
        })
        .start('cubicOut');
    zr.animation.addAnimator(animator);

    gb.santa.running.push({
        longitude: longitude,
        domEle: dom
    });

    // check nearby targets and change color to red
    var hitCnt = 0;
    for (var i = 0; i < gb.targets.length; ++i) {
        var pos = gb.targets[i].data.value;
        var d = (pos[0] - longitude) * (pos[0] - longitude)
            + (pos[1] - latitude) * (pos[1] - latitude);
        if (d < 500) {
            (function (i) {
                setTimeout(function () {
                    if (gb.targets[i]) {
                        gb.targets[i].hasHit = true;
                        gb.targets[i].data.itemStyle = {
                            normal: {
                                color: gb.COLORS.RED,
                                shadowColor: gb.COLORS.RED,
                                opacity: d < 100 ? 0.9 : 0.5
                            }
                        };
                        gb.targets[i].element.setStyle({
                            image: gb.hittedSpotImg
                        });
                    }
                }, 1000);
            })(i);
            ++hitCnt;
            ++gb.score;
        }
    }
    if (hitCnt > 0) {
        ++gb.level;
        gb.totalGameTime += Math.max(hitCnt * 2000 / Math.sqrt(gb.level), 1000);
    }

    setTimeout(function () {
        parent.removeChild(dom);
    }, 4000);
}

})();
