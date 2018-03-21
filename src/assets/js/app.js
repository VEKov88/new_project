$(document).ready(function(){
	$(".btn-link").on("click", function(){
		$("body").append('<div class="modals-container"><div class="modals"><a href="javascript:void(0)" class="modals__close"></a><form action="" class="modals__form"><div class="container"><div class="row"><div class="col-12 text-center"><div class="modals__titel">Заполните заявку:</div></div><div class="col-12 text-center"><input class="modals__element" type="text" placeholder="Ваше имя"></div><div class="col-12 text-center"><input class="modals__element" type="tel" placeholder="Ваш телефон"></div><div class="col-12 text-center"><label class="modals__btn">Перезвонить мне<input type="button" class="d-none"></label></div></div></div></form></div><div class="overlay"></div></div>'/**/);
		$(".modals-container").css("display","flex");
	    	$(".modals-container").fadeIn(800);
	    	$(".overlay , .modals__close").click(function(){
	      		$(".modals-container").fadeOut(800);
	      		setTimeout(function() {  
	      			$(".modals-container").css("display","none");
	      			$(".modals-container").remove(); 
	      		}, 800);
	    	});
	});



	$(".card").on("click",function(){
		var img = $(this).find(".card__foto");
		var src = img.attr("src");
		$("body").append("<div class='popup'>"+ 
             "<div class='popup__bg'></div>"+ 
             "<img src='"+src+"' class='popup__img' >"+ 
             "</div>"); 
    	$(".popup").css("display","flex");
    	$(".popup").fadeIn(800);
    	$(".popup__bg").click(function(){
      		$(".popup").fadeOut(800);
      		setTimeout(function() {  
      			$(".popup").css("display","none");
        		$(".popup").remove(); 
      		}, 800);
    	});
	});
});
