range = _.range
logg = console.log

cirkel = (x, y, r) ->	ellipse x, y, 2 * r, 2 * r

NOQUEEN = [10,13,17,18,19,20,21,22,26,29,34,37,41,42,43,44,45,46,50,53]
N = 8
W = 40
H = 40
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
		
class Rect
	constructor : (@index, @x,@y, @w,@h, @col) ->
	draw :  ->
		fill @col
		rect @x, @y, @w, @h
	inside : (x, y) -> @x <= x <= @x + @w and @y <= y <= @y + @h
	click : -> if state==0 then placeQueen @index else moveKnight @index

setup = =>
	logg 'setup'
	textAlign CENTER, CENTER
	createCanvas windowWidth, windowHeight
	for index in range N*N
		ri = r index
		ci = c index
		col = if (ri + ci) % 2 then 'yellow' else 'brown'
		x = W * c index
		y = H * r index
		rects.push new Rect index, x, y, W,H, col

draw = =>
	background 128
	for rect in rects
		rect.draw()

	textSize W
	if state==1
		x = W/2 + W * c queen
		y = H/2 + H * r queen 
		fill "black"
		text Queen,x,y + 5
		x = W/2 + W * c knight
		y = H/2 + H * r knight
		text Knight,x,y + 5

	for i in illegal
		if i != queen
			x = W/2 + W * c i
			y = H/2 + H * r i
			cirkel x, y, R

	textSize 0.55*W
	for i in range taken
		if targets[i] != knight
			x = W/2 + W * c targets[i]
			y = H/2 + H * r targets[i]
			text arrClicks[i],x,y + 5

	if state == 1
		x = W/2 + W * c targets[taken]
		y = H/2 + H * r targets[taken]
		noFill()
		cirkel x,y,2*R

mousePressed = ->
	for rect in rects
		if rect.inside mouseX, mouseY then rect.click()
