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
    MAX_TIME: 1000 * 30, // 30s

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
        SHOOT: 'data:image/png;base64,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',
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

    var shootImg = document.createElement('img');
    shootImg.setAttribute('src', gb.PATH.SHOOT);
    shootImg.setAttribute('id', 'shoot-img');
    controlDom.appendChild(shootImg);

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
                color: function () {},
                fontWeight: 'bold',
                itemGap: 15
            },
            orient: 'vertical',
            // align: 'right',
            right: 20,
            top: 20,
            silent: true
        },
        tooltip: {
            show: true
        },
        grid: {
            top: 50,
            bottom: 50,
            left: '5%',
            right: '5%'
        },
        xAxis: {
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
                    color: 'rgba(150, 150, 150, 0.2)',
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'value',
            show: false
        }
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
                top: '25%',
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
                    var shootStyle = document.getElementById('shoot-img').style;
                    var transform = gb.santa.next.domEle.style.transform;
                    shootStyle.display = 'block';
                    shootStyle.transform = transform;
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
                    document.getElementById('shoot-img').style.display
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
        document.getElementById('shoot-img').style.bottom = height;
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

    var now = new Date();
    var distance = Math.max(0.1, Math.min((now - gb.shoot.touchStart)
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
        gb.totalGameTime += Math.max(hitCnt * hitCnt * 100, 2000);
        gb.totalGameTime = Math.min(gb.totalGameTime, now - gb.gameStartTime
            + gb.MAX_TIME);
    }

    setTimeout(function () {
        parent.removeChild(dom);
    }, 4000);
}

})();
