// Generated by CoffeeScript 2.5.1
var H, Knight, N, NOQUEEN, Queen, R, Rect, W, arrClicks, c, clicks, draw, drawBoard, illegal, info, knight, logg, makeIllegals, mousePressed, moveKnight, newGame, placeQueen, qPosition, queen, r, range, reSize, rects, results, setup, start, state, sum, taken, targets,
  modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

range = _.range;

logg = console.log;

sum = (arr) => {
  return arr.reduce(((a, b) => {
    return a + b;
  }), 0);
};

NOQUEEN = [10, 13, 17, 18, 19, 20, 21, 22, 26, 29, 34, 37, 41, 42, 43, 44, 45, 46, 50, 53];

N = 8;

W = 0;

H = 0;

R = Math.floor(W / 10);

c = (n) => {
  return modulo(n, N);
};

r = (n) => {
  return Math.floor(n / N);
};

rects = [];

Queen = '♛';

Knight = '♘';

queen = 0;

illegal = []; // indexes of squares taken by queen

targets = []; // indexes of squares that knight must visit

state = 0;

knight = 0;

clicks = 0;

arrClicks = []; // number of clicks for each target

taken = 0;

results = [];

start = 0;

window.onresize = function() {
  return reSize();
};

reSize = function() {
  var ci, col, index, j, len, margin, ref, results1, ri, x, y;
  H = min(Math.floor(innerHeight / 18), Math.floor(innerWidth / 9));
  W = H;
  H = W;
  R = Math.floor(W / 10);
  resizeCanvas(innerWidth, innerHeight);
  rects = [];
  margin = Math.floor((innerWidth - 8 * W) / 2);
  ref = range(N * N);
  results1 = [];
  for (j = 0, len = ref.length; j < len; j++) {
    index = ref[j];
    ri = r(index);
    ci = c(index);
    col = (ri + ci) % 2 ? 'yellow' : 'brown';
    x = W / 2 + W * c(index);
    y = H + H * r(index);
    results1.push(rects.push(new Rect(index, margin + x, y, W, H, col)));
  }
  return results1;
};

makeIllegals = () => {
  var ci, cq, dc, dr, i, j, len, ref, results1, ri, rq;
  ref = range(N * N);
  results1 = [];
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    ci = c(i);
    ri = r(i);
    cq = c(queen);
    rq = r(queen);
    dc = abs(ci - cq);
    dr = abs(ri - rq);
    if (ci === cq || ri === rq || dc === dr) {
      results1.push(illegal.push(i));
    } else {
      results1.push(void 0);
    }
  }
  return results1;
};

placeQueen = (index) => {
  if (NOQUEEN.includes(index)) {
    logg('No queen here');
    return;
  }
  queen = index;
  makeIllegals();
  targets = range(N * N).filter((i) => {
    return !illegal.includes(i);
  });
  knight = targets[0];
  arrClicks.push(0);
  taken++;
  state++;
  return results[results.length - 1] = 'Move the knight to the coin';
};

newGame = function() {
  queen = 0;
  illegal = [];
  targets = [];
  state = 0;
  knight = 0;
  clicks = 0;
  arrClicks = [];
  taken = 0;
  start = new Date();
  if (results.length === 0) {
    results.push('Move the knight to the square with');
    results.push('a coin, without moving to a square the');
    results.push('queen can capture and without capturing');
    results.push('the queen. Once accomplished the coin');
    results.push('moves to the next square. Repeat until');
    results.push('all possible squares are done.');
    results.push('');
    return results.push('Click on a square to place the queen');
  }
};

moveKnight = (index) => {
  var col, dx, dy, row;
  if (illegal.includes(index)) {
    return;
  }
  col = c(index);
  row = r(index);
  dx = abs(col - c(knight));
  dy = abs(row - r(knight));
  if (dx * dx + dy * dy === 5) {
    knight = index;
    clicks++;
    if (targets[taken] === knight) {
      taken++;
      arrClicks.push(clicks);
      clicks = 0;
    }
  }
  if (taken === targets.length) {
    results.pop();
    results.push(`${qPosition()}: ${sum(arrClicks)} clicks took ${(new Date() - start) / 1000} seconds`);
    return state = 2;
  }
};

