/*

Basic Chess Engine - JavaScript
2015 / 2021 Jonathan Abood
In Javascript for Django

This is a simple javascript chess AI, built in 2015 and later re-made to work in django.
I learned to make this following the tutorial from Bluefever Software on Youtube.The chess 
engine fundamentally works by considering the board state, then on its move, will consider 
all possible moves that it can make, then the oponents response moves to the new baord state 
and so on and so on (each time the board changes turn, that adds a 'layer' to the depth of the 
program). The AI then makes a decision based on which initial move has the highestmatieral 
gain at the end (i.e. capturing a queen would be work 9 points)

movegen.js houses the GenerateMoves function, which goes over every piece on a turn and forms 
all the legal moves that player can take on their turn.

board.js houses all the necessary data that we need to construct a standard chess board

defs.js houses some defines used by the chess AI

*/

// Initial function
$(function() {
	init();
	console.log("Main Init Called");	
	NewGame(START_FEN);
	GenerateMoves();
	PrintMoveList();
});

go();
window.addEventListener('resize', go);

function go(){
 	console.log('resize');
}

// Position key
/*
	The idea is we want to have a unique key to represent each position
	So lets say we have five pieces:

	p1 = RAND_32()
	p2 = RAND_32()
	p3 = RAND_32()
	p4 = RAND_32()
	p5 = RAND_32()

	Each piece has a unique key of 32 bits that represents it.
	Now inorder to make the position key, we exclusive or them all together (^=)

	xor is the process of 1101 ^= 0101 = 1000

	Now var key = 0
	key ^= p1
	key ^= p2
	key ^= p3
	key ^= p4
	key ^= p5

	then if we want to remove the first piece from the position key

	key ^= p1 easy. 

	This can make it easy to detect repetition in moves ( 3 times repitition is a draw)

*/
function InitHashKeys(){
	var idnex = 0;
	for(index = 0; index < 14*120; ++index){
		PieceKeys[index] = RAND_32();
	}

	SideKey = RAND_32();

	for(index = 0; index < 16; ++index){
		CastleKeys[index] = RAND_32();
	}

}

function InitFilesRanksBrd() {
	
	var index = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
	
	// Set all rank and file to offboard
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		FilesBrd[index] = SQUARES.OFFBOARD;
		RanksBrd[index] = SQUARES.OFFBOARD;
	}
	
	// step throught rank and files and denote the proper index for each
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			FilesBrd[sq] = file;
			RanksBrd[sq] = rank;
		}
	}
	
}

// A bad function that effectivley allows us to move along our 64 square board 
// when we are actually moving along the 120 square board.
function InitSq120To64() {

	var index = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
	var sq64 = 0;

	for(index = 0; index < BRD_SQ_NUM; ++index) {
		Sq120ToSq64[index] = 65;
	}
	
	for(index = 0; index < 64; ++index) {
		Sq64ToSq120[index] = 120;
	}
	
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}

}

function InitBoardVars() {

	var index = 0;
	for(index = 0; index < MAXGAMEMOVES; ++index) {
		GameBoard.history.push( {
			move : NOMOVE,
			castlePerm : 0,
			enPas : 0,
			fiftyMove : 0,
			posKey : 0
		});
	}	
	
	for(index = 0; index < PVENTRIES; ++index) {
		GameBoard.PvTable.push({
			move : NOMOVE,
			posKey : 0
		});
	}
}


// Function to initialise chess board squares (with ranks and files)
function InitBoardSquares(){
	var light = 1;
	var rankName;
	var fileName;
	var divString;
	var rankIter;
	var fileIter;
	var lightString;
	
	for(rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {
		light ^= 1;
		rankName = "rank" + (rankIter + 1);
		for(fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter++) {
			fileName = "file" + (fileIter + 1);
			if(light == 0) lightString="Light";
			else lightString = "Dark";
			light^=1;
			divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
			$("#Board").append(divString);
		}
	}
}

// Init function setup game
function init() {
	console.log("init() called");
	InitFilesRanksBrd();
	InitHashKeys();
	InitSq120To64();
	InitBoardVars();
	InitMvvLva();
	InitBoardSquares();
}