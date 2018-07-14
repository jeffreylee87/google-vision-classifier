
var vid = document.querySelector("#videoElement");
let localStream;
//const mediaVid = new HTMLMediaElement();
const mediaSource = new MediaSource();
const mediaStream = new MediaStream();


function startCam() {
    $('#snap').show();
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }
    
    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
    
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
    
        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
        }
    }
    
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(function(stream) {
         const video = document.querySelector('video');
        // Older browsers may not have srcObject
        if ("srcObject" in video) {
        video.srcObject = stream;
        } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function(e) {
        video.play();
        };
    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message);
    });
}

function closeCam() {
    console.log('close');
    $('#snap').hide();  
    let stream = vid.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function(track) {
        track.stop();
    });

  vid.srcObject = null;

}
 //---------------------
      // TAKE A SNAPSHOT CODE
      //---------------------
var canvas, ctx;

function init() {
    // Get the canvas and obtain a context for
    // drawing in it
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');
}

function snapshot() { 
    $('#snap').hide();   
      
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d'); 
    ctx.drawImage(vid, 0,0, canvas.width, canvas.height);        
    dataURL = canvas.toDataURL('image/png');    
    

    const dataSent = {
        key: dataURL
    }
   
                
    $.ajax({
    type: "POST",
    url: "/api/logo",
    data: dataSent,
    success: ((res) => {
        
        $('#api-result').text(res.arr1[0]);
        $("#api-result2").text(res.arr1[1]);
        $('#api-result3').text(res.arr2);
        $('#api-result4').text(res.arr3);
        
       
        $('#snap').show();
    }),
    dataType: "json"
    });       
}
      


////// click button for history check it out
$(".dbHistory").one("click", function(event) {
    event.preventDefault();
    $.get("/api/logo", function(data) {
      if (data.length !== 0) {
    
        for (let i = 0; i < data.length; i++) {
          var div = $("<div></div>")
          var row = $("<div>");
          row.addClass("lineItem");
          row.append(div);
    
          div.append(`<p>ID ${data[i].id}:<br> Best Guess: ${data[i].name}<br>Description: ${data[i].summary} <br>`);
         
          $(".history").prepend(row);
    
        }
    
      }
    
    })
});    
