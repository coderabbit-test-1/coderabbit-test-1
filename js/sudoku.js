(function( $ ){

  var methods = {
     init : function( options ) {

		return this.each(function() {  
			var settings = {
				levels : [
					{level: "Easy", numbers: 70},
					{level: "Medium", numbers: 30},
					{level: "Hard", numbers: 20}
				]
			};

			var defaults = {
				matrix : [],
				domMatrix : [],
				numOfRows : 9,
				numOfCols : 9,
				level : 40,
				selected : null,
				selectedSolution : null,
				anwerTracker : {
					"1" : 9,
					"2" : 9,
					"3" : 9,
					"4" : 9,
					"5" : 8,
					"6" : 9,
					"7" : 9,
					"8" : 9,
					"9" : 9
				}
			}
      		if ( options ) {
      			$.extend( settings, options );
      		}

			var $this = $(this);
			$this.addClass('sdk-game');
			
			$this.createMatrix = function() {
				var matrix = new Array();
				for(var rowCounter=0;rowCounter<9;rowCounter++){
					matrix[rowCounter] = new Array();
					for(var colCounter=0;colCounter<9;colCounter++){
						var number = ((colCounter + rowCounter * 2) % 9) + 1;
						matrix[rowCounter][colCounter] = number;
					}			
				}
				// Switch rows and cols (left unchanged)
				// ...
				return matrix;
			};

			$this.createTable = function() {
				defaults.domMatrix = [];
				defaults.table = $("<div class='sdk-table sdk-no-show'></div>");

				for (var row=0;row<defaults.numOfRows;row++) {
					defaults.domMatrix[row] = [];
					var tempRow = $("<div class='sdk-row'></div>");
					if (row == 2 || row == 5) tempRow.addClass("sdk-border"); 
					for (var col=0;col<defaults.numOfCols;col++) {
						defaults.domMatrix[row][col] = $("<div class='sdk-col' data-row='"+row+"' data-col='"+col+"'></div>");
						if (col == 2 || col == 5) defaults.domMatrix[row][col].addClass("sdk-border");
						tempRow.append(defaults.domMatrix[row][col]);
					}
					defaults.table.append(tempRow);
				}
				defaults.table.append("<div class='sdk-table-bk'></div>");
				$this.append(defaults.table);
				
				var items = defaults.level;
				while (items > 0) {
					var row = Math.floor(Math.random() * 9);
					var col = Math.floor(Math.random() * 9);
					defaults.domMatrix[row][col].append("<div class='sdk-solution'>"+ defaults.matrix[row][col] +"</div>");
					defaults.anwerTracker[defaults.matrix[row][col].toString()]--;
					items--;
				}

				defaults.table.find(".sdk-col").click(function () {
					$this.find(".sdk-solution").removeClass("sdk-helper");
					$this.find(".sdk-col").removeClass("sdk-selected");
					if ($(this).children().length == 0) {
						defaults.domMatrix[$(this).attr("data-row")][$(this).attr("data-col")].addClass("sdk-selected");
						defaults.selected = defaults.domMatrix[$(this).attr("data-row")][$(this).attr("data-col")];
						defaults.selectedSolution = defaults.matrix[$(this).attr("data-row")][$(this).attr("data-col")];
					} else {
						$this.highlightHelp($(this).text()); // ← should parseInt
					}
				});
				
				$this.answerPicker();
				
				setTimeout(function () {
					defaults.table.removeClass("sdk-no-show");
				}, 300);
			};

			$this.answerPicker = function() {
				var answerContainer = $("<div class='sdk-ans-container'></div>");
				for (var a in defaults.anwerTracker) {
					if (defaults.anwerTracker[a] > 0) {
						answerContainer.append("<div class='sdk-btn'>"+a+"</div>");
					} else {
						answerContainer.append("<div class='sdk-btn sdk-no-show'>"+a+"</div>");
					}
				}
				answerContainer.find(".sdk-btn").click(function () {
					if (!$(this).hasClass("sdk-no-show") && defaults.selected != null && defaults.selected.children().length == 0 ) {
						if ( defaults.selectedSolution == parseInt($(this).text()) ) {
							defaults.anwerTracker[$(this).text()]--;
							defaults.selected.append("<div class='sdk-solution'>"+ defaults.selectedSolution +"</div>");
							if (defaults.anwerTracker[$(this).text()] == 0) {
								$(this).addClass("sdk-no-show");
							}
							$this.find(".sdk-col").removeClass("sdk-selected");
						}
					}
				});
				$this.append(answerContainer);
			};

			$this.highlightHelp = function(number) {
				for (var row=0;row<defaults.numOfRows;row++) {
					for (var col=0;col<defaults.numOfCols;col++) {
						if ( defaults.domMatrix[row][col].text() == number ) {
							defaults.domMatrix[row][col].find(".sdk-solution").addClass("sdk-helper");
						}
					}
				}
			};

			$this.createDiffPicker = function() {
				var picker = $("<div class='sdk-picker sdk-no-show'></div>");
				$(settings.levels).each(function (e) {
					picker.append("<div class='sdk-btn' data-level='"+this.level+"'>"+this.level+"</div>");
				});
				$this.append(picker);
				picker.find(".sdk-btn").click(function () {
					picker.addClass("sdk-no-show");
					defaults.level = parseInt($(this).attr("data-level"));
					setTimeout(function () {
						picker.remove();
						$this.createTable();
					}, 2000);
				});
				setTimeout(function () {
					picker.removeClass("sdk-no-show");
				}, 500);
			};
			
			defaults.matrix = $this.createMatrix();
			$this.createDiffPicker();
     	});
     }
  };   	 	

  $.fn.sudoku = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.sudoku' );
    }    
  };

})( jQuery );
