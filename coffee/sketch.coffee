range = _.range
logg = console.log

cirkel = (x, y, r) ->	ellipse x, y, 2 * r, 2 * r

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
	inside : (x, y) -> @x <= x <= @x + @w and @y <= y <= @y + @h
	click : -> if state==0 then placeQueen @index else moveKnight @index

setup = =>
	W = innerWidth//9
	H = W
	R = W//10
	newGame()
	textAlign CENTER, CENTER
	createCanvas windowWidth, windowHeight
	for index in range N*N
		ri = r index
		ci = c index
		col = if (ri + ci) % 2 then 'yellow' else 'brown'
		x = W/2 + W * c index
		y = H/2 + H * r index
		rects.push new Rect index, x, y, W,H, col
	
qPosition = ()-> "Q#{"abcdefgh"[c queen]}#{"87654321"[r queen]}"

info = ->
	fill 'black'
	textAlign LEFT, CENTER
	textSize 0.5*W
	for result,i in results
		text result,0.5*W, 9*H + i*H/2

drawBoard = () =>
	for rect in rects
		rect.draw()

drawIllegals = ->
	for i in illegal
		if i != queen
			x = W + W * c i
			y = H + H * r i
			cirkel x, y, R

drawPiece = (piece, name) ->
	x = W + W * c piece
	y = H + H * r piece 
	text name,x,y + 5

draw = =>
	background 128
	drawBoard()
	info()

	textAlign CENTER, CENTER
	textSize W
	fill "black"
	if state > 0
		drawPiece queen,Queen
		drawPiece knight,Knight

	drawIllegals()

	textSize 0.55*W
	for i in range taken
		if targets[i] != knight
			x = W + W * c targets[i]
			y = H + H * r targets[i]
			text arrClicks[i],x,y + 5

	if state == 1
		x = W + W * c targets[taken]
		y = H + H * r targets[taken]
		noFill()
		cirkel x,y,2*R

mousePressed = ->
	if state==2
		newGame()
		return
	for rect in rects
		if rect.inside mouseX, mouseY then rect.click()
