$(document).ready(function() {
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
            $("#show_categories span").html( $(this).html());
        }
    });
   document.getElementById("categories").appendChild(foo(all_categories,tree));


    $("#show_categories").click(function() {
        $("div#categories").slideToggle();
    })
});