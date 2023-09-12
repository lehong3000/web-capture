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
    const displayMediaOptions = {
        video: {
            displaySurface: "window",
        },
        audio: false,
    };
    const videoElem = document.createElement("video");
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

}

window.onkeyup = function (event) {
    if (event.key == 'S' && !window.capturing) {
        window.capturing = true;
        startCapture();
    }
    if (event.key == 'X' && window.capturing) {
        stopCapture();
        window.capturing = false;
    }
}