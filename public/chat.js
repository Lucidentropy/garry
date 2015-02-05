
    var socket = io.connect(window.location);

    socket.on('connect', function () {
        pucky.socketid = this.socket.sessionid;
        $('#socketid').val(pucky.socketid);
    });

    socket.on('disconnect', function () {
        $('#waiting').fadeIn();
    });

    // receive
    socket.on('move', function(data) {
        $('#waiting').fadeOut();

        $("#arAlphaLabel").html("arA: " + data.arAlpha);
        $("#arBetaLabel").html("arB: " + data.arBeta);
        $("#arGammaLabel").html("arG: " + data.arGamma);
        $("#alphalabel").html("Alpha: " + data.alpha);
        $("#betalabel").html("Beta: " + data.beta);
        $("#gammalabel").html("Gamma: " + data.gamma);

        data.beta = data.beta + 90 * -1; // orient graphic -90 degrees since screens are upright and phone would be flat on a table
        data.gamma = 360 - data.gamma;  // Reverse x input

        $('#examplephone').css('transform', 'rotateX(' +data.beta + 'deg) rotateY(' +data.gamma+ 'deg)');//' rotateZ(' +data.alpha+ 'deg)');

    });

    // Init
    $(function(){
        pucky.init();
    });

    var pucky = {
        el : '',            // Set by create method
        socketid : '',      // used to identify a client by their socket session id
        tolerance : 0.5,    // used to help reduce jitters
        storedX : 0,        // used for directional calc
        storedY : 0,        // used for directional calc
        arrows : {          // debug ascii arrows for each direction pair
            top : {
                left : '&#8598;',
                center : '&#8593;',
                right : '&#8599;'
            },
            center : {
                left : '&#8592;',
                center : '&#149;',
                right : '&#8594;'
            },
            bottom : {
                left : '&#8601;',
                center : '&#8595;',
                right : '&#8600;'
            }
        },
        init : function(){

            // Position Variables
            var x = 0, y = 0, z = 0;
            // Speed - Velocity
            var vx = 0, vy = 0, vz = 0;
            // Acceleration
            var ax = 0, ay = 0, az = 0, ai = 0, arAlpha = 0, arBeta = 0, arGamma = 0;

            var delay = 100, vMultiplier = 0.01;
            var alpha = 0, beta = 0, gamma = 0;

            if (window.DeviceMotionEvent==undefined) {
                $("no").style.display="block";
                $("yes").style.display="none";
            }
            else {
                window.ondevicemotion = function(event) {
                    ax = Math.round(Math.abs(event.accelerationIncludingGravity.x * 1));
                    ay = Math.round(Math.abs(event.accelerationIncludingGravity.y * 1));
                    az = Math.round(Math.abs(event.accelerationIncludingGravity.z * 1));
                    ai = Math.round(event.interval * 100) / 100;

                    rR = event.rotationRate;
                    if (rR != null) {
                        arAlpha = Math.round(rR.alpha);
                        arBeta = Math.round(rR.beta);
                        arGamma = Math.round(rR.gamma);
                    }
                }

                window.ondeviceorientation = function(event) {
                    alpha = Math.round(event.alpha);
                    beta = Math.round(event.beta);
                    gamma = Math.round(event.gamma);
                }

                setInterval(function() {
                    pucky.broadcast(alpha, gamma, beta, arAlpha, arBeta, arGamma)
                }, delay);
            }
        },
        broadcast : function(alpha, gamma, beta, arAlpha, arBeta, arGamma){

            var sensordata = {
                socketid : pucky.socketid,
                alpha : alpha,
                gamma : gamma,
                beta : beta,
                arBeta : arBeta,
                arGamma : arGamma,
                arAlpha : arAlpha
            };

            if ( sensordata.socketid && $('#go').is(':checked')) socket.emit('move', sensordata)
        }
    }