app.controller('boardcontroller', function($scope) {
	function Cell(row, column) {
		this.row = row;
		this.column = column;
	}
	//initialize out sudoku puzzle object
	$scope.puzzle = {}; 
	$scope.puzzle.dimensions =9;
	$scope.puzzle.board = [$scope.puzzle.dimensions]
	$scope.puzzle.moves = [];
	$scope.initialize = function () {
			//initialize the game board with empty values
			for(var i=0; i<$scope.puzzle.dimensions; i++) {
				$scope.puzzle.board[i] = [$scope.puzzle.dimensions];
				for(var j=0; j < $scope.puzzle.dimensions; j++) {
					$scope.puzzle.board[i][j] = undefined;
				}
			}
			initialized = true;
		}
		$scope.initialize();
		function getCandidateCell(board) {
			for(var i =0; i< $scope.puzzle.dimensions; ++i) {
				for(var j =0; j< $scope.puzzle.dimensions; ++j) {
					if(typeof(board[i][j]) == 'undefined' ) {
						return new Cell(i, j);
					}
				}
			}
			return null;
		}
		function place (board, row,column,value) {
			board[row][column] = value;
		}
		function unplace (board, row, column) {
			board[row][column] = undefined;
		}
		$scope.solve = function () {
		var  emptyCount =0 ; //
		for(var i =0; i < $scope.puzzle.dimensions; ++i) {
			for(var j =0; j < $scope.puzzle.dimensions; ++j) {
				if(typeof($scope.puzzle.board[i][j]) == 'undefined' ) {
					emptyCount++;
				}
			}
		}
		k=0;
		solveBoard($scope.puzzle.board, k, emptyCount);
	}

	function solveBoard (board, k, n) {
		var candidateCell;
		var candidates;
		candidateCell = getCandidateCell(board);
		if(k==n) {
			console.log("Puzzle has been solved");
			return true;
		}
		else{
			candidates = getPossibleCandidateValues(board, candidateCell);
			if(!candidates.length) {
				return false;
			}
			++k;
			for(var i =0; i< candidates.length; i++) {
				place(board, candidateCell.row, candidateCell.column, candidates[i])
				if(!solveBoard(board, k, n)) {
						//backtrack if there are no possible values for the current candidate cell
						unplace(board, candidateCell.row, candidateCell.column);	
					} else {
						return true;
					}		
				}
			}
			return false;
		}
	/**
	Determines the square grid that a particular 
	candidate row belongs to
	*/
	function determineCandidateSquares (cell) {
		var originRow = Math.floor(cell.row/3);
		originRow *=3;
		var endRow = originRow + 3;
		var originColumn = Math.floor(cell.column /3);
		originColumn *=3;
		var endColumn = originColumn + 3;
		return {
			p1 : originRow,
			p2 : endRow,
			p3 : originColumn,
			p4 : endColumn
		};
	}
	function assignCandidateState(board, arr, row, column) {
		if(typeof(board[row][column])!== 'undefined') {
			arr[ board[row][column] -1 ] = true; 
		}
	}
	function getPossibleCandidateValues (board, cell) {
		row    = [$scope.puzzle.dimensions];
		column = [$scope.puzzle.dimensions];
		square = [$scope.puzzle.dimensions];
		candidateValues = [];
		candidateSquare = determineCandidateSquares(cell);
		for(var i =0; i < $scope.puzzle.dimensions; i++) {
			row[i] = false;
			column[i] = false;
			square[i] = false;
		}
		for(var i =0; i < $scope.puzzle.dimensions; i++) {
			assignCandidateState(board,row, cell.row, i);
			assignCandidateState(board,column, i, cell.column);
		}

		//check the candidate square
		for(var i = candidateSquare.p1; i< candidateSquare.p2; ++i) {
			for(var j = candidateSquare.p3; j< candidateSquare.p4; ++j) {
				assignCandidateState(board, square, i, j);
			}
		}

		//now find possible candidates
		for(var i =0; i< $scope.puzzle.dimensions; i++) {
			if(! row[i] && !column[i] && !square[i]) {
				//this is a candiate 
				candidateValues.push(i+1);
			}
		}
		return candidateValues;
	}
});


