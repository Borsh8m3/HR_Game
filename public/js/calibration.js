var PointCalibrate = 0;
var CalibrationPoints={};

// Find the help modal
var helpModal;

/**
 * Clear the canvas and the calibration button.
 */
function ClearCanvas(){
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('display', 'none');
  });
  var canvas = document.getElementById("plotting_canvas");
  if (canvas) {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Show the instruction of using calibration at the start up screen.
 */
function PopUpInstruction(){
  ClearCanvas();
  swal({
    title: t('cal.instrTitle'),
    text: t('cal.instrText'),
    buttons:{
      cancel: false,
      confirm: true
    }
  }).then(isConfirm => {
    ShowCalibrationPoint();
  });

}
/**
  * Show the help instructions right at the start.
  */
function helpModalShow() {
    if(!helpModal) {
        helpModal = new bootstrap.Modal(document.getElementById('helpModal'))
    }
    helpModal.show();
}

function calcAccuracy() {
    // show modal
    // notification for the measurement process
    swal({
        title: t('cal.calcAccTitle'),
        text: t('cal.calcAccText'),
        closeOnEsc: false,
        allowOutsideClick: false,
        closeModal: true
    }).then( () => {
        // makes the variables true for 5 seconds & plots the points
    
        store_points_variable(); // start storing the prediction points
    
        sleep(5000).then(() => {
                stop_storing_points_variable(); // stop storing the prediction points
                var past50 = webgazer.getStoredPoints(); // retrieve the stored points
                var precision_measurement = calculatePrecision(past50);
                
                var accElement = document.getElementById("Accuracy");
                if (accElement) {
                    var accuracyLabel = "<a>" + t('cal.accuracyBadge', {pct: precision_measurement}) + "</a>";
                    accElement.innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
                }

swal({
                    title: t('cal.precisionTitle', {pct: precision_measurement}),
                    text: t('cal.calibrationDoneText'),
                    icon: precision_measurement > 50 ? "success" : "warning",
                    allowOutsideClick: false,
                    buttons: {
                        cancel: t('cal.retryCalibration'),
                        confirm: t('cal.goToGame')
                    }
                }).then(isConfirm => {
                        if (isConfirm){
                            ClearCanvas();
                            // Jawnie włączamy śledzenie wzroku - jeśli wcześniej wybrano
                            // "Graj bez kamery", ta flaga zostałaby na 'false' na stałe
                            // mimo udanej kalibracji, i gra pomijałaby kamerę.
                            localStorage.setItem('trackingEnabled', 'true');
                            localStorage.setItem('isCalibrated', 'true');
                            webgazer.pause();
                            window.location.href = "setup.html";
                        } else {
                            if (accElement) {
                                accElement.innerHTML = "<a>" + t('cal.notCalibrated') + "</a>";
                            }
                            webgazer.clearData();
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPoint();
                        }
                });
        });
    });
}

/**
 * Give up on camera calibration and continue straight to game setup
 * without any gaze tracking.
 */
function skipCalibration() {
    try {
        if (typeof webgazer !== 'undefined') {
            webgazer.end();
        }
    } catch (err) {
        console.warn('webgazer.end() failed while skipping calibration:', err);
    }
    localStorage.setItem('trackingEnabled', 'false');
    localStorage.setItem('isCalibrated', 'true');
    window.location.href = "setup.html";
}

function calPointClick(node) {
    const id = node.id;

    if (!CalibrationPoints[id]){ // initialises if not done
        CalibrationPoints[id]=0;
    }
    CalibrationPoints[id]++; // increments values

    if (CalibrationPoints[id]==5){ //only turn to yellow after 5 clicks
        node.style.setProperty('background-color', 'yellow');
        node.setAttribute('disabled', 'disabled');
        PointCalibrate++;
    }else if (CalibrationPoints[id]<5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.2*CalibrationPoints[id]+0.2;
        node.style.setProperty('opacity', opacity);
    }

    //Show the middle calibration point after all other points have been clicked.
    if (PointCalibrate == 8){
        document.getElementById('Pt5').style.removeProperty('display');
    }

    if (PointCalibrate >= 9){ // last point is calibrated
        // grab every element in Calibration class and hide them except the middle point.
        document.querySelectorAll('.Calibration').forEach((i) => {
            i.style.setProperty('display', 'none');
        });
        document.getElementById('Pt5').style.removeProperty('display');

        // clears the canvas
        var canvas = document.getElementById("plotting_canvas");
        if (canvas) {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }

        // Calculate the accuracy
        calcAccuracy();
    }
}

/**
 * Load this function when the index page starts.
* This function listens for button clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
function docLoad() {
  ClearCanvas();
  helpModalShow();
    
    // click event on the calibration buttons
    document.querySelectorAll('.Calibration').forEach((i) => {
        i.addEventListener('click', () => {
            calPointClick(i);
        })
    })
};
window.addEventListener('load', docLoad);

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.removeProperty('display');
  });
  // initially hides the middle button
  document.getElementById('Pt5').style.setProperty('display', 'none');
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration(){
  // Clear data from WebGazer

  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('background-color', 'red');
    i.style.setProperty('opacity', '0.2');
    i.removeAttribute('disabled');
  });

  CalibrationPoints = {};
  PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}