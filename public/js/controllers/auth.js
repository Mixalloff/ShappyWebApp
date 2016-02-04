$(window).on('load', function () {
    var $preloader = $('#page-preloader'),
        $spinner   = $preloader.find('.spinner');
    $spinner.fadeOut();
    $preloader.delay(350).fadeOut('slow');
});

$(document).ready(function () {
    var formRegister = $("#signup");
    var formLogin = $("#signin");
    var spinner = Config.spinner;
    var tree = document.createElement("ul");
    var foo = function(array,parent)
    {
        for(var i = 0; i < array.length; i++)
        {
            if (array[i].children.length>0)
            {
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.innerHTML = array[i].name;
                li.appendChild(a);
                var ul = document.createElement("ul");
                ul.style.marginLeft = '25px';
                li.appendChild(ul);
                parent.appendChild(li);
                foo(array[i].children,ul);
            }
            else
            {
                var li = document.createElement("li.last");
                var a = document.createElement("a");
                a.innerHTML = array[i].name;
                a.setAttribute("id",array[i].id);
                li.appendChild(a);
                parent.appendChild(li);
            }

        }
        return parent;
    };

    $("#categories").on('click','li a', function() {
        var arr = $(this).siblings('ul');
        if (arr.length==1) {
            $(arr[0]).slideToggle();
        } else {
            $('#categories a').css("background-color","#fff").removeClass("active");
            $(this).css("background-color","#8FA0FF").addClass("active");
        }
    });
   document.getElementById("categories").appendChild(foo(all_categories,tree));
    //регистрация компании
    formRegister.submit(function (e) {
        spinner.start("spinner_register");
        e.preventDefault();
        var formData = new FormData(formRegister[0]);
        $.ajax({
            url: Config.registerCompany,
            type: "post",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (resultJSON) {
                if (resultJSON.type == "register")
                {
                    alertify.notify(Config.mesSuccessActivationEmail,'success');
                    $.fancybox.close();
                }
            },
            error: function (response) {
                spinner.stop();
                new Error(response.responseJSON.data,response.responseJSON.type).show();
            }
        });
    });


    //авторизация компании
    formLogin.submit(function (e) {
        e.preventDefault();
        spinner.start("spinner_login");
        $.ajax({
            url: Config.authorizeCompany,
            type: "post",
            data: formLogin.serialize(),
            success: function () {
                window.location.href = '/company';
            },
            error: function (response) {
                spinner.stop();
                new Error(response.responseJSON.data,response.responseJSON.type).show();
            }
        });
    });

    //показ pop-up форм
    $(".fancybox").fancybox({
        scrolling: 'no',
        helpers:
        {
            overlay:
            {
                css: { 'background': 'transparent' }
            }
        }
    });

    $(".toggle-mnu").click(function() {
        $(this).toggleClass("on");
        $(".hidden-menu").slideToggle();
        return false;
    });


    var carousel =  $("#owl");

    carousel.owlCarousel({
        items: 1,
        pagination: false,
        rewindNav: false,
        singleItem: true,
        afterMove: modify
    });

    function modify() {
        var owl = carousel.data('owlCarousel');
        $(".points ul li.active").removeClass("active");
        $(".points ul li").eq(owl.currentItem).addClass("active");
        hideArrow(owl.currentItem);
    }

    hideArrow(0);
    var owl = carousel.data('owlCarousel');

    $("#next").click(function() {
        owl.next();
    });
    $("#prev").click(function() {
        owl.prev();
    });

    $(".points ul li").click(function() {
        carousel.trigger('owl.jumpTo', $(this).index());
    });

    function hideArrow(active) {
        var countPoints = $(".points ul").children("li").length;
        if (active == 0) {
            $("#prev").css("display","none");
        }
        else if (active==countPoints-1) {
            $("#next").css("display","none");
        }
        else {
            $("#next,#prev").css("display","block");
        }
    }
});

$('a[href^="#"]').click( function(){
    var scroll_el = $(this).attr('href');
    if ($(scroll_el).length != 0) {
        $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
    }
    return false;
});



$(window).scroll(function(){
    var scroll = $(window).scrollTop();

    if (scroll > 0 ) {
        $('.top_menu').addClass('scrolled');
    }

    if (scroll <= 0 ) {
        $('.top_menu').removeClass('scrolled');
    }

});