Rect = class Rect {
  constructor(index1, x1, y1, w, h, col1) {
    this.coin = this.coin.bind(this);
    this.index = index1;
    this.x = x1;
    this.y = y1;
    this.w = w;
    this.h = h;
    this.col = col1;
  }

  draw() {
    fill(this.col);
    return rect(this.x, this.y, this.w, this.h);
  }

  inside(x, y) {
    return abs(x - this.x) <= W / 2 && abs(y - this.y) <= H / 2;
  }

  click() {
    if (state === 0) {
      return placeQueen(this.index);
    } else {
      return moveKnight(this.index);
    }
  }

  drawPiece(name) {
    textSize(W);
    fill("black");
    return text(name, this.x, this.y + 5);
  }

  drawDot() {
    if (this.index !== queen && (r(queen) + c(queen)) % 2 === 0) {
      return ellipse(this.x, this.y, 2 * R);
    }
  }

  text(txt) {
    textAlign(CENTER, CENTER);
    textSize(0.5 * W);
    fill('black');
    return text(txt, this.x, this.y);
  }

  coin() {
    noFill();
    push();
    strokeWeight(3);
    ellipse(this.x, this.y, 5 * R);
    return pop();
  }

};

setup = () => {
  reSize();
  newGame();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  return createCanvas(innerWidth, innerHeight);
};

qPosition = function() {
  return `Q${"abcdefgh"[c(queen)]}${"87654321"[r(queen)]}`;
};

info = function() {
  var i, j, len, result, results1;
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(0.5 * W);
  results1 = [];
  for (i = j = 0, len = results.length; j < len; i = ++j) {
    result = results[i];
    results1.push(text(result, Math.floor(innerWidth / 2), 9 * H + i * H / 2));
  }
  return results1;
};

drawBoard = () => {
  var j, len, rect, results1;
  results1 = [];
  for (j = 0, len = rects.length; j < len; j++) {
    rect = rects[j];
    results1.push(rect.draw());
  }
  return results1;
};

draw = () => {
  var i, j, k, len, len1, ref;
  background(128);
  drawBoard();
  info();
  textAlign(CENTER, CENTER);
  if (state > 0) {
    rects[queen].drawPiece(Queen);
    rects[knight].drawPiece(Knight);
  }
  for (j = 0, len = illegal.length; j < len; j++) {
    i = illegal[j];
    rects[i].drawDot();
  }
  textSize(0.55 * W);
  ref = range(taken);
  for (k = 0, len1 = ref.length; k < len1; k++) {
    i = ref[k];
    if (targets[i] !== knight) {
      rects[targets[i]].text(arrClicks[i]);
    }
  }
  if (state === 1) {
    return rects[targets[taken]].coin();
  }
};

