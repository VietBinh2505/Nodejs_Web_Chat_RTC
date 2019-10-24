let gethome = (req, res) => {
    return res.render("main/home/home", {
        errors: req.flash("errors"), //định nghĩa errors là gì rồi truyền ra views
        success: req.flash("success"), //định nghĩa success là gì rồi truyền ra views
    });
};
module.exports = {
    gethome: gethome,
};