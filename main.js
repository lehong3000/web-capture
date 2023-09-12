const storageKey = 'WebCaptureData';
const defaultConf = {
    pushUrl: '/PushData',
    pushInterval: 5000,
    imageQuality: 1
};

const getConf = function () {
    return {
        ...defaultConf,
        ...JSON.parse(localStorage.getItem(storageKey) ?? '{}')
    };
}

const setConf = function (seter) {
    var current = getConf();
    localStorage.setItem(storageKey, JSON.stringify(seter(current)));
}

const guid = function () {
    var s4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (s4() + s4() + "-" + s4() + "-4" + s4().substring(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
};

const submit = function (image) {
    const iframeName = '_id_' + guid();

    const form = document.createElement('form');
    form.method = 'post';
    form.action = getConf().pushUrl;
    form.style.display = 'none';

    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.position = 'absolute';
    iframe.style.width = 0;
    iframe.style.height = 0;
    iframe.style.marginLeft = '-1px';
    iframe.style.marginTop = '-1px';
    iframe.style.border = 'none';
    iframe.onload = function () {
        if (!form.dataset.firstload) {
            form.dataset.firstload = true;

            form.target = iframeName;
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = 'token';
            hiddenField.value = image;
            form.appendChild(hiddenField);
            form.submit();
        } else {
            iframe.remove();
            form.remove();
            console.log(image);
        }
    }

    document.body.appendChild(form);
    document.body.appendChild(iframe);
}

const startCapture = async function () {
    if (window.capturing === true) {
        return;
    }
    console.log('start-capture');
    const displayMediaOptions = {
        video: {
            displaySurface: "window",
        },
        audio: false,
    };
    const videoElem = document.createElement("video");
    videoElem.autoplay = true;
    const canvasElem = document.createElement("canvas");
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        stream.getVideoTracks()[0].onended = stopCapture;
        videoElem.srcObject = stream
        window.capturing = true;
    } catch (e) { 
        console.error(e);
    }

    const loop = function () {
        if (window.capturing === true) {
            const { width, height } = videoElem.srcObject.getVideoTracks()[0].getSettings();
            canvasElem.width = width;
            canvasElem.height = height;
            console.log('Media size', { width: width, height: height });
            canvasElem.getContext('2d').drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);
            var jpeg = canvasElem.toDataURL('image/jpeg', getConf().imageQuality);
            console.log(jpeg);
            setTimeout(loop, getConf().pushInterval);
        }
    };
    loop();
}

const stopCapture = async function () {
    window.capturing = false;
    console.log('stop-capture');
}

window.onkeyup = function (event) {
    if (event.altKey === true && event.ctrlKey === true && event.key == 'c') {
        while (true) {
            var cmd = prompt('Command:');
            if (cmd == 'exit') {
                break;
            }
            if (cmd == 'start') {
                startCapture();
                break;
            }
            if (cmd == 'url') {
                setConf(function (current) {
                    current.pushUrl = prompt('Push URL: ' + current.pushUrl);
                });
            }
            if (cmd == 'conf') {
                alert(JSON.stringify(getConf()));
            }
            if (cmd == 'time') {
                setConf(function (current) {
                    var num = parseInt(prompt('Push interval: ' + current.pushInterval));
                    num = isNaN(num) ? 0 : num;
                    num = num < 1000 ? 1000 : num;
                    current.pushInterval = num;
                    return current;
                });
            }
            if (cmd == 'quality') {
                setConf(function (current) {
                    var num = parseFloat(prompt('Image quality: ' + current.imageQuality));
                    num = isNaN(num) ? 0 : num;
                    num = num > 1 ? 1 : num;
                    num = num < 0 ? 0 : num;
                    current.imageQuality = num;
                    return current;
                });
            }
            //imageQuality
        }
    }
}