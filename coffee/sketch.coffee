range = _.range
logg = console.log

intro = """
Click on a square to place the queen.
Avoid the dots and the queen.
The ring will move when taken.
Repeat for all squares.
Qa8 is an easy starter, 118 moves.
Qd5 is a good challenge, 158 moves.
""".split('\n')

sum = (arr)	=> arr.reduce(((a, b) => a + b), 0)

NOQUEEN = [3,4,10,13,17,18,19,20,21,22,24,26,29,31,32,34,37,39,41,42,43,44,45,46,50,53,59,60]
N = 8
W = 0
H = 0
R = W//10
c = (n) => 7 - n %% N
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
results = ['Move the knight to the ring']

start = 0

window.onresize = -> reSize()

reSize = ->
	H = min(innerHeight//13,innerWidth//9)
	W = H
	H = W
	R = W//10
	resizeCanvas innerWidth, innerHeight
	rects = []
	margin = (innerWidth-8*W)//2
	for index in range N*N
		ri = r index
		ci = c index
		col = if (ri + ci) % 2 then 'brown' else 'yellow'
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
	logg 'Q' + Position index
	if NOQUEEN.includes index
		logg 'No queen here'
		return

	queen = index
	makeIllegals()
	targets = range(N*N).filter (i) => not illegal.includes i
	knight = targets[0]
	arrClicks.push 0
	taken++
	state++

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
		# results.pop()
		results.push "Q#{Position queen}: #{sum(arrClicks)} moves took #{(new Date()-start)/1000} seconds"
		state = 2

class Rect
	constructor : (@index, @x,@y, @w,@h, @col) ->
	draw : ->
		fill @col
		rect @x, @y, @w, @h
	inside : (x, y) -> abs(x-@x) <= W/2 and abs(y-@y) <= H/2
	click : -> if state==0 then placeQueen @index else moveKnight @index
	drawPiece : (name) ->
		textSize 1.1 * W
		fill "black"
		text name,@x,@y
	drawDot : -> if @index != queen and (r(queen)+c(queen)) % 2 == 0 then ellipse @x, @y, 2*R
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

Position = (index) -> "#{"abcdefgh"[c index]}#{"87654321"[r index]}"

info = ->
	fill 'black'
	textAlign CENTER, CENTER
	textSize 0.5*W
	temp = if state==0 then intro else results
	for result,i in temp
		text result,innerWidth//2, 9*H + i*H/2

drawBoard = =>
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
