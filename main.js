const storageKey = 'WebCaptureData'

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
    form.action = '/PushData';
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
    window.capturing = true;
    console.log('start-capture');
    const displayMediaOptions = {
        video: {
            displaySurface: "window",
        },
        audio: false,
    };
    const videoElem = document.createElement("video");
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    videoElem.srcObject.getVideoTracks()[0].onended = stopCapture;
}

const stopCapture = async function () {
    console.log('stop-capture');
    window.capturing = false;
}

window.onkeyup = function (event) {
    if (event.altKey === true && event.ctrlKey === true && event.key == 'c') {
        var cmd = prompt('Command:');
        if (cmd == 'start') {
            startCapture();
        }
        if (cmd == 'url') {
            var current = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
            var postUrl = prompt('Post URL: ' + (current.postUrl ?? '/PushData'));
            current.postUrl = postUrl ?? '/PushData';
            localStorage.setItem(storageKey, JSON.stringify(current));
        }
        if (cmd == 'conf') {
            alert(localStorage.getItem(storageKey) ?? '{}');
        }
    }
}