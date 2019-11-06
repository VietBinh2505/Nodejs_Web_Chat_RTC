function inCreaseNumberNotification(className, number) {
    let CrrValue = +$(`.${className}`).text();
    CrrValue += number;
    if (CrrValue === 0) {
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(CrrValue);
    }
}; 

function deCreaseNumberNotification(className, number) {
    let CrrValue = +$(`.${className}`).text();
    CrrValue -= number;
    if (CrrValue === 0) {
        $(`.${className}`).css("display", "none").html("");
    } else {
        $(`.${className}`).css("display", "block").html(CrrValue);
    }
};