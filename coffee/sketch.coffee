range = _.range
logg = console.log

sum = (arr)	=> arr.reduce(((a, b) => a + b), 0)

NOQUEEN = [10,13,17,18,19,20,21,22,26,29,34,37,41,42,43,44,45,46,50,53]
N = 8
W = 0
H = 0
R = W//10
c = (n) => n %% N
r = (n) => n // N
rects = []

Queen = '♛'
Knight = '♘'
queen = 0
illegal = [] # indexes of squares taken by queen
targets = [] # indexes of squares that knight must visit
state = 0

knight = 0
clicks = 0
arrClicks = []	# number of clicks for each target
taken = 0
results = []

start = 0

window.onresize = -> reSize()

reSize = ->
	H = min(innerHeight//18,innerWidth//9)
	W = H
	H = W
	R = W//10
	resizeCanvas innerWidth, innerHeight
	rects = []
	margin = (innerWidth-8*W)//2
	for index in range N*N
		ri = r index
		ci = c index
		col = if (ri + ci) % 2 then 'yellow' else 'brown'
		x = W/2 + W * c index 
		y = H + H * r index
		rects.push new Rect index, margin+x, y, W,H, col

makeIllegals = =>
	for i in range N*N
		ci = c i
		ri = r i
		cq = c queen
		rq = r queen
		dc = abs ci - cq
		dr = abs ri - rq
		if ci == cq or ri == rq or dc == dr then illegal.push i

placeQueen = (index) =>
	if NOQUEEN.includes index
		logg 'No queen here'
		return

	queen = index
	makeIllegals()
	targets= range(N*N).filter (i) => not illegal.includes i
	knight = targets[0]
	arrClicks.push 0
	taken++
	state++
	results[results.length-1] = 'Move the knight to the coin'

newGame = () ->
	queen = 0
	illegal = []
	targets = []
	state = 0
	knight = 0
	clicks = 0
	arrClicks = []
	taken = 0
	start = new Date()

	if results.length == 0
		results.push 'Move the knight to the square with'
		results.push 'a coin, without moving to a square the'
		results.push 'queen can capture and without capturing'
		results.push 'the queen. Once accomplished the coin'
		results.push 'moves to the next square. Repeat until'
		results.push 'all possible squares are done.'
		results.push ''
		results.push 'Click on a square to place the queen'

moveKnight = (index) =>
	if illegal.includes index then return
	col = c index
	row = r index
	dx = abs col - c knight
	dy = abs row - r knight
	if dx*dx + dy*dy == 5
		knight = index
		clicks++
		if targets[taken] == knight
			taken++
			arrClicks.push clicks
			clicks = 0
	if taken == targets.length
		results.pop()
		results.push "#{qPosition()}: #{sum(arrClicks)} clicks took #{(new Date()-start)/1000} seconds"
		state = 2

class Rect
	constructor : (@index, @x,@y, @w,@h, @col) ->
	draw :  ->
		fill @col
		rect @x, @y, @w, @h
	inside : (x, y) -> abs(x-@x) <= W/2 and abs(y-@y) <= H/2
	click : -> if state==0 then placeQueen @index else moveKnight @index
	drawPiece : (name) ->
		textSize W
		fill "black"
		text name,@x,@y + 5
	drawDot : -> if @index != queen then ellipse @x, @y, 2*R
	text : (txt) ->
		textAlign CENTER, CENTER
		textSize 0.5*W
		fill 'black'
		text txt, @x, @y
	coin : =>
		noFill()
		push()
		strokeWeight 3
		ellipse @x, @y, 5*R
		pop()

setup = =>
	reSize()
	newGame()
	rectMode CENTER
	textAlign CENTER, CENTER
	createCanvas innerWidth, innerHeight

qPosition = ()-> "Q#{"abcdefgh"[c queen]}#{"87654321"[r queen]}"

info = ->
	fill 'black'
	textAlign CENTER, CENTER
	textSize 0.5*W
	for result,i in results
		text result,innerWidth//2, 9*H + i*H/2

drawBoard = () =>
	for rect in rects
		rect.draw()

draw = =>
	background 128
	drawBoard()
	info()

	textAlign CENTER, CENTER
	if state > 0
		rects[queen].drawPiece Queen
		rects[knight].drawPiece Knight

	for i in illegal
		rects[i].drawDot()

	textSize 0.55*W
	for i in range taken
		if targets[i] != knight
			rects[targets[i]].text arrClicks[i]

	if state == 1
		rects[targets[taken]].coin()

mousePressed = ->
	if state==2
		newGame()
		return
	for rect in rects
		if rect.inside mouseX, mouseY then rect.click()
