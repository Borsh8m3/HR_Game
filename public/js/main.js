window.onload = async function() {

    //start the webgazer tracker
    function updateGazeDot(data) {
        var dot = document.getElementById('gazeDot');
        if (!dot) return;
        if (data && Number.isFinite(data.x) && Number.isFinite(data.y)) {
            dot.style.left = data.x + 'px';
            dot.style.top = data.y + 'px';
            dot.style.display = 'block';
        } else {
            dot.style.display = 'none';
        }
    }

    await webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //.setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
          updateGazeDot(data);
        })
        .saveDataAcrossSessions(true)
        .begin();

        webgazer.showVideoPreview(true) /* shows all video previews */
            .showPredictionPoints(false) /* enable built-in WebGazer gaze dot */
            .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

        // fallback polling in case gaze listener lags or isn't firing immediately
        setInterval(async function() {
            var prediction = await webgazer.getCurrentPrediction();
            updateGazeDot(prediction);
        }, 100);
    //Set up the webgazer video feedback.
    var setup = function() {

        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };
    setup();

};

// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = true;

window.onbeforeunload = function() {
    webgazer.end();
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart(){
    document.getElementById("Accuracy").innerHTML = "<a>" + t('cal.notCalibrated') + "</a>";
    webgazer.clearData();
    ClearCalibration();
    PopUpInstruction();
}
