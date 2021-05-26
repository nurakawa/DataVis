(function($) {
    $(document).ready(function() {
	
	$('#gganimate_plot1').scianimator({
	    'images': ['images/gganimate_plot11.png', 'images/gganimate_plot12.png', 'images/gganimate_plot13.png', 'images/gganimate_plot14.png', 'images/gganimate_plot15.png', 'images/gganimate_plot16.png', 'images/gganimate_plot17.png', 'images/gganimate_plot18.png', 'images/gganimate_plot19.png'],
	    'width': 480,
	    'delay': 1000,
	    'loopMode': 'loop'
	});
	$('#gganimate_plot1').scianimator('play');
    });
})(jQuery);
