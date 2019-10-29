function inCreaseNumberNotification(className) {
    let CrrValue = +$(`.${className}`).text();
    CrrValue += 1;
    if (CrrValue === 0) {
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(CrrValue);
    }
};

function deCreaseNumberNotification(className) {
    let CrrValue = +$(`.${className}`).text();
    CrrValue -= 1;
    if (CrrValue === 0) {
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(CrrValue);
    }
};