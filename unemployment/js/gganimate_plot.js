(function($) {
    $(document).ready(function() {
	
	$('#gganimate_plot').scianimator({
	    'images': ['images/gganimate_plot1.png', 'images/gganimate_plot2.png', 'images/gganimate_plot3.png', 'images/gganimate_plot4.png', 'images/gganimate_plot5.png', 'images/gganimate_plot6.png', 'images/gganimate_plot7.png', 'images/gganimate_plot8.png', 'images/gganimate_plot9.png'],
	    'width': 480,
	    'delay': 1000,
	    'loopMode': 'loop'
	});
	$('#gganimate_plot').scianimator('play');
    });
})(jQuery);
