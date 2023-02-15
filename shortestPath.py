from collections import deque

def pretty(path):
	letters = "abcdefgh"
	return " ".join(f"{letters[pos[1]]}{pos[0] + 1}" for pos in path)

def possible(pos, legal_pos):
	r, c = pos
	can = {
		(r + 2, c - 1), (r + 2, c + 1),
		(r + 1, c - 2), (r + 1, c + 2),
		(r - 1, c - 2), (r - 1, c + 2),
		(r - 2, c - 1), (r - 2, c + 1)
	}
	return can.intersection(legal_pos)

def print_path(path):
	letters = "abcdefgh"
	print(" ".join(f"{letters[pos[1]]}{pos[0] + 1}" for pos in path))

def solve(c,r):
	queen_pos = (c, r)

	# Squares the queen can visit
	illegal_pos = []
	for i in range(8):
		for j in range(8):
			if i==c or j==r or abs(i-c)==abs(j-r): 
				illegal_pos.append((i,j))
	illegal_pos = set(illegal_pos)

	# All the squares
	all_squares = {(x, y) for x in range(8) for y in range(8)}

	# All the legal squares for knight to visit
	legal_pos = all_squares - illegal_pos
	visits = sorted(legal_pos, reverse=True)

	# Squares visitable from a position
	hops = {pos: possible(pos, legal_pos) for pos in legal_pos}
	current_square = visits[0]
	total = []
	for square in visits:
		queue = deque([[current_square]])
		while queue:
			path = queue.popleft()
			last_pos = path[-1]
			if last_pos == square:
				total = total + path[1:]
				current_square = square
				break
			else:
				for p in hops[last_pos] - set(path):
					new_path = path + [p]
					queue.append(new_path)
	return total

NOQUEEN = [3,4,10,13,17,18,19,20,21,22,24,26,29,31,32,34,37,39,41,42,43,44,45,46,50,53,59,60]

with open("knight.txt", "w") as f:
	for r in range(8):
		for c in range(8):
			if r*8+c in NOQUEEN: continue
			res = solve(c,r)
			if len(res) > 0:
				f.write(f"{pretty([(c,r)])}: {len(res)} {pretty(res)}\n")