mousePressed = function() {
  var j, len, rect, results1;
  if (state === 2) {
    newGame();
    return;
  }
  results1 = [];
  for (j = 0, len = rects.length; j < len; j++) {
    rect = rects[j];
    if (rect.inside(mouseX, mouseY)) {
      results1.push(rect.click());
    } else {
      results1.push(void 0);
    }
  }
  return results1;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxTQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxZQUFBLEVBQUEsWUFBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLE9BQUE7RUFBQTs7QUFBQSxLQUFBLEdBQVEsQ0FBQyxDQUFDOztBQUNWLElBQUEsR0FBTyxPQUFPLENBQUM7O0FBRWYsR0FBQSxHQUFNLENBQUMsR0FBRCxDQUFBLEdBQUE7U0FBUyxHQUFHLENBQUMsTUFBSixDQUFXLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFBLEdBQUE7V0FBVSxDQUFBLEdBQUk7RUFBZCxDQUFELENBQVgsRUFBOEIsQ0FBOUI7QUFBVDs7QUFFTixPQUFBLEdBQVUsQ0FBQyxFQUFELEVBQUksRUFBSixFQUFPLEVBQVAsRUFBVSxFQUFWLEVBQWEsRUFBYixFQUFnQixFQUFoQixFQUFtQixFQUFuQixFQUFzQixFQUF0QixFQUF5QixFQUF6QixFQUE0QixFQUE1QixFQUErQixFQUEvQixFQUFrQyxFQUFsQyxFQUFxQyxFQUFyQyxFQUF3QyxFQUF4QyxFQUEyQyxFQUEzQyxFQUE4QyxFQUE5QyxFQUFpRCxFQUFqRCxFQUFvRCxFQUFwRCxFQUF1RCxFQUF2RCxF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QUFDLEtBQUwsQ0FBQSxHQUFuQztLQUFBLE1BQUE7NEJBQUE7O0VBREQsQ0FBQTs7QUFKYyIsInNvdXJjZXNDb250ZW50IjpbInJhbmdlID0gXy5yYW5nZVxyXG5sb2dnID0gY29uc29sZS5sb2dcclxuXHJcbnN1bSA9IChhcnIpXHQ9PiBhcnIucmVkdWNlKCgoYSwgYikgPT4gYSArIGIpLCAwKVxyXG5cclxuTk9RVUVFTiA9IFsxMCwxMywxNywxOCwxOSwyMCwyMSwyMiwyNiwyOSwzNCwzNyw0MSw0Miw0Myw0NCw0NSw0Niw1MCw1M11cclxuTiA9IDhcclxuVyA9IDBcclxuSCA9IDBcclxuUiA9IFcvLzEwXHJcbmMgPSAobikgPT4gbiAlJSBOXHJcbnIgPSAobikgPT4gbiAvLyBOXHJcbnJlY3RzID0gW11cclxuXHJcblF1ZWVuID0gJ+KZmydcclxuS25pZ2h0ID0gJ+KZmCdcclxucXVlZW4gPSAwXHJcbmlsbGVnYWwgPSBbXSAjIGluZGV4ZXMgb2Ygc3F1YXJlcyB0YWtlbiBieSBxdWVlblxyXG50YXJnZXRzID0gW10gIyBpbmRleGVzIG9mIHNxdWFyZXMgdGhhdCBrbmlnaHQgbXVzdCB2aXNpdFxyXG5zdGF0ZSA9IDBcclxuXHJcbmtuaWdodCA9IDBcclxuY2xpY2tzID0gMFxyXG5hcnJDbGlja3MgPSBbXVx0IyBudW1iZXIgb2YgY2xpY2tzIGZvciBlYWNoIHRhcmdldFxyXG50YWtlbiA9IDBcclxucmVzdWx0cyA9IFtdXHJcblxyXG5zdGFydCA9IDBcclxuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IC0+IHJlU2l6ZSgpXHJcblxyXG5yZVNpemUgPSAtPlxyXG5cdEggPSBtaW4oaW5uZXJIZWlnaHQvLzE4LGlubmVyV2lkdGgvLzkpXHJcblx0VyA9IEhcclxuXHRIID0gV1xyXG5cdFIgPSBXLy8xMFxyXG5cdHJlc2l6ZUNhbnZhcyBpbm5lcldpZHRoLCBpbm5lckhlaWdodFxyXG5cdHJlY3RzID0gW11cclxuXHRtYXJnaW4gPSAoaW5uZXJXaWR0aC04KlcpLy8yXHJcblx0Zm9yIGluZGV4IGluIHJhbmdlIE4qTlxyXG5cdFx0cmkgPSByIGluZGV4XHJcblx0XHRjaSA9IGMgaW5kZXhcclxuXHRcdGNvbCA9IGlmIChyaSArIGNpKSAlIDIgdGhlbiAneWVsbG93JyBlbHNlICdicm93bidcclxuXHRcdHggPSBXLzIgKyBXICogYyBpbmRleCBcclxuXHRcdHkgPSBIICsgSCAqIHIgaW5kZXhcclxuXHRcdHJlY3RzLnB1c2ggbmV3IFJlY3QgaW5kZXgsIG1hcmdpbit4LCB5LCBXLEgsIGNvbFxyXG5cclxubWFrZUlsbGVnYWxzID0gPT5cclxuXHRmb3IgaSBpbiByYW5nZSBOKk5cclxuXHRcdGNpID0gYyBpXHJcblx0XHRyaSA9IHIgaVxyXG5cdFx0Y3EgPSBjIHF1ZWVuXHJcblx0XHRycSA9IHIgcXVlZW5cclxuXHRcdGRjID0gYWJzIGNpIC0gY3FcclxuXHRcdGRyID0gYWJzIHJpIC0gcnFcclxuXHRcdGlmIGNpID09IGNxIG9yIHJpID09IHJxIG9yIGRjID09IGRyIHRoZW4gaWxsZWdhbC5wdXNoIGlcclxuXHJcbnBsYWNlUXVlZW4gPSAoaW5kZXgpID0+XHJcblx0aWYgTk9RVUVFTi5pbmNsdWRlcyBpbmRleFxyXG5cdFx0bG9nZyAnTm8gcXVlZW4gaGVyZSdcclxuXHRcdHJldHVyblxyXG5cclxuXHRxdWVlbiA9IGluZGV4XHJcblx0bWFrZUlsbGVnYWxzKClcclxuXHR0YXJnZXRzPSByYW5nZShOKk4pLmZpbHRlciAoaSkgPT4gbm90IGlsbGVnYWwuaW5jbHVkZXMgaVxyXG5cdGtuaWdodCA9IHRhcmdldHNbMF1cclxuXHRhcnJDbGlja3MucHVzaCAwXHJcblx0dGFrZW4rK1xyXG5cdHN0YXRlKytcclxuXHRyZXN1bHRzW3Jlc3VsdHMubGVuZ3RoLTFdID0gJ01vdmUgdGhlIGtuaWdodCB0byB0aGUgY29pbidcclxuXHJcbm5ld0dhbWUgPSAoKSAtPlxyXG5cdHF1ZWVuID0gMFxyXG5cdGlsbGVnYWwgPSBbXVxyXG5cdHRhcmdldHMgPSBbXVxyXG5cdHN0YXRlID0gMFxyXG5cdGtuaWdodCA9IDBcclxuXHRjbGlja3MgPSAwXHJcblx0YXJyQ2xpY2tzID0gW11cclxuXHR0YWtlbiA9IDBcclxuXHRzdGFydCA9IG5ldyBEYXRlKClcclxuXHJcblx0aWYgcmVzdWx0cy5sZW5ndGggPT0gMFxyXG5cdFx0cmVzdWx0cy5wdXNoICdNb3ZlIHRoZSBrbmlnaHQgdG8gdGhlIHNxdWFyZSB3aXRoJ1xyXG5cdFx0cmVzdWx0cy5wdXNoICdhIGNvaW4sIHdpdGhvdXQgbW92aW5nIHRvIGEgc3F1YXJlIHRoZSdcclxuXHRcdHJlc3VsdHMucHVzaCAncXVlZW4gY2FuIGNhcHR1cmUgYW5kIHdpdGhvdXQgY2FwdHVyaW5nJ1xyXG5cdFx0cmVzdWx0cy5wdXNoICd0aGUgcXVlZW4uIE9uY2UgYWNjb21wbGlzaGVkIHRoZSBjb2luJ1xyXG5cdFx0cmVzdWx0cy5wdXNoICdtb3ZlcyB0byB0aGUgbmV4dCBzcXVhcmUuIFJlcGVhdCB1bnRpbCdcclxuXHRcdHJlc3VsdHMucHVzaCAnYWxsIHBvc3NpYmxlIHNxdWFyZXMgYXJlIGRvbmUuJ1xyXG5cdFx0cmVzdWx0cy5wdXNoICcnXHJcblx0XHRyZXN1bHRzLnB1c2ggJ0NsaWNrIG9uIGEgc3F1YXJlIHRvIHBsYWNlIHRoZSBxdWVlbidcclxuXHJcbm1vdmVLbmlnaHQgPSAoaW5kZXgpID0+XHJcblx0aWYgaWxsZWdhbC5pbmNsdWRlcyBpbmRleCB0aGVuIHJldHVyblxyXG5cdGNvbCA9IGMgaW5kZXhcclxuXHRyb3cgPSByIGluZGV4XHJcblx0ZHggPSBhYnMgY29sIC0gYyBrbmlnaHRcclxuXHRkeSA9IGFicyByb3cgLSByIGtuaWdodFxyXG5cdGlmIGR4KmR4ICsgZHkqZHkgPT0gNVxyXG5cdFx0a25pZ2h0ID0gaW5kZXhcclxuXHRcdGNsaWNrcysrXHJcblx0XHRpZiB0YXJnZXRzW3Rha2VuXSA9PSBrbmlnaHRcclxuXHRcdFx0dGFrZW4rK1xyXG5cdFx0XHRhcnJDbGlja3MucHVzaCBjbGlja3NcclxuXHRcdFx0Y2xpY2tzID0gMFxyXG5cdGlmIHRha2VuID09IHRhcmdldHMubGVuZ3RoXHJcblx0XHRyZXN1bHRzLnBvcCgpXHJcblx0XHRyZXN1bHRzLnB1c2ggXCIje3FQb3NpdGlvbigpfTogI3tzdW0oYXJyQ2xpY2tzKX0gY2xpY2tzIHRvb2sgI3sobmV3IERhdGUoKS1zdGFydCkvMTAwMH0gc2Vjb25kc1wiXHJcblx0XHRzdGF0ZSA9IDJcclxuXHJcbmNsYXNzIFJlY3RcclxuXHRjb25zdHJ1Y3RvciA6IChAaW5kZXgsIEB4LEB5LCBAdyxAaCwgQGNvbCkgLT5cclxuXHRkcmF3IDogIC0+XHJcblx0XHRmaWxsIEBjb2xcclxuXHRcdHJlY3QgQHgsIEB5LCBAdywgQGhcclxuXHRpbnNpZGUgOiAoeCwgeSkgLT4gYWJzKHgtQHgpIDw9IFcvMiBhbmQgYWJzKHktQHkpIDw9IEgvMlxyXG5cdGNsaWNrIDogLT4gaWYgc3RhdGU9PTAgdGhlbiBwbGFjZVF1ZWVuIEBpbmRleCBlbHNlIG1vdmVLbmlnaHQgQGluZGV4XHJcblx0ZHJhd1BpZWNlIDogKG5hbWUpIC0+XHJcblx0XHR0ZXh0U2l6ZSBXXHJcblx0XHRmaWxsIFwiYmxhY2tcIlxyXG5cdFx0dGV4dCBuYW1lLEB4LEB5ICsgNVxyXG5cdGRyYXdEb3QgOiAtPiBpZiBAaW5kZXggIT0gcXVlZW4gYW5kIChyKHF1ZWVuKStjKHF1ZWVuKSkgJSAyID09IDAgdGhlbiBlbGxpcHNlIEB4LCBAeSwgMipSXHJcblx0dGV4dCA6ICh0eHQpIC0+XHJcblx0XHR0ZXh0QWxpZ24gQ0VOVEVSLCBDRU5URVJcclxuXHRcdHRleHRTaXplIDAuNSpXXHJcblx0XHRmaWxsICdibGFjaydcclxuXHRcdHRleHQgdHh0LCBAeCwgQHlcclxuXHRjb2luIDogPT5cclxuXHRcdG5vRmlsbCgpXHJcblx0XHRwdXNoKClcclxuXHRcdHN0cm9rZVdlaWdodCAzXHJcblx0XHRlbGxpcHNlIEB4LCBAeSwgNSpSXHJcblx0XHRwb3AoKVxyXG5cclxuc2V0dXAgPSA9PlxyXG5cdHJlU2l6ZSgpXHJcblx0bmV3R2FtZSgpXHJcblx0cmVjdE1vZGUgQ0VOVEVSXHJcblx0dGV4dEFsaWduIENFTlRFUiwgQ0VOVEVSXHJcblx0Y3JlYXRlQ2FudmFzIGlubmVyV2lkdGgsIGlubmVySGVpZ2h0XHJcblxyXG5xUG9zaXRpb24gPSAoKS0+IFwiUSN7XCJhYmNkZWZnaFwiW2MgcXVlZW5dfSN7XCI4NzY1NDMyMVwiW3IgcXVlZW5dfVwiXHJcblxyXG5pbmZvID0gLT5cclxuXHRmaWxsICdibGFjaydcclxuXHR0ZXh0QWxpZ24gQ0VOVEVSLCBDRU5URVJcclxuXHR0ZXh0U2l6ZSAwLjUqV1xyXG5cdGZvciByZXN1bHQsaSBpbiByZXN1bHRzXHJcblx0XHR0ZXh0IHJlc3VsdCxpbm5lcldpZHRoLy8yLCA5KkggKyBpKkgvMlxyXG5cclxuZHJhd0JvYXJkID0gKCkgPT5cclxuXHRmb3IgcmVjdCBpbiByZWN0c1xyXG5cdFx0cmVjdC5kcmF3KClcclxuXHJcbmRyYXcgPSA9PlxyXG5cdGJhY2tncm91bmQgMTI4XHJcblx0ZHJhd0JvYXJkKClcclxuXHRpbmZvKClcclxuXHJcblx0dGV4dEFsaWduIENFTlRFUiwgQ0VOVEVSXHJcblx0aWYgc3RhdGUgPiAwXHJcblx0XHRyZWN0c1txdWVlbl0uZHJhd1BpZWNlIFF1ZWVuXHJcblx0XHRyZWN0c1trbmlnaHRdLmRyYXdQaWVjZSBLbmlnaHRcclxuXHJcblx0Zm9yIGkgaW4gaWxsZWdhbFxyXG5cdFx0cmVjdHNbaV0uZHJhd0RvdCgpXHJcblxyXG5cdHRleHRTaXplIDAuNTUqV1xyXG5cdGZvciBpIGluIHJhbmdlIHRha2VuXHJcblx0XHRpZiB0YXJnZXRzW2ldICE9IGtuaWdodFxyXG5cdFx0XHRyZWN0c1t0YXJnZXRzW2ldXS50ZXh0IGFyckNsaWNrc1tpXVxyXG5cclxuXHRpZiBzdGF0ZSA9PSAxXHJcblx0XHRyZWN0c1t0YXJnZXRzW3Rha2VuXV0uY29pbigpXHJcblxyXG5tb3VzZVByZXNzZWQgPSAtPlxyXG5cdGlmIHN0YXRlPT0yXHJcblx0XHRuZXdHYW1lKClcclxuXHRcdHJldHVyblxyXG5cdGZvciByZWN0IGluIHJlY3RzXHJcblx0XHRpZiByZWN0Lmluc2lkZSBtb3VzZVgsIG1vdXNlWSB0aGVuIHJlY3QuY2xpY2soKVxyXG4iXX0=
//# sourceURL=c:\github\2023-008-KnightMoves\coffee\sketch.coffee