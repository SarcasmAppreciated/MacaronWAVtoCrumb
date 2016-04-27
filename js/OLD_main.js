$(document).ready(function(){
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();    
    var audio = document.getElementById("myAudio");
    var source = audioCtx.createMediaElementSource(audio);    
    var analyser = audioCtx.createAnalyser();
    
    analyser.smoothingTimeConstant = 0;
    
    source.connect(analyser);
    source.connect(audioCtx.destination);
    var bufferLength = analyser.frequencyBinCount;
    var frequencyData = new Uint8Array(bufferLength);
    var timeData = frequencyData;
    
    
    var x = 0;
    function renderFrame() {
        analyser.getByteFrequencyData(frequencyData);
        $("#frequency").val(frequencyData);
        console.log(frequencyData);
        draw(frequencyData);
        
        analyser.getByteTimeDomainData(timeData);
        $("#time").val(timeData);
    }
    
    var samples = $("#samples").val();
    var isPlaying = true;        
    audio.onplay = function() {        
        setInterval(function(){
            if (isPlaying)
                renderFrame();                
        }, samples);               
    };
    
    audio.addEventListener('ended', changeState, false);
    
    function changeState(){
        isPlaying = false;        
    }
    
    
    var canvas = document.getElementById('visualizer');
    var canvasCtx = canvas.getContext("2d");
    canvas.setAttribute('width', 800);
    canvas.setAttribute('height', 200);
    
    var drawVisual;
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var gradient = canvasCtx.createLinearGradient(0,0,0,300);
    gradient.addColorStop(1,'#000000');
    gradient.addColorStop(0.6,'#000000');
    gradient.addColorStop(0.4,'#ff0000');
    gradient.addColorStop(0.2,'#ffff00');
    gradient.addColorStop(0,'#ffffff');
            
    function draw(dataArray) {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        
        canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        
        var barWidth = (WIDTH / bufferLength) * 2;
        var barHeight;
        
        var x = 0;
        for(var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
        
            //canvasCtx.fillStyle = 'rgb(' + ( barHeight + 100 ) + ',50,50)';
            canvasCtx.fillStyle = gradient;
            canvasCtx.fillRect(x, HEIGHT-barHeight/2, barWidth, barHeight/2);

            x += barWidth + 1;
        }
    };

    
    
    /*
    var load = function(event) {
        source = audioCtx.createBufferSource();
        var input = event.target;       
        var reader = new FileReader();
        reader.onload = function(){
            var arrayBuffer = reader.result;
            audioContext.decodeAudioData(arrayBuffer, function(buffer) {
                source.buffer = buffer;
                // source.connect(audioCtx.destination);
                
            });
        }
        reader.readAsArrayBuffer(input.files[0]);
    }
    */
    
});