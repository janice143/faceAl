const video = document.querySelector('#video')
// const canvas = document.querySelector('#canvas')

Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    // faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    // faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    // faceapi.nets.tinyYolov2.loadFromUri('/models')
]).then(startVideo)
// 
function startVideo(){
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
        console.log(localMediaStream);     
        video.srcObject = localMediaStream;
        video.play();
      })
      .catch(err => {
        console.error(`OH NO!!!`, err);
      });  
}
// startVideo();
video.addEventListener('play',()=>{
    // console.log("aa")
    // Creating a Canvas Element from an Image or Video Element
    const canvas = faceapi.createCanvas(video);
    document.body.append(canvas)
    const displaySize = {width:video.width,height:video.height}
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async()=>{
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    },50)
    console.log(faceapi.draw)
})
// console.log(faceapi.nets.tinyFaceDetector.loadFromUri('/models'))

