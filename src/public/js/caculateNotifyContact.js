function inCreaseNumberNotifyfContact(className) {
    let CrrValue = +$(`.${className}`).find("em").text();
    CrrValue += 1;
    if (CrrValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${CrrValue}</em>)`);
    }
};

function deCreaseNumberNotifyfContact(className) {
    let CrrValue = +$(`.${className}`).find("em").text();
    CrrValue -= 1;
    if (CrrValue === 0) {
        $(`.${className}`).html("");
    } else {
        $(`.${className}`).html(`(<em>${CrrValue}</em>)`);
    }
};