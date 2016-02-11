$(document).ready(function() {
    document.title = getCookie("company_name");
    $("#company_name").html(getCookie("company_name"));
    $("img#avatar").attr("src",getCookie("company_logo"));
